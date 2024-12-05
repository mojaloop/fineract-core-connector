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

export interface IExtensionItem {
    key: string,
    value: string,
}

export interface IErrorInformation {
    errorCode: string,
    errorDescription: string,
    extensionList?: Array<IExtensionItem>
}

export interface IErrorResponse {
    statusCode: string,
    message: string,
}

export enum AmountType {
    SEND = 'SEND',
    RECEIVE = 'RECEIVE',
}

export enum TransactionType {
    TRANSFER = 'TRANSFER',
}

export enum MojaloopTransferState {
    RECEIVED = 'RECEIVED',
    RESERVED = 'RESERVED',
    COMMITTED = 'COMMITTED',
    ABORTED = 'ABORTED',
}

export enum TransferStatus {
    WAITING_FOR_PARTY_ACCEPTANCE = 'WAITING_FOR_PARTY_ACCEPTANCE',
    WAITING_FOR_QUOTE_ACCEPTANCE = 'WAITING_FOR_QUOTE_ACCEPTANCE',
    COMPLETED = 'COMPLETED',
    ERROR_OCCURRED = 'ERROR_OCCURED',
}

export interface IMoney {
    currency: string,
    amount: string
}

export enum PartyIdType {
    MSISDN = 'MSISDN',
    ACCOUNT_ID = 'ACCOUNT_ID',
    EMAIL = 'EMAIL',
    PERSONAL_ID = 'PERSONAL_ID',
    BUSINESS = ' BUSINESS',
    DEVICE = 'DEVICE',
    IBAN = 'IBAN',
    ALIAS = 'ALIAS',
}

export interface IPartiesByIdParams {
    idType: PartyIdType.ACCOUNT_ID,
    idValue: string
}

export enum PartiesCurrentState {
    WAITING_FOR_REQUEST_PARTY_INFORMATION = 'WAITING_FOR_REQUEST_PARTY_INFORMATION',
    COMPLETED = 'COMPLETED',
    ERROR_OCCURRED = 'ERROR_OCCURED',
}

export interface IPartiesByIdResponse {
    body: {
        party: IParty,
        currentState: PartiesCurrentState
    }
}

export interface IParty {
    accounts?: Array<IAccount>,
    partyIdInfo: IPartyIdInfo,
    merchantClassificationCode?: string,
    name: string,
    personalInfo?: IPartyPersonalInfo
}

export interface IAccount {
    address: string,
    currency: string,
    description: string
}

export interface IPartyIdInfo {
    partyIdType: PartyIdType,
    partyIdentifier: string,
    partySubIdOrType?: string,
    fspId: string,
    extensionList?: Array<IExtensionItem>
}

export interface IPartyPersonalInfo {
    complexName: IPartyComplexName,
    dateOfBirth: string
}

export interface IPartyComplexName {
    firstName: string,
    middleName: string,
    lastName: string,
}

export enum PayerType {
    CONSUMER = 'CONSUMER',
    AGENT = 'AGENT',
    BUSINESS = 'BUSINESS',
    DEVICE = 'DEVICE',
}

export interface ITransferParty {
    type?: PayerType,
    idType: PartyIdType,
    idValue: string,
    idSubValue?: string,
    displayName?: string,
    firstName?: string,
    middleName?: string,
    lastName?: string,
    dateOfBirth?: string,
    merchantClassificationCode?: string,
    fspId?: string,
    extensionList?: Array<IExtensionItem>
}

export interface IPostQuotesBody {
    homeTransactionId: string,
    from: ITransferParty,
    to: ITransferParty,
    amountType: AmountType,
    currency: string,
    amount: string,
    transactionType: TransactionType,
    note?: string,
    quoteRequestExtensions?: Array<IExtensionItem>,
    transferRequestExtension?: Array<IExtensionItem>,
    skipPartyLookup: boolean
}

export interface IPostQuotesResponseBody {
    quoteId?: string,
    transferAmount: IMoney,
    payeeReceiveAmount?: IMoney,
    payeeFspFee?: IMoney,
    payeeFspCommission?: IMoney,
    expiration: Date,
    geoCode?: {
        longitude: string,
        latitude: string
    },
    ilpPacket: string,
    condition: string,
    extensionList?: Array<IExtensionItem>,
}

export interface ITransferFulfilment {
    transferState: MojaloopTransferState,
    fulfilment?: string,
    completedTimestamp?: string,
    extensionList?: Array<IExtensionItem>
}

export interface ITransferState {
    transferId?: string,
    homeTransactionId?: string,
    from: ITransferParty,
    to: ITransferParty | Array<ITransferParty>,
    amountType: AmountType,
    currency: string,
    amount: string,
    transactionType: TransactionType,
    note?: string,
    currentState?: TransferStatus,
    quoteId?: string,
    getPartiesResponse?: {
        body: Record<string, unknown>
        headers?: Record<string, unknown>
    },
    quoteResponse?: {
        body: IPostQuotesResponseBody,
        headers?: Record<string, unknown>
    },
    quoteResponseSource?: string,
    fulfil?: {
        body: ITransferFulfilment,
        headers?: Record<string, unknown>
    },
    lastError?: Record<string, unknown>,
    skipPartyLookup?: boolean,
    quoteRequestExtensions: Array<IExtensionItem>
}

export type ITransferSuccess = ITransferState;

export interface ITransferContinuationQuote {
    acceptQuote: boolean,
    additionalProperties?: string
}

export interface ITransferBadRequest {
    statusCode?: string,
    message?: string,
    transferState: ITransferState
}

export type ITransferServerError = ITransferBadRequest;

export type ITransferTimeoutError = ITransferBadRequest;

export type ITransferError = ITransferBadRequest | ITransferServerError | ITransferTimeoutError;
