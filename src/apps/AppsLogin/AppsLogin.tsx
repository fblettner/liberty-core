/*
 * Copyright (c) 2025 NOMANA-IT and/or its affiliates.
 * All rights reserved. Use is subject to license terms.
 * *
 */
import React, { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import Cookies from "js-cookie";
import { AlertMessage } from "@ly_common/AlertMessage";
import { CardActionArea, CardHeader, CardContent } from "@ly_common/Card";
import { GridContainer, GridItem } from "@ly_common/Grid";
import { LoadingIndicator } from "@ly_common/LoadingIndicator";
import Logger from "@ly_services/lyLogging";
import { ToolsQuery } from "@ly_services/lyQuery";
import { Button_Login } from "@ly_styles/Button";
import { Card_AppsLogin } from "@ly_styles/Card";
import { Div_Login, Div_AppsLogin } from "@ly_styles/Div";
import { Form_Login } from "@ly_styles/Form";
import { LYLogoIcon } from "@ly_styles/icons";
import { Input_White } from "@ly_styles/Input";
import { Paper_Login } from "@ly_styles/Paper";
import { IAppsProps, EApplications, ESessionMode } from "@ly_types/lyApplications";
import { ResultStatus } from "@ly_types/lyQuery";
import { IErrorState, ESeverity } from "@ly_utils/commonUtils";
import { t } from "i18next";
import { validateLogin, connectApplication, getLoginApplications } from "./utils/loginUtils";
import { useAppContext } from "@ly_context/AppProvider";
import { useAuth } from "@ly_context/AuthProviderWrapper";


export interface IAppsLoginProps {
}
export const AppsLogin = () => {
  const { modulesProperties, setUserProperties, setAppsProperties, socket, getApplications } = useAppContext();
  const auth = useAuth();

  // State variables
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [application, setApplication] = useState<IAppsProps | null>(null);
  const [appsDP, setAppsDP] = useState<Array<IAppsProps>>([]);
  const [errorState, setErrorState] = useState<IErrorState>({ message: '', open: false });


  // Fetch applications on load
  useEffect(() => {
    const initialize = async () => {
      try {
        const savedApplicationId = Cookies.get("applicationId");
        const apps = await getLoginApplications(setIsLoading, setAppsDP, modulesProperties, getApplications);

        if (savedApplicationId) {
          const savedApp = apps.items.find(
            (app: { [x: string]: number; }) => app[EApplications.id] === parseInt(savedApplicationId)
          );
          if (savedApp) setApplication(savedApp);
        }
      } catch (error) {
        const logger = new Logger({
          transactionName: "AppsLogin.initialize",
          modulesProperties: modulesProperties,
          data: error,
        });
        logger.logException("Login: Failed to fetch applications");
      }
    };
    initialize();
  }, [modulesProperties]);

  // Handle application selection
  const handleApplicationSelect = useCallback((app: IAppsProps) => {
    setApplication(app);
  }, []);

  // Handle login form submission
  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const formData = new FormData(event.currentTarget);
      const login = formData.get("user") as string;
      const password = formData.get("password") as string;

      try {
        if (!auth.isAuthenticated && !modulesProperties.login.enabled) {
          setErrorState({ open: true, message: t("login.authRequired"), severity: ESeverity.error });
          auth.signinPopup();
          return;
        }

        if (!application) {
          setErrorState({ open: true, message: t("login.applicationError"), severity: ESeverity.error });
          return;
        }
        let password_encrypted = modulesProperties.login.enabled ? await ToolsQuery.encrypt(password, modulesProperties) : "";
        const token = await ToolsQuery.token(
          modulesProperties.login.enabled ? login : auth.user?.profile.preferred_username!,
          password_encrypted,
          application[EApplications.pool],
          ESessionMode.session,
          modulesProperties,
          modulesProperties.login.enabled ? "database" : "oidc"
        );

        if (!validateLogin(token, setErrorState)) return;
        
        const result = await ToolsQuery.user({
          user: modulesProperties.login.enabled ? login : auth.user?.profile.preferred_username!,
          pool: application[EApplications.pool],
          sessionMode: ESessionMode.session,
          modulesProperties: modulesProperties,
          jwt_token: token.access_token
        });


        if (result.status === ResultStatus.success) {
          let userProperties = result.items[0];
          if (setUserProperties && setAppsProperties) {
            const params = {
              userProperties: userProperties,
              setUserProperties: setUserProperties,
              selectedApplication: application,
              setAppsProperties: setAppsProperties,
              jwt_token: token.access_token,
              socket: socket
            }
            connectApplication(params);
          } else {
            setErrorState({ open: true, message: "User or Apps properties are not set", severity: ESeverity.error });
          }
        } else {
          const errorMessage = result.status === "loginerror"
            ? t("login.loginError")
            : t("login.passwordError");
          setErrorState({ open: true, message: errorMessage, severity: ESeverity.error });
        }


      } catch (error) {
        const logger = new Logger({
          transactionName: "AppsLogin.handleSubmit",
          modulesProperties: modulesProperties,
          data: error,
        });
        logger.logException("Login: Validate and connect application");
        setErrorState({ open: true, message: "Unexpected error occurred", severity: ESeverity.error });
      }
    },
    [auth, application, modulesProperties, setErrorState]
  );

  // Memoize apps for optimization
  const memoizedAppsDP = useMemo(() => appsDP, [appsDP]);

  const onCloseError = () => {
    setErrorState({ open: false, message: '' });
  }

  // Show loading indicator while fetching data
  if (isLoading) return <LoadingIndicator />;


  return (
    <Div_Login>
      <Paper_Login elevation={3}>
        <LYLogoIcon width="75px" height="75px" />
        <Form_Login noValidate onSubmit={handleSubmit}>
          <AlertMessage
            open={errorState.open}
            severity={errorState.severity}
            message={errorState.message}
            onClose={onCloseError}
          />
          {modulesProperties.login && modulesProperties.login.enabled && (
            <Fragment>
              <Div_AppsLogin>
                <Input_White
                  variant="standard"
                  required
                  fullWidth
                  id="userid"
                  label={t("login.userid")}
                  name="user"
                  autoComplete="user"
                  autoFocus
                />
              </Div_AppsLogin>
              <Div_AppsLogin>
                <Input_White
                  variant="standard"
                  required
                  fullWidth
                  name="password"
                  label={t("login.password")}
                  type="password"
                  id="password"
                  autoComplete="off"
                />
              </Div_AppsLogin>
            </Fragment>
          )}
          <GridContainer spacing={2} py={2} px={1} columns={{ xs: 1, sm: 2 }}>
            {memoizedAppsDP.map((app) => (
              <GridItem key={app[EApplications.id]}>
                <Card_AppsLogin
                  isSelected={application === app}
                >
                  <CardActionArea onClick={() => handleApplicationSelect(app)} >
                    <CardHeader title={app[EApplications.name]} />
                    <CardContent>
                      {app[EApplications.description]}
                    </CardContent>
                  </CardActionArea>
                </Card_AppsLogin>
              </GridItem>
            ))}
          </GridContainer>
          <Button_Login type="submit" fullWidth variant="contained">
            {t("login.loginButton")}
          </Button_Login>
        </Form_Login>
      </Paper_Login>
    </Div_Login>
  );
};