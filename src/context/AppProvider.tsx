import { lyGetModules } from "@ly_services/lyModules";
import { UIDisplayMode } from "@ly_types/common";
import { IAppsProps, EApplications, ESessionMode } from "@ly_types/lyApplications";
import { EModules, IModulesProps } from "@ly_types/lyModules";
import { IUsersProps, EUsers } from "@ly_types/lyUsers";
import { GlobalSettings } from "@ly_utils/GlobalSettings";
import React, { createContext, useContext, useState, useEffect, ReactNode, useRef } from "react";
import * as Sentry from "@sentry/react";
import SocketClient from "@ly_utils/socket";

// Define Context Type
interface AppContextType {
    appsProperties: IAppsProps;
    setAppsProperties: React.Dispatch<React.SetStateAction<IAppsProps>>;
    userProperties: IUsersProps;
    setUserProperties: React.Dispatch<React.SetStateAction<IUsersProps>>;
    modulesProperties: IModulesProps;
    setModulesProperties: React.Dispatch<React.SetStateAction<IModulesProps>>;
    socket: SocketClient;
    setSocket: React.Dispatch<React.SetStateAction<SocketClient>>;
}

// Create Context
const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
    const [socket, setSocket ] = useState<SocketClient>(new SocketClient());

    const [modulesProperties, setModulesProperties] = useState<IModulesProps>({
        "debug": { "enabled": false, "params": null},
        "sentry": { "enabled": false, "params": "" },
        "login": { "enabled": true, "params": null },
        "menus": { "enabled": true, "params": null },
        "grafana": { "enabled": false,"params": null },
        "dev": { "enabled": true, "params": null }
    });
    const isSentryInitialized = useRef(false);
    
    const [userProperties, setUserProperties] = useState<IUsersProps>({
        [EUsers.status]: false,
        [EUsers.id]: "",
        [EUsers.name]: "",
        [EUsers.email]: "",
        [EUsers.password]: "",
        [EUsers.admin]: "N",
        [EUsers.language]: "en",
        [EUsers.displayMode]: UIDisplayMode.dark,
        [EUsers.darkMode]: true,
        [EUsers.readonly]: "Y",
        [EUsers.dashboard]: -1,
        [EUsers.theme]: "liberty"
    });

    const [appsProperties, setAppsProperties] = useState<IAppsProps>({
        [EApplications.id]: 0,
        [EApplications.pool]: GlobalSettings.getDefaultPool,
        [EApplications.name]: "LIBERTY",
        [EApplications.description]: "Liberty Framework",
        [EApplications.offset]: 5000,
        [EApplications.limit]: 5000,
        [EApplications.version]: GlobalSettings.getVersion,
        [EApplications.session]: ESessionMode.session,
        [EApplications.dashboard]: -1,
        [EApplications.theme]: "liberty",
        [EApplications.jwt_token]: "",
    });

    useEffect(() => {
        const fetchModules = async () => {
            try {
                const results = await lyGetModules({ pool: GlobalSettings.getDefaultPool });
                let modules: IModulesProps = {
                    debug: { enabled: false, params: null },
                    sentry: { enabled: false, params: null },
                    login: { enabled: false, params: null },
                    menus: { enabled: false, params: null },
                    grafana: { enabled: false, params: null },
                    dev: { enabled: false, params: null },
                }
                results.forEach((item: any) => {
                    const moduleId = item[EModules.id] as keyof IModulesProps;
                    if (moduleId in modules) {
                        modules[moduleId] = {
                            enabled: item[EModules.enabled] === "Y",
                            params: item[EModules.params],
                        };
                    }
                });
                setModulesProperties(modules);
            } catch (error) {
                console.error("Error loading modules:", error);
            }
        };

        fetchModules();
    }, []);

    useEffect(() => {
        if (modulesProperties && modulesProperties.sentry.enabled && modulesProperties.sentry.params && !isSentryInitialized.current) {
          try {
            const parsedData = JSON.parse(modulesProperties.sentry.params);
            const url = parsedData.url;
            const replay = parsedData.replay === "true";
    
            Sentry.init({
              dsn: url,
              integrations: [
                Sentry.browserTracingIntegration(),
                Sentry.replayIntegration({
                  maskAllText: false,
                  blockAllMedia: false,
                  unblock: [".sentry-unblock, [data-sentry-unblock]"],
                  unmask: [".sentry-unmask, [data-sentry-unmask]"],
                }),
              ],
              beforeBreadcrumb(breadcrumb, hint) {
                if (breadcrumb.category === "xhr") return null;
                return breadcrumb;
              },
              tracesSampleRate: replay ? 1.0 : 0.0,
              tracePropagationTargets: ["localhost", /^https:\/\/nomana-it.sentry\.io\/api/],
              replaysSessionSampleRate: 0.0,
              replaysOnErrorSampleRate: 1.0,
              normalizeDepth: 10,
            });
    
            isSentryInitialized.current = true;
            
          } catch (error) {
            console.error("Error initializing Sentry:", error);
          }
        }
      }, [modulesProperties]);

    return (
        <AppContext.Provider
            value={{
                appsProperties,
                setAppsProperties,
                userProperties,
                setUserProperties,
                modulesProperties,
                setModulesProperties,
                socket,
                setSocket
            }}
        >
            {children}
        </AppContext.Provider>
    );
};


export const useAppContext = (): AppContextType => {
    const context = useContext(AppContext);
    if (!context) {
        console.warn("⚠️ Warning: `useAppContext` is used outside of `AppProvider`.");
        return {
            appsProperties: {} as IAppsProps,
            setAppsProperties: () => { },
            userProperties: {} as IUsersProps,
            setUserProperties: () => { },
            modulesProperties: {
                "debug": { "enabled": false, "params": null},
                "sentry": { "enabled": false, "params": "" },
                "login": { "enabled": true, "params": null },
                "menus": { "enabled": true, "params": null },
                "grafana": { "enabled": false,"params": null },
                "dev": { "enabled": true, "params": null }
            },
            setModulesProperties: () => { },
            socket: new SocketClient(),
            setSocket: () => { },
        };
    }
    return context;
};