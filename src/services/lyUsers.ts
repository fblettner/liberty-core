/*
 * Copyright (c) 2022 NOMANA-IT and/or its affiliates.
 * All rights reserved. Use is subject to license terms.
 * *
 */
// Custom Import
import { QuerySource, ResultStatus } from '@ly_types/lyQuery';
import { ToolsQuery } from '@ly_services/lyQuery';
import { GlobalSettings } from '@ly_utils/GlobalSettings';
import { EApplications, ESessionMode } from '@ly_types/lyApplications';
import { EUsers, IGetUserDataProps, ISaveUserDataProps, IUsersProps } from '@ly_types/lyUsers';

export const saveUserData = async (props: ISaveUserDataProps) => {
    return await ToolsQuery.put(
        {
            source: QuerySource.Query,
            framework_pool: props.appsProperties[EApplications.pool],
            query: GlobalSettings.getQuery.users,
            sessionMode: ESessionMode.framework,
            modulesProperties: props.modulesProperties,
            jwt_token: props.appsProperties[EApplications.jwt_token]
        },
        JSON.stringify(props.restData)
    );
};
export const getUserData = async (props: IGetUserDataProps) => {
    const { updatedUserData, userProperties, modulesProperties } = props;
    let restData: IUsersProps = {
        [EUsers.id]: userProperties[EUsers.id],
        [EUsers.name]: userProperties[EUsers.name],
        [EUsers.password]: userProperties[EUsers.password],
        [EUsers.email]: userProperties[EUsers.email],
        [EUsers.status]: 'Y',
        [EUsers.admin]: userProperties[EUsers.admin],
        [EUsers.language]: userProperties[EUsers.language],
        [EUsers.displayMode]: userProperties[EUsers.displayMode],
        [EUsers.readonly]: userProperties[EUsers.readonly],
        [EUsers.audit_user]: userProperties[EUsers.id],
        [EUsers.audit_date]: new Date().toISOString(),
        [EUsers.dashboard]: userProperties[EUsers.dashboard],
        [EUsers.theme]: userProperties[EUsers.theme],
    };
    let userPassword = userProperties[EUsers.password];
    if (updatedUserData[EUsers.password] !== undefined && updatedUserData[EUsers.password] !== userProperties[EUsers.password]) {
        if (updatedUserData[EUsers.password] !== updatedUserData[EUsers.password_confirm]) {
            return { status: ResultStatus.error, data: restData };
        } else {
            userPassword = await ToolsQuery.encrypt(updatedUserData[EUsers.password], modulesProperties);
        }
    }

    restData[EUsers.id] = userProperties[EUsers.id];
    restData[EUsers.name] = updatedUserData[EUsers.name] ?? userProperties[EUsers.name];
    restData[EUsers.password] = userPassword ?? userProperties[EUsers.password];
    restData[EUsers.email] = updatedUserData[EUsers.email] ?? userProperties[EUsers.email];
    restData[EUsers.status] = 'Y';
    restData[EUsers.admin] = userProperties[EUsers.admin];
    restData[EUsers.language] = updatedUserData[EUsers.language] ?? userProperties[EUsers.language];
    restData[EUsers.displayMode] = updatedUserData[EUsers.displayMode] ?? userProperties[EUsers.displayMode];
    restData[EUsers.readonly] = userProperties[EUsers.readonly];
    restData[EUsers.audit_user] = userProperties[EUsers.id];
    restData[EUsers.audit_date] = new Date().toISOString();
    restData[EUsers.dashboard] = updatedUserData[EUsers.dashboard] ?? userProperties[EUsers.dashboard];
    restData[EUsers.theme] = updatedUserData[EUsers.theme] ?? userProperties[EUsers.theme];

    return { status: ResultStatus.success, data: restData };
};
