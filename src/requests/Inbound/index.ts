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

import { AxiosResponse } from 'axios';
import { buildJSONHeaders } from '../headers';
import { BaseRequester } from '../baseRequester';
import { IFineractClient, IFineractClientAccounts, IFineractPostTransactionBody, IFineractPostTransactionResponse } from '~interfaces';

export default class Requester extends BaseRequester {
    lookupTransferParty = (msisdn: string): Promise<AxiosResponse<any>> => this.axiosInstance.get('/search', { headers: buildJSONHeaders(), params: { query: `${msisdn}`, resource: 'clients' } });

    getClient = (clientId: number): Promise<AxiosResponse<IFineractClient>> => this.axiosInstance.get(`/clients/${clientId}`, { headers: buildJSONHeaders() });

    getClientAccounts = (clientId: number): Promise<AxiosResponse<IFineractClientAccounts>> => this.axiosInstance.get(`clients/${clientId}/accounts`, { headers: buildJSONHeaders() });

    postSavingsAccountDeposit = (accountId: string, body: IFineractPostTransactionBody): Promise<AxiosResponse<IFineractPostTransactionResponse>> => this.axiosInstance.post(`savingsaccounts/${accountId}/transactions?command=deposit`, body, { headers: buildJSONHeaders() });
}
