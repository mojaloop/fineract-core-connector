/*************************************************************************
 *  (C) Copyright Mojaloop Foundation. 2024 - All rights reserved.        *
 *                                                                        *
 *  This file is made available under the terms of the license agreement  *
 *  specified in the corresponding source code repository.                *
 *                                                                        *
 *  ORIGINAL AUTHOR:                                                      *
 *       James Bush - jbush@mojaloop.io                                   *
 *                                                                        *
 *  CONTRIBUTORS:                                                         *
 *       James Bush - jbush@mojaloop.io                                   *
 *************************************************************************/

import * as util from 'util';
import { ApiContext } from '../types';
import { IPostQuoteRequestBody, IPostQuoteResponseBody, IPostTransferRequestBody, PartyIdType } from '../interfaces';
import {
    IFineractClient,
    IFineractClientAccounts,
    IFineractPostTransactionResponse,
    IFineractSearchResponse,
} from '../interfaces';
import { IGeneralError } from '../errors';
import { InboundRequester, RequesterOptions } from '../requests';


const handleError = (err: Error, ctx: ApiContext, responseCode = 500) => {
    ctx.state.logger.error(err);
    ctx.response.type = 'text/plain'; // 'application/html';
    ctx.response.body = err.toString();
    ctx.response.status = (err as unknown as IGeneralError)?.httpResponseCode || responseCode;
};


const getInboundRequester = (ctx: ApiContext): InboundRequester => {
    const inboundRequesterOps: RequesterOptions = {
        baseURL: ctx.state.conf.backendEndpoint,
        timeout: ctx.state.conf.requestTimeout,
        logger: ctx.state.logger,
        additionalHeaders: {
            Authorization: `Basic ${ctx.state.conf.backendBasicAuth}`,
            'Fineract-Platform-TenantId': `${ctx.state.conf.backendTenantId}`,
        },
    };
    return new InboundRequester(inboundRequesterOps);
};


const getFineractClientAccounts = async (clientId: number, ctx: ApiContext): Promise<IFineractClientAccounts> => {
    // do a lookup in the fineract backend API
    const inboundRequester: InboundRequester = getInboundRequester(ctx);

    const clientAccounts = await inboundRequester.getClientAccounts(clientId);
    return clientAccounts.data;
};


const validateClientAccount = async (clientId: number, currency: string, ctx: ApiContext) => {
    // check the party has the appropriate account to receive this transfer type
    const clientAccounts: IFineractClientAccounts = await getFineractClientAccounts(clientId, ctx);

    // we target the first account the user has of the configured type
    const targetAccount = clientAccounts.savingsAccounts
        .find(a => a.shortProductName === ctx.state.conf.targetFineractAccountShortName);

    if(!targetAccount) {
        throw new Error('Client does not have an account of the configured type');
    }

    if(!targetAccount.status.active
        || targetAccount.subStatus.block
        || targetAccount.subStatus.blockCredit) {
        throw new Error('Client account is not able to accept deposits');
    }

    // check the target account is in the requested currency
    if(targetAccount.currency.code !== currency) {
        throw new Error('Client account is not in requested currency');
    }

    return targetAccount;
};


const getFineractClientByMSISDN = async (msisdn: string, ctx: ApiContext): Promise<IFineractClient> => {
    // do a lookup in the fineract backend API
    const inboundRequester = getInboundRequester(ctx);

    // run a search on the fineract API to look for an entity with matching MSISDN
    // note that fineract doesnt support a direct lookup on MSISDN so we have to use the search API which will
    // return results for parties with full or partial matches of MSISDN against their fineract phone no. field.
    const backendResponse = await inboundRequester.lookupTransferParty(msisdn);
    const entities: IFineractSearchResponse = backendResponse.data as IFineractSearchResponse;

    ctx.state.logger.log(`Got party search response from fineract for msisdn '${msisdn}': ${util.inspect(entities)}`);

    if(entities.length < 1) {
        // this is a 404
        throw new Error('No matching party found');
    }

    if(entities.length > 1) {
        // more than 1 client with same mobile number. allowable in fineract but a problem for our world.
        // todo: how to resolve to the correct customer?
        throw new Error(`Found more than 1 party (${entities.length}) with specified identifier`);
    }

    if(entities[0].entityMobileNo !== msisdn) {
        // oops, the msisdn is not a perfect match. fineract search may have been optimistic
        throw new Error('No matching party found');
    }

    // now get the full details on this fineract client (customer)
    const client = await inboundRequester.getClient(entities[0].entityId);
    return client.data;
};


// eslint-disable-next-line consistent-return
const handlePartyLookupByMSISDN = async (ctx: ApiContext): Promise<void> => {
    try {
        const client: IFineractClient = await getFineractClientByMSISDN(ctx.params.idValue, ctx);

        // check the client is active
        if(!client.active) {
            // client is not active, respond with a not found
            return handleError(new Error('Party found but is not active'), ctx, 404);
        }

        ctx.response.body = {
            idType: ctx.params.idType,
            idValue: ctx.params.idValue,
            displayName: client.displayName,
            firstName: client.firstname,
            lastName: client.lastname,
        };
        ctx.response.status = 200;
    } catch (e: any) {
        ctx.state.logger.log(`Error making request to Fineract API: ${e}`);
        return handleError(e, ctx, 500);
    }
};


const postQuotes = async (ctx: ApiContext): Promise<void> => {
    const payload = ctx.request.body as unknown as IPostQuoteRequestBody;

    try {
        if(!payload.quoteId) throw new Error('Missing quoteId on incoming request.');

        let client: IFineractClient;

        // check the client exists and is active
        switch (payload.to.idType) {
            case PartyIdType.MSISDN:
                client = await getFineractClientByMSISDN(payload.to.idValue, ctx);
                break;

            default:
                throw new Error(`Unsupported party identifier type: '${payload.to.idType}'`);
        }

        if(!client.active) {
            throw new Error('Party found but is not active');
        }

        await validateClientAccount(client.id, payload.currency, ctx);

        // todo: look for product config in fineract to find applicable fees and charges etc...

        const response = {
            quoteId: payload.quoteId,
            transactionId: payload.transactionId,
            transferAmount: payload.amount,
            transferAmountCurrency: payload.currency,
            payeeReceiveAmount: payload.amount,
            payeeReceiveAmountCurrency: payload.currency,
        } as IPostQuoteResponseBody;

        if(payload.expiration) {
            response.expiration = payload.expiration;
        }

        ctx.response.body = response;
        ctx.response.status = 200;
        ctx.response.type = 'application/json';
    } catch (err: unknown) {
        handleError(err as Error, ctx);
    }
};


// eslint-disable-next-line no-async-promise-executor
const postTransfers = async (ctx: ApiContext): Promise<void> => {
    const payload = ctx.request.body as unknown as IPostTransferRequestBody;

    try {
        let client: IFineractClient;

        // check the client exists and is active
        switch (payload.to.idType) {
            case PartyIdType.MSISDN:
                client = await getFineractClientByMSISDN(payload.to.idValue, ctx);
                break;

            default:
                throw new Error(`Unsupported party identifier type: '${payload.to.idType}'`);
        }

        if(!client.active) {
            throw new Error('Party found but is not active');
        }

        const targetAccount = await validateClientAccount(client.id, payload.currency, ctx);

        const inboundRequester = getInboundRequester(ctx);

        const result = await inboundRequester.postSavingsAccountDeposit(targetAccount.accountNo, {
            locale: 'en',
            dateFormat: 'yyyy-MM-dd\'T\'HH:mm:ss.SSSX',
            transactionDate: new Date().toISOString(),
            transactionAmount: Number(payload.amount),
            paymentTypeId: ctx.state.conf.fineractDepositPaymentType,
            receiptNumber: payload.transferId,
            bankNumber: payload.from.fspId || 'Incoming Mojaloop Scheme Payment',
        });

        if(result.status !== 200) {
            // the fineract backend returned an error
            const errorMessage = `Failed to post incoming transfer with id ${payload.transferId} to client with id ${client.id} account with id ${targetAccount.accountNo}`;
            ctx.state.logger.push(result.data).log(errorMessage);
            handleError(new Error(errorMessage), ctx, 500);
        }

        const fineractTransaction: IFineractPostTransactionResponse = result.data;

        ctx.response.status = 200;
        ctx.response.body = {
            homeTransactionId: `${fineractTransaction.officeId}-${fineractTransaction.clientId}-${fineractTransaction.savingsId}-${fineractTransaction.resourceId}`,
        };
    } catch (err: unknown) {
        handleError(err as Error, ctx);
    }
};


// eslint-disable-next-line no-async-promise-executor
const getParties = async (ctx: ApiContext): Promise<unknown> => new Promise<void>(async resolve => {
    switch (ctx.params.idType) {
        case PartyIdType.MSISDN:
            await handlePartyLookupByMSISDN(ctx);
            return resolve();

        default:
            handleError(new Error('Unsupported party identifier type'), ctx, 500);
            return resolve();
    }
});

export const InboundHandlers = {
    postQuotes,
    postTransfers,
    getParties,
};
