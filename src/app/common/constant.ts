export const KEY_TOKEN = 'token';

export const FORMAT_DATE = "YYYY/MM/DD";

export const CUSTOM = "CUSTOM";

export const LicenseStatus = {
    NOT_APPROVED: '0', // 未审批
    FAIL: '1', // 驳回
    SUCCESS: '2', // 通过
};

export const LicenseStatusList = [
    { label: 'i18n_license.state.pending', value: LicenseStatus.NOT_APPROVED },
    { label: 'i18n_license.state.fail', value: LicenseStatus.FAIL },
    { label: 'i18n_license.state.success', value: LicenseStatus.SUCCESS },
]

export const LicensePurpose = {
    INTERNAL_DEV: 'Internal Development',
    LABORATORY_TEST: 'Lab Test',
    USER_FIELD_TEST: 'User Field Test',
    USER_TRIAL: 'User Trial',
    CURRENT_NETWORK_USE_: 'User Field Use'
};

export const LicensePurposeList = [
    { label: 'i18n_license.option.internalDev', value: LicensePurpose.INTERNAL_DEV },
    { label: 'i18n_license.option.laboratoryTest', value: LicensePurpose.LABORATORY_TEST },
    { label: 'i18n_license.option.userTest', value: LicensePurpose.USER_FIELD_TEST },
    { label: 'i18n_license.option.userTrial', value: LicensePurpose.USER_TRIAL },
    { label: 'i18n_license.option.userNetworkUse', value: LicensePurpose.CURRENT_NETWORK_USE_ },
];

export const NetworkLimit = {
    TEN: '10',
    FIFTY: '50',
    ONE_HUNDRED: '100',
    FIVE_HUNDRED: '500',
    NO_LIMIT: '-1',  // 不限制
    CUSTOM_NETWORK_LIMIT: 'CUSTOM_NETWORK_LIMIT',  //自定义台数
}

export const NetworkLimitList = [
    { label: 'i18n_license.option.netNum10', value: NetworkLimit.TEN },
    { label: 'i18n_license.option.netNum50', value: NetworkLimit.FIFTY },
    { label: 'i18n_license.option.netNum100', value: NetworkLimit.ONE_HUNDRED },
    { label: 'i18n_license.option.netNum500', value: NetworkLimit.FIVE_HUNDRED },
    { label: 'i18n_license.option.netNumUnlimited', value: NetworkLimit.NO_LIMIT },
    { label: 'i18n_license.option.customNetNum', value: NetworkLimit.CUSTOM_NETWORK_LIMIT },
];

export const SessionLimit = {
    FIVE: '5',
    TEN: '10',
    FIFTY: '50',
    ONE_HUNDRED: '100',
    NO_LIMIT: '-1',
    CUSTOM: 'CUSTOM',
}

export const SessionLimitList = [
    { label: 'i18n_license.option.5', value: SessionLimit.FIVE },
    { label: 'i18n_license.option.10', value: SessionLimit.TEN },
    { label: 'i18n_license.option.50', value: SessionLimit.FIFTY },
    { label: 'i18n_license.option.100', value: SessionLimit.ONE_HUNDRED },
    { label: 'i18n_license.option.unlimited', value: SessionLimit.NO_LIMIT },
    { label: 'i18n_license.option.custom', value: SessionLimit.CUSTOM },
];

export const ExpitationDate = {
    DUE_SOON: 'SOON',  // 即将到期
    EXPIRED: 'EXPIRED',  // 已到期
    PERMANENT: 'PERMANENT',  // 永久
    CUSTOM_DATE: 'CUSTOM',  // 自定义日期
};

export const ExpitationDateList = [
    { label: 'i18n_license.option.licenseExpiration30', value: ExpitationDate.DUE_SOON },
    { label: 'i18n_license.option.licenseExpiration1', value: ExpitationDate.EXPIRED },
    { label: 'i18n_license.option.licensePermanent', value: ExpitationDate.PERMANENT },
    { label: 'i18n_license.option.customLicenseExpiration', value: ExpitationDate.CUSTOM_DATE },
];

export const ExpitationTime = {
    A_WEEK: '7',
    ONE_MONTH: '30',
    TWO_MONTHS: '60',
    THREE_MONTHS: '90',
    SEX_MONTHS: '180',
    ONE_YEAR: '1年',
    TWO_YEARS: '2年',
    THREE_YEARS: '3年',
    PERMANENT: 'PERMANENT',
    CUSTON_DAYS: 'CUSTOM_DAYS',
}

export const DurationList = [
    { label: 'i18n_license.option.aWeek', value: ExpitationTime.A_WEEK },
    { label: 'i18n_license.option.oneMonth', value: ExpitationTime.ONE_MONTH },
    { label: 'i18n_license.option.twoMonths', value: ExpitationTime.TWO_MONTHS },
    { label: 'i18n_license.option.threeMonths', value: ExpitationTime.THREE_MONTHS },
    { label: 'i18n_license.option.sexMonths', value: ExpitationTime.SEX_MONTHS },
    { label: 'i18n_license.option.oneYear', value: ExpitationTime.ONE_YEAR },
    { label: 'i18n_license.option.twoYears', value: ExpitationTime.TWO_YEARS },
    { label: 'i18n_license.option.threeYears', value: ExpitationTime.THREE_YEARS },
    { label: 'i18n_license.option.permanentDays', value: ExpitationTime.PERMANENT },
    { label: 'i18n_license.option.customDays', value: ExpitationTime.CUSTON_DAYS },
];

export const PERMANENT_TIME = '9999/12/31';

export interface LocalObjectData {
    i18nPrefix: string;
    filters: { text?: string, label?: string, value: any, checked?: boolean, length?: number }[];
}

export const HostRegExp = /^(((1\d{2}|2[0-4]\d|25[0-5]|[1-9]\d|[1-9])(\.(1\d{2}|2[0-4]\d|25[0-5]|[1-9]\d|\d)){3})|localhost):([1-9]\d{0,3}|[1-6]\d{4})$/;
