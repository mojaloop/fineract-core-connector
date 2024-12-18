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

import {
    AmountType,
    IExtensionItem,
    IPostQuotesResponseBody,
    ITransferParty, PayerType,
    TransactionType,
} from './common';


export interface IPostQuoteRequestBody {
    quoteId: string,
    transactionId: string,
    amount: string,
    currency: string,
    expiration?: string,
    to: ITransferParty,
    from: ITransferParty,
    amountType: AmountType,
    feesAmount?: string,
    feesCurrency?: string,
    transactionType?: TransactionType,
    initiator?: string,
    initiatorType?: PayerType,
    geoCode?: {
        longitude: string,
        latitude: string
    },
    note?: string,
    extensionList?: Array<IExtensionItem>
}

export interface IPostQuoteResponseBody {
    quoteId: string,
    transactionId: string,
    transferAmount: string,
    transferAmountCurrency: string,
    payeeReceiveAmount: string,
    payeeReceiveAmountCurrency: string,
    expiration?: string,
}

export interface IPostTransferRequestBody {
    transferId: string,
    amount: string,
    currency: string,
    quote: IPostQuotesResponseBody,
    from: ITransferParty,
    to: ITransferParty,
    amountType: AmountType,
    transactionType: TransactionType,
    note?: string
    quoteRequestExtensions: Array<IExtensionItem>,
    ilpPacket: any, // TODO: define the ILP Packet object
    extensionList?: Array<IExtensionItem>
}
