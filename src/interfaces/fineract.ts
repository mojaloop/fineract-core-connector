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

export interface IFineractSearchResponseEntity {
    entityId: number,
    entityAccountNo?: string,
    entityName?: string,
    entityType?: string,
    parentId?: number,
    parentName?: string,
    entityMobileNo?: string,
    entityStatus?: object,
    subEntityType?: string,
}

export type IFineractSearchResponse = IFineractSearchResponseEntity[];

export interface IFineractClient {
    id: number,
    accountNo: string,
    status: {
        id: number,
        code: string,
        value: string,
    },
    active: boolean,
    activationDate: number[],
    firstname: string,
    lastname: string,
    displayName: string,
    mobileNo: string,
    emailAddress: string,
    dateOfBirth: number[],
    isStaff: boolean,
    officeId: number,
    officeName: string,
    timeline: {
        submittedOnDate: number[],
        activatedOnDate: number[],
        activatedByUsername: string,
        activatedByFirstname: string,
        activatedByLastname: string,
    },
    savingsProductName: string,
    legalForm: {
        id: number,
        code: string,
        value: string
    },
    clientCollateralManagements: any[],
    groups: any[]
}


export interface IFineractSavingsAccount {
    id: 1,
    accountNo: string,
    productId: number,
    productName: string,
    shortProductName: string,
    status: {
        id: number,
        code: string,
        value: string,
        submittedAndPendingApproval: boolean,
        approved: boolean,
        rejected: boolean,
        withdrawnByApplicant: boolean,
        active: boolean,
        closed: boolean,
        prematureClosed: boolean,
        transferInProgress: boolean,
        transferOnHold: boolean,
        matured: boolean,
    },
    currency: {
        code: string,
        name: string,
        decimalPlaces: number,
        inMultiplesOf: number,
        displaySymbol: string,
        nameCode: string,
        displayLabel: string,
    },
    accountBalance: number,
    accountType: {
        id: number,
        code: string,
        value: string,
    },
    timeline: {
        submittedOnDate: number[],
        submittedByUsername: string,
        submittedByFirstname: string,
        submittedByLastname: string,
        approvedOnDate: number[],
        approvedByUsername: string,
        approvedByFirstname: string,
        approvedByLastname: string,
        activatedOnDate: number[],
    },
    subStatus: {
        id: number,
        code: string,
        value: string,
        none: boolean,
        inactive: boolean,
        dormant: boolean,
        escheat: boolean,
        block: boolean,
        blockCredit: boolean,
        blockDebit: boolean
    },
    lastActiveTransactionDate: number[],
    depositType: {
        id: number,
        code: string,
        value: string,
    }
}


export interface IFineractClientAccounts {
    groupLoanIndividualMonitoringAccounts: any[],
    savingsAccounts: IFineractSavingsAccount[],
    guarantorAccounts: any[],
}

export interface IFineractPostTransactionBody {
    locale: string, // "en",
    dateFormat: string, // "dd MMMM yyyy",
    transactionDate: string, // "10 October 2024",
    transactionAmount: number, // 1000,
    paymentTypeId: number // 1,  // Change this to match your payment type
    receiptNumber: string, // "moja1",
    bankNumber: string, // "1234567890"
}

export interface IFineractPostTransactionResponse {
    officeId: number, // 1,
    clientId: number, // 1,
    savingsId: number // 3,
    resourceId: number // 4,
    changes: {
        receiptNumber: string, // "moja1",
        bankNumber: string, // "1234567890",
        paymentTypeId: number, // 1
    }
}
