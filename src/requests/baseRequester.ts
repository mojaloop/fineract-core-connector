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
import axios, {
    AxiosInstance,
    AxiosRequestConfig,
    AxiosResponse,
} from 'axios';
import { Logger } from '@mojaloop/sdk-standard-components';

export type RequesterOptions = {
    baseURL: string;
    timeout: number | undefined;
    logger: Logger.Logger;
    additionalHeaders?: Record<string, string>;
};

export abstract class BaseRequester {
    protected options: RequesterOptions;

    protected axiosInstance: AxiosInstance;

    constructor(ops: RequesterOptions) {
        this.options = { ...ops };

        const opts: { baseURL: string, timeout?: number, headers?: Record<string, string> } = {
            baseURL: ops.baseURL,
            timeout: ops.timeout,
        };

        if(ops.additionalHeaders) {
            opts.headers = ops.additionalHeaders;
        }

        // create axios instance
        this.axiosInstance = axios.create(opts);

        // add interceptor to log request
        this.axiosInstance.interceptors.request.use((req: AxiosRequestConfig) => {
            this.options.logger.push({
                axiosRequest: {
                    baseURL: req?.baseURL,
                    url: req?.url,
                    method: req?.method,
                    headers: req?.headers,
                    data: util.inspect(req?.data),
                },
            }).log();
            return req;
        });

        // add interceptor to log response
        this.axiosInstance.interceptors.response.use((res: AxiosResponse) => {
            this.options.logger.push({
                axiosResponse: {
                    baseURL: res?.config?.baseURL,
                    url: res?.config?.url,
                    method: res?.config?.method,
                    status: res?.status,
                    headers: res?.headers,
                    data: util.inspect(res?.data),
                },
            }).log();
            return res;
        });
    }
}
