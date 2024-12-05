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


// eslint-disable-next-line no-async-promise-executor
import { ApiContext } from '~/types';
//import { IGeneralError } from '~/errors';


// const handleError = (err: Error, ctx: ApiContext, responseCode = 500) => {
//     ctx.state.logger.error(err);
//     ctx.response.type = 'text/plain';
//     ctx.response.body = err.toString();
//     ctx.response.status = (err as unknown as IGeneralError)?.httpResponseCode || responseCode;
// };


const sendMoney = async (ctx: ApiContext): Promise<void> => new Promise(async (
    resolve,
    // reject,
) => {
    const response = {
        idType: ctx.params.idType,
        idValue: ctx.params.idValue,
        displayName: 'Test Customer',
    };

    ctx.response.body = response;
    ctx.response.status = 200;
    resolve();
});


export const OutboundHandlers = {
    sendMoney,
};