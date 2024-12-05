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

import * as env from 'env-var';
import * as dotenv from 'dotenv';
import { Logger } from '@mojaloop/sdk-standard-components';

dotenv.config();

export interface IServiceConfig {
    port?: number,
    outboundEndpoint: string,
    backendEndpoint: string,
    requestTimeout?: number,
    callbackTimeout?: number,
    logger?: Logger.Logger,
    schemeLiabilitiesAccountId: number,
    schemeAssetsAccountId: number,
    backendBasicAuth: string,
    backendTenantId: string,
    targetFineractAccountShortName: string,
    fineractDepositPaymentType: number,
    fineractWithdrawalPaymentType: number,
}


export const Config: IServiceConfig = {
    port: env.get('LISTEN_PORT').default('3003').asPortNumber(),
    outboundEndpoint: env.get('OUTBOUND_ENDPOINT').required().asString(),
    backendEndpoint: env.get('BACKEND_ENDPOINT').required().asString(),
    requestTimeout: env.get('REQUEST_TIMEOUT').default(2000).asInt(),
    callbackTimeout: env.get('CALLBACK_TIMEOUT').default(30).asInt(),
    schemeLiabilitiesAccountId: env.get('SCHEME_LIABILITIES_ACCOUNT_ID').required().asInt(),
    schemeAssetsAccountId: env.get('SCHEME_ASSETS_ACCOUNT_ID').required().asInt(),
    backendBasicAuth: env.get('BACKEND_BASIC_AUTH').required().asString(),
    backendTenantId: env.get('BACKEND_TENANT_ID').required().asString(),
    targetFineractAccountShortName: env.get('TARGET_FINERACT_ACCOUNT_SHORT_NAME').required().asString(),
    fineractDepositPaymentType: env.get('FINERACT_DEPOSIT_PAYMENT_TYPE').required().asInt(),
    fineractWithdrawalPaymentType: env.get('FINERACT_WITHDRAWAL_PAYMENT_TYPE').required().asInt(),
};
