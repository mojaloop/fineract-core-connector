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


import { Logger } from '@mojaloop/sdk-standard-components';
import { Config } from './config';
import Server from './server';

if(require.main === module) {
    (async () => {
        // this module is main i.e. we were started as a server;
        // not used in unit test or "require" scenarios
        const logger = new Logger.Logger({
            ctx: {
                app: 'itk-fineract-core-connector',
            },
        });
        const server = new Server({ ...Config, logger });

        // handle SIGTERM to exit gracefully
        process.on('SIGTERM', async () => {
            console.log('SIGTERM received. Shutting down APIs...');

            await server.stop();
            process.exit(0);
        });

        await server.setupApi();

        server.start().catch((err: Error) => {
            console.log(err);
            process.exit(1);
        });
    })();
}