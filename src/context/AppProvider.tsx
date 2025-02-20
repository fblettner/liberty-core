import { DefaultZIndex, UIDisplayMode } from "@ly_types/common";
import { IAppsProps, EApplications, ESessionMode } from "@ly_types/lyApplications";
import { EModules, IModulesProps } from "@ly_types/lyModules";
import { IUsersProps, EUsers, LyGetUserFunction } from "@ly_types/lyUsers";
import { GlobalSettings } from "@ly_utils/GlobalSettings";
import React, { createContext, useContext, useState, useEffect, ReactNode, useRef } from "react";
import * as Sentry from "@sentry/react";
import SocketClient, { socketHandler } from "@ly_utils/socket";
import { ISnackMessage } from "@ly_types/lySnackMessages";
import { ESeverity } from "@ly_utils/commonUtils";
import { v4 as uuidv4 } from "uuid";
import { lyGetModules } from "@ly_services/lyModules";
import { LyGetModulesFunction } from "@ly_types/lyModules";
import { LyGetApplicationsFunction } from "@ly_types/lyApplications";
import { LyGetEncryptedTextFunction, LyGetTokenFunction } from "@ly_types/lyQuery";
import { AuthContextProps } from "react-oidc-context";
import { LyGetMenusFunction } from "@ly_types/lyMenus";
import { LyGetDashboardFunction } from "@ly_types/lyDashboard";
import { LyGetTableDataFunction, LyGetTablePropertiesFunction } from "@ly_types/lyTables";


// Define Context Type
interface AppContextType {
    auth?: AuthContextProps;
    appsProperties: IAppsProps;
    connect: (apps: IAppsProps) => void;
    disconnect: () => void;
    session: () => void;
    userProperties: IUsersProps;
    login: (user: IUsersProps) => void;
    logout: () => void;
    modulesProperties: IModulesProps;
    socket: SocketClient;
    snackMessages: ISnackMessage[];
    addSnackMessage: (message: string, severity: ESeverity) => void;
    removeSnackMessage: (id: string) => void;
    getNextZIndex: () => number;
    resetZIndex: () => void;
    getToken?: LyGetTokenFunction;
    getApplications?: LyGetApplicationsFunction;
    getUser?: LyGetUserFunction;
    getEncryptedText?: LyGetEncryptedTextFunction;
    getMenus?: LyGetMenusFunction
    getDashboard?: LyGetDashboardFunction;
    getTables?: {
        getProperties: LyGetTablePropertiesFunction;
        getData: LyGetTableDataFunction;
    }
}

// Create Context
const AppContext = createContext<AppContextType | undefined>(undefined);

export interface IAppProviderProps {
    children: ReactNode;
    useAuth?: () => AuthContextProps;
    getModules?: LyGetModulesFunction;
    getApplications?: LyGetApplicationsFunction;
    getToken?: LyGetTokenFunction;
    getUser?: LyGetUserFunction;
    getEncryptedText?: LyGetEncryptedTextFunction;
    getMenus?: LyGetMenusFunction,
    getDashboard?: LyGetDashboardFunction;
    getTables?: {
        getProperties: LyGetTablePropertiesFunction;
        getData: LyGetTableDataFunction;
    }
}

export const AppProvider = (props: IAppProviderProps) => {
    const { children, useAuth, getModules, getApplications, getToken, getUser, getEncryptedText, getMenus, getDashboard, getTables } = props;
    const socket = useRef(new SocketClient());
    const auth = useAuth ? useAuth() : {
        isAuthenticated: false,
        user: null,
    } as AuthContextProps;

    const [modulesProperties, setModulesProperties] = useState<IModulesProps>({
        "debug": { "enabled": false, "params": null },
        "sentry": { "enabled": false, "params": "" },
        "login": { "enabled": true, "params": null },
        "menus": { "enabled": true, "params": null },
        "grafana": { "enabled": false, "params": null },
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
                const results = getModules ? await getModules() : await lyGetModules();
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

    const [snackMessages, setSnackMessages] = useState<ISnackMessage[]>([]);

    // Function to add a snack message
    const addSnackMessage = (message: string, severity: any) => {
        const newMessage: ISnackMessage = {
            id: uuidv4(),
            message,
            severity,
            open: true,
        };
        setSnackMessages((prev) => [...prev, newMessage]);

        // Auto-remove message after 6 seconds
        setTimeout(() => removeSnackMessage(newMessage.id), 6000);
    };

    // Function to remove a snack message
    const removeSnackMessage = (id: string) => {
        setSnackMessages((prev) => prev.filter((msg) => msg.id !== id));
    };

    useEffect(() => {
        if (modulesProperties && modulesProperties.sentry.enabled && modulesProperties.sentry.params && !isSentryInitialized.current) {
            try {
                // Initialize Sentry
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

    const currentZIndex = useRef(DefaultZIndex.Modal);
    const activePopups = useRef(0);

    const getNextZIndex = () => {
        activePopups.current += 1;
        currentZIndex.current += 2;
        return currentZIndex.current;
    };

    const resetZIndex = () => {
        if (activePopups.current > 0)
            activePopups.current -= 1;
        if (activePopups.current === 0) {
            currentZIndex.current = DefaultZIndex.Modal;
        }
    };

    const connect = (apps: IAppsProps) => {
        setAppsProperties(apps);
    }

    const session = () => {
        setAppsProperties(prevState => ({
            ...prevState,
            [EApplications.session]: prevState[EApplications.session] === ESessionMode.framework ? ESessionMode.session : ESessionMode.framework,
        }));
    };

    const disconnect = () => {
        setAppsProperties({
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
            [EApplications.jwt_token]: ""
        });

        if (socket.current) {
            const socketFunctions = socketHandler(socket.current);
            socketFunctions.signout();
        }
    }

    const login = (user: IUsersProps) => {
        setUserProperties(user);
    }

    const logout = () => {
        setUserProperties({
            [EUsers.status]: false,
            [EUsers.id]: "",
            [EUsers.name]: "",
            [EUsers.email]: "",
            [EUsers.password]: "",
            [EUsers.admin]: "N",
            [EUsers.language]: "en",
            [EUsers.displayMode]: UIDisplayMode.dark,
            [EUsers.darkMode]: true,
            [EUsers.theme]: "liberty",
            [EUsers.dashboard]: -1,
            [EUsers.readonly]: "Y",
        });

        if (auth.isAuthenticated) {
            auth.removeUser().catch(console.error);
            auth.revokeTokens().catch(console.error);
        }
    }

    return (
        <AppContext.Provider
            value={{
                auth,
                appsProperties,
                connect,
                disconnect,
                session,
                userProperties,
                login,
                logout,
                modulesProperties,
                socket: socket.current,
                snackMessages,
                addSnackMessage,
                removeSnackMessage,
                getNextZIndex,
                resetZIndex,
                getApplications,
                getToken,
                getUser,
                getEncryptedText,
                getMenus,
                getDashboard,
                getTables
            }}
        >
            {children}
        </AppContext.Provider>
    );
};


export const useAppContext = (): AppContextType => {
    const context = useContext(AppContext);
    if (!context) {
        return {
            appsProperties: {} as IAppsProps,
            connect: () => { },
            disconnect: () => { },
            session: () => { },
            userProperties: {} as IUsersProps,
            login: () => { },
            logout: () => { },
            modulesProperties: {
                "debug": { "enabled": false, "params": null },
                "sentry": { "enabled": false, "params": "" },
                "login": { "enabled": true, "params": null },
                "menus": { "enabled": true, "params": null },
                "grafana": { "enabled": false, "params": null },
                "dev": { "enabled": true, "params": null }
            },
            socket: new SocketClient(),
            snackMessages: [],
            addSnackMessage: () => { },
            removeSnackMessage: () => { },
            getNextZIndex: () => 0,
            resetZIndex: () => { },
        };
    }
    return context;
};