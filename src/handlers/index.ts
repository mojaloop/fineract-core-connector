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

import { ApiContext, HandlerMap } from '../types';
import { InboundHandlers } from './inbound';
import { OutboundHandlers } from './outbound';

const healthCheck = async (ctx: ApiContext): Promise<void> => {
    ctx.body = JSON.stringify({ status: 'ok' });
};

const Handlers: HandlerMap = {
    '/health': {
        get: healthCheck,
    },
    '/outbound/sendmoney': {
        post: OutboundHandlers.sendMoney,
    },
    '/parties/:idType/:idValue': {
        get: InboundHandlers.getParties,
    },
    '/quoterequests': {
        post: InboundHandlers.postQuotes,
    },
    '/transfers': {
        post: InboundHandlers.postTransfers,
    },
};

export default Handlers;
