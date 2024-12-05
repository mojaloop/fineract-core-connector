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

// eslint-disable-next-line max-classes-per-file
import * as util from 'util';

type ErrorParams = {
    msg: string;
    error?: Error;
    [key: string]: any
};

interface IGeneralError {
    httpResponseCode: number,
    params: ErrorParams,
}

export abstract class BaseError extends Error implements IGeneralError {
    httpResponseCode = 500; // default

    params: ErrorParams;

    constructor(params: ErrorParams) {
        super(params.msg);
        this.name = this.constructor.name;
        this.params = { ...params };
        if(params?.msg) {
            this.message = params.msg;
        }
    }

    toString(): string {
        const pretty: any = {};
        pretty[this.name] = {
            ...this.params,
            stack: this.stack,
        };
        return util.inspect(pretty);
    }
}

class ValidationError extends BaseError {
    httpResponseCode = 400;

    constructor(params: ErrorParams) {
        super(params);
        // Set the prototype explicitly.
        Object.setPrototypeOf(this, ValidationError.prototype);
    }
}

class SystemError extends BaseError {
    httpResponseCode = 500;

    constructor(params: ErrorParams) {
        super(params);
        // Set the prototype explicitly.
        Object.setPrototypeOf(this, ValidationError.prototype);
    }
}

const toJson = (error: Error): string => error.toString();

export {
    toJson,
    ErrorParams,
    IGeneralError,
    SystemError,
    ValidationError,
};
