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


import { ApiContext } from '~/types';


// eslint-disable-next-line no-async-promise-executor
const sendMoney = async (ctx: ApiContext): Promise<unknown> => new Promise(async resolve => {
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
