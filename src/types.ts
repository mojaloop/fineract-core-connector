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

import Koa from 'koa';
import { IServiceConfig } from './config';

export interface ApiState {
    conf: IServiceConfig;
    logger: any;
    meta?: {
        [key: string]: any;
    }
}

export interface ApiContext extends Koa.Context {
    state: ApiState;
    request: Koa.Request & { id?: string };
}

export interface HandlerMap {
    [key: string]: { [key: string]: (ctx: ApiContext, next?: Koa.Next) => void };
}

export interface OutboundHandlerMap {
    [key: string]: {
        callback: (ctx: ApiContext, next?: Koa.Next) => void
        xsd: string,
    }
}
