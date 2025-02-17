/*
 * Copyright (c) 2022 NOMANA-IT and/or its affiliates.
 * All rights reserved. Use is subject to license terms.
 * *
 */
import { lyGetApplications, LyGetApplicationsFunction } from "@ly_services/lyApplications";
import Logger from "@ly_services/lyLogging";
import { UIDisplayMode } from "@ly_types/common";
import { IAppsProps, EApplications, ESessionMode } from "@ly_types/lyApplications";
import { IModulesProps } from "@ly_types/lyModules";
import { ResultStatus } from "@ly_types/lyQuery";
import { IUsersProps, EUsers } from "@ly_types/lyUsers";
import { IErrorState, ESeverity } from "@ly_utils/commonUtils";
import SocketClient, { socketHandler } from "@ly_utils/socket";
import { t } from "i18next";
import Cookies from "js-cookie";

export const validateLogin = (
    token: any,
    setErrorState: React.Dispatch<React.SetStateAction<IErrorState>>
) => {
    if (token.message === 'loginError') {
        setErrorState({ open: true, message: t("login.loginError"), severity: ESeverity.error });
        return false;
    }
    if  (token.message === 'passwordError') {
        setErrorState({ open: true, message: t("login.passwordError"), severity: ESeverity.error });
        return false;
    }
    return true;
};


export const getLoginApplications = async (
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
    setAppsDP: React.Dispatch<React.SetStateAction<IAppsProps[]>>,
    modulesProperties: IModulesProps,
    getApplications?: LyGetApplicationsFunction
  ) => {
    try {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 300));

      const results = getApplications ? await getApplications() : await lyGetApplications({
        modulesProperties: modulesProperties,
      });
      if (results.status === ResultStatus.error) {
        const logger = new Logger({
            transactionName: "loginUtils.getApplications",
            modulesProperties: modulesProperties,
            data: results
          });
          logger.logException("Login: Failed to fetch applications");
      }
      setAppsDP(results.items);
      return results
    } catch (error) {
        const logger = new Logger({
            transactionName: "loginUtils.getApplications",
            modulesProperties: modulesProperties,
            data: error
          });
          logger.logException("Login: Failed to fetch applications");
      setAppsDP([]); // Optionally set it to an empty array if there's an error
    } finally {
      setIsLoading(false);
    }
  };

export interface IConnectApplicationProps {
    userProperties: IUsersProps;
    login:(user: IUsersProps) => void;
    selectedApplication: IAppsProps;
    connect: (apps: IAppsProps) => void;
    jwt_token: string;
    socket?: SocketClient;
}

// Simplified connectApplication without additional arguments
export const connectApplication = (props: IConnectApplicationProps) => {
    const { userProperties, login, selectedApplication, connect, jwt_token, socket } = props;

    const user: IUsersProps =  {
            [EUsers.status]: true,
            [EUsers.id]: userProperties[EUsers.id],
            [EUsers.name]: userProperties[EUsers.name],
            [EUsers.email]: userProperties[EUsers.email],
            [EUsers.password]: userProperties[EUsers.password],
            [EUsers.admin]: userProperties[EUsers.admin],
            [EUsers.language]: userProperties[EUsers.language],
            [EUsers.displayMode]: userProperties[EUsers.displayMode],
            [EUsers.darkMode]: userProperties[EUsers.displayMode] === UIDisplayMode.dark ? true : false,
            [EUsers.readonly]: userProperties[EUsers.readonly],
            [EUsers.dashboard]: userProperties[EUsers.dashboard],
            [EUsers.theme]: userProperties[EUsers.theme]
        }
        
    // Save the application ID into a cookie
    Cookies.set('applicationId', selectedApplication[EApplications.id].toString(), { expires: 30 });

    connect({
        [EApplications.id]: selectedApplication[EApplications.id],
        [EApplications.pool]: selectedApplication[EApplications.pool],
        [EApplications.name]: selectedApplication[EApplications.name],
        [EApplications.description]: selectedApplication[EApplications.description],
        [EApplications.offset]: selectedApplication[EApplications.offset],
        [EApplications.limit]: selectedApplication[EApplications.limit],
        [EApplications.version]: selectedApplication[EApplications.version],
        [EApplications.session]: ESessionMode.session,
        [EApplications.dashboard]: selectedApplication[EApplications.dashboard],
        [EApplications.theme]: selectedApplication[EApplications.theme],
        [EApplications.jwt_token]: jwt_token

    });
    login(user);

    if (socket) {
      const socketFunctions = socketHandler(socket);
      socketFunctions.connect({user: userProperties[EUsers.id], application: selectedApplication[EApplications.id]});
    }

};

