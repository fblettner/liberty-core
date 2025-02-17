/*
 * Copyright (c) 2022 NOMANA-IT and/or its affiliates.
 * All rights reserved. Use is subject to license terms.
 * *
 */
import { Fragment, ReactNode, SyntheticEvent, useCallback, useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { useDrag } from "@use-gesture/react";
import { useSpring } from "@react-spring/web";
import { AlertMessage } from '@ly_common/AlertMessage';
import { Button } from '@ly_common/Button';
import { ConfirmationDialog } from '@ly_common/ConfirmationDialog';
import { DraggableDialog } from '@ly_common/DragableDialog';
import { LoadingIndicator } from '@ly_common/LoadingIndicator';
import { useMediaQuery, useDeviceDetection } from '@ly_common/UseMediaQuery';
import Logger from '@ly_services/lyLogging';
import { saveUserData } from '@ly_services/lyUsers';
import { Div_DialogTabPanel, Div_TabPanelContent, Backdrop, Div_DialogWidget, Div_DialogWidgetTitle, Div_DialogWidgetTitleButtons, Div_Users, Div_DialogToolbar, Div_DialogToolbarButtons, Div } from '@ly_styles/Div';
import { IconButton_Contrast } from '@ly_styles/IconButton';
import { LYFullscreenExitIcon, LYFullscreenIcon, LYCancelIcon, LYSaveIcon } from '@ly_styles/icons';
import { Paper_Dialogs, Paper_DialogToolbar } from '@ly_styles/Paper';
import { Tabs_Dialogs, Tab_Dialogs } from '@ly_styles/Tabs';
import { UIDisplayMode } from '@ly_types/common';
import { EApplications } from '@ly_types/lyApplications';
import { ResultStatus } from '@ly_types/lyQuery';
import { IUsersProps, EUsers } from '@ly_types/lyUsers';
import { DIALOG_WIDGET_DIMENSION, IErrorState, ESeverity, OnChangeParams, EStandardColor } from '@ly_utils/commonUtils';
import { t } from 'i18next';
import { NotificationSettings } from './NotificationSettings';
import { UISettings } from './UISettings';
import { UserSettings } from './UserSettings';
import { getRestData } from './utils/userUtils';
import { useAppContext } from '@ly_context/AppProvider';


interface ITabPanelProps {
    children: ReactNode;
    value: string;
    index: string;
}

export const TabPanel = ({ children, value, index, ...other }: ITabPanelProps) => (
    <Fragment>

        <Div_DialogTabPanel
            role="tabpanel"
            hidden={value !== index}
            id={`tabpanel-${index}`}
            aria-labelledby={`tab-${index}`}
            {...other}
        >
            <Div_TabPanelContent >
                {children}
            </Div_TabPanelContent>
        </Div_DialogTabPanel>

    </Fragment>
);

export interface IAppsUserProps {
    openDialog: boolean;
    setOpenDialog: React.Dispatch<React.SetStateAction<boolean>>;
    onToggleDarkMode: () => void;
}

export const AppsUser = (props: IAppsUserProps) => {
    const {  openDialog, setOpenDialog, onToggleDarkMode } = props;
    const { userProperties, appsProperties, modulesProperties, login } = useAppContext();

    const isSmallScreen = useMediaQuery("(max-width: 600px)");
    const isMobile = useDeviceDetection();
    const [isFullScreen, setIsFullScreen] = useState(() => isSmallScreen || isMobile); // Set fullscreen initially if small screen
    const [dimensions, setDimensions] = useState({ width: DIALOG_WIDGET_DIMENSION.width, height: DIALOG_WIDGET_DIMENSION.height });
    const resizeRef = useRef<HTMLDivElement | null>(null);
    const titleBarRef = useRef<HTMLDivElement | null>(null); // Add ref for the title bar

    const [updatedUserData, setUpdatedUserData] = useState<IUsersProps>({
        [EUsers.id]: userProperties[EUsers.id],
        [EUsers.name]: userProperties[EUsers.name],
        [EUsers.password]: userProperties[EUsers.password],
        [EUsers.password_confirm]: userProperties[EUsers.password],
        [EUsers.email]: userProperties[EUsers.email],
        [EUsers.status]: 'Y',
        [EUsers.admin]: userProperties[EUsers.admin],
        [EUsers.language]: userProperties[EUsers.language],
        [EUsers.displayMode]: userProperties[EUsers.displayMode],
        [EUsers.darkMode]: userProperties[EUsers.darkMode],
        [EUsers.readonly]: userProperties[EUsers.readonly],
        [EUsers.dashboard]: userProperties[EUsers.dashboard],
        [EUsers.theme]: userProperties[EUsers.theme]
    });

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [selectedSetting, setSelectedSetting] = useState<string>("ui");
    const [errorState, setErrorState] = useState<IErrorState>({ message: '', open: false });
    const [openSaveDialog, setOpenSaveDialog] = useState(false);

    const [isModified, setIsModified] = useState(false);
    const [inputLanguage, setInputLanguage] = useState<string | null>(null);
    const [inputDashboard, setInputDashboard] = useState<string | null>(null);
    const [inputTheme, setInputTheme] = useState<string | null>(null);
    const [darkMode, setDarkMode] = useState(userProperties[EUsers.darkMode]);

    // Use Effect
    useEffect(() => {
        const initialize = async () => {
            if (userProperties[EUsers.status]) {
                setIsLoading(true);
                setDarkMode(userProperties[EUsers.darkMode]);
                setInputLanguage(userProperties[EUsers.language]);
                setInputDashboard(userProperties[EUsers.dashboard]?.toString() || null);
                setInputTheme(userProperties[EUsers.theme]?.toString() || null);
                setUpdatedUserData({
                    [EUsers.id]: userProperties[EUsers.id],
                    [EUsers.name]: userProperties[EUsers.name],
                    [EUsers.password]: userProperties[EUsers.password],
                    [EUsers.password_confirm]: userProperties[EUsers.password],
                    [EUsers.email]: userProperties[EUsers.email],
                    [EUsers.status]: 'Y',
                    [EUsers.admin]: userProperties[EUsers.admin],
                    [EUsers.language]: userProperties[EUsers.language],
                    [EUsers.displayMode]: userProperties[EUsers.displayMode],
                    [EUsers.darkMode]: userProperties[EUsers.darkMode],
                    [EUsers.readonly]: userProperties[EUsers.readonly],
                    [EUsers.dashboard]: userProperties[EUsers.dashboard],
                    [EUsers.theme]: userProperties[EUsers.theme]
                })
                setIsLoading(false);
            }
        };
        initialize();
    }, [appsProperties[EApplications.id], userProperties]);

    // Declare functions
    const handleSettingClick = useCallback((event: SyntheticEvent<Element, Event>, value: string) => {
        setSelectedSetting(value);
    }, []);


    const toggleColorMode = useCallback(() => {
        const newDarkMode = !darkMode;
        setUpdatedUserData(prev => ({ ...prev, [EUsers.displayMode]: newDarkMode ? UIDisplayMode.dark : UIDisplayMode.light }));
        onToggleDarkMode();
        setIsModified(true);
        setDarkMode(!darkMode);
    }, [darkMode, updatedUserData, setUpdatedUserData]);

    const handleButtonClick = (value: UIDisplayMode) => {
        switch (value) {
            case UIDisplayMode.dark:
                toggleColorMode();
                break
        };
    };

    const handleSave = useCallback(async () => {
        try {
            const getRestDataParams = {
                updatedUserData: updatedUserData,
                userProperties: userProperties,
                modulesProperties: modulesProperties
            }
            const restData = await getRestData(getRestDataParams);
            if (restData.status === ResultStatus.error) {
                setErrorState({ open: true, message: t("login.passwordError"), severity: ESeverity.error });
            }
            else {
                const saveUserDataParams = {
                    restData: restData.data,
                    appsProperties: appsProperties,
                    modulesProperties: modulesProperties
                }
                const result = await saveUserData(saveUserDataParams);
                if (result.status === ResultStatus.success) {
                    setIsModified(false);

                    login({
                        [EUsers.status]: true,
                        [EUsers.id]: restData.data[EUsers.id],
                        [EUsers.name]: restData.data[EUsers.name],
                        [EUsers.email]: restData.data[EUsers.email],
                        [EUsers.password]: restData.data[EUsers.password],
                        [EUsers.admin]: restData.data[EUsers.admin],
                        [EUsers.language]: restData.data[EUsers.language],
                        [EUsers.displayMode]: restData.data[EUsers.displayMode],
                        [EUsers.darkMode]: restData.data[EUsers.displayMode] === UIDisplayMode.dark ? true : false,
                        [EUsers.readonly]: restData.data[EUsers.readonly],
                        [EUsers.dashboard]: restData.data[EUsers.dashboard],
                        [EUsers.theme]: restData.data[EUsers.theme]
                    });
                    setErrorState({ open: false, message: '' })
                }
                else {
                    const logger = new Logger({
                        transactionName: "AppsUser.handleSave",
                        modulesProperties: modulesProperties,
                        data: result
                    });
                    logger.logException("Users: Save User Settings");
                    setErrorState({ open: true, message: result.items[0].message, severity: ESeverity.error });
                }
            }
        } catch (error) {
            const logger = new Logger({
                transactionName: "AppsUser.handleSave",
                modulesProperties: modulesProperties,
                data: error
            });
            logger.logException("Users: Save User Settings");

            setErrorState({ open: true, message: t("unexpectedError"), severity: ESeverity.error });
        }
    }, [updatedUserData, appsProperties[EApplications.pool], userProperties, login, setErrorState, modulesProperties]);

    const onFieldChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = event.target;
        setUpdatedUserData(prev => ({ ...prev, [id]: value }));
        setIsModified(true);
    }, []);


    const handleCancel = useCallback(() => {
        if (isModified) {
            setOpenSaveDialog(true);
        } else
            setOpenDialog(!openDialog)
    }, [isModified, setOpenDialog, setOpenSaveDialog]);


    const onAutocompleteChanged = (event: OnChangeParams) => {
        const id = event.id;
        setUpdatedUserData((prev) => ({
            ...prev,
            [id]: event.value as string // Ensure updatedUserData is updated
        }));
        setIsModified(true);
    };

    const onCloseError = () => {
        setErrorState({ open: false, message: '' });
    }


    // Update fullscreen state based on screen size
    useEffect(() => {
        if (isSmallScreen || isMobile) {
            setIsFullScreen(true);
        }
    }, [isSmallScreen, isMobile]);


    const [{ x, y }, api] = useSpring(() => ({
        x: 0,
        y: 0,
    }));

    // Gesture hook for dragging and resizing
    const bindDrag = useDrag(
        (state) => {
            const isResizing = state.event.target === resizeRef.current;

            if (isResizing) {
                // Handle resizing
                const newWidth = Math.max(300, state.offset[0]); // Minimum width
                const newHeight = Math.max(200, state.offset[1]); // Minimum height
                setDimensions({ width: newWidth, height: newHeight });
            } else if (!isFullScreen) {
                if (titleBarRef.current && titleBarRef.current.contains(state.event.target as Node))
                    // Handle dragging
                    api.start({ x: state.offset[0], y: state.offset[1] });
            }
        },
        {
            from: (state) => {
                const isResizing = state.target === resizeRef.current;
                if (isResizing) {
                    return [dimensions.width, dimensions.height];
                } else {
                    return [x.get(), y.get()];
                }
            },
        }
    );

    const toggleFullScreen = () => {
        if (!isSmallScreen) {
            setIsFullScreen((prev) => !prev);
        }
    };

    const settings = [
        { id: "ui", label: t("ui_settings"), component: <UISettings {...{ onAutocompleteChanged, darkMode, inputLanguage, inputDashboard, inputTheme, handleButtonClick, appsProperties, userProperties, modulesProperties }} /> },
        { id: "user", label: t("users_settings"), component: <UserSettings {...{ userProperties, onFieldChange }} /> },
        { id: "notification", label: t("notifications_settings"), component: <NotificationSettings {...{ userProperties, onFieldChange }} /> },
    ];

    const handleDiscardConfirm = useCallback(() => { setErrorState({ open: false, message: '' }); setOpenSaveDialog(true) }, [setErrorState, setOpenSaveDialog]);
    const handleDiscardDecline = useCallback(() => { setErrorState({ open: false, message: '' }); setOpenSaveDialog(false) }, [setErrorState, setOpenSaveDialog]);
    const handleDiscardAccept = useCallback(() => {
        // If no changes, close the drawer
        setIsModified(false);
        setUpdatedUserData({
            [EUsers.id]: userProperties[EUsers.id],
            [EUsers.name]: userProperties[EUsers.name],
            [EUsers.password]: userProperties[EUsers.password],
            [EUsers.password_confirm]: userProperties[EUsers.password],
            [EUsers.email]: userProperties[EUsers.email],
            [EUsers.status]: 'Y',
            [EUsers.admin]: userProperties[EUsers.admin],
            [EUsers.language]: userProperties[EUsers.language],
            [EUsers.displayMode]: userProperties[EUsers.displayMode],
            [EUsers.darkMode]: userProperties[EUsers.darkMode],
            [EUsers.readonly]: userProperties[EUsers.readonly],
            [EUsers.dashboard]: userProperties[EUsers.dashboard],
            [EUsers.theme]: userProperties[EUsers.theme]
        });
        setDarkMode(userProperties[EUsers.darkMode])
        setErrorState({ open: false, message: '' });
        // dispatch(onDarkModeChanged(userProperties[EUsers.darkMode] ?? true));
        setOpenSaveDialog(false);
        setOpenDialog(!openDialog)
    }, [setIsModified, setUpdatedUserData, userProperties, setOpenDialog, setOpenSaveDialog]
    );


    if (!openDialog) return null;

    if (isLoading) return <LoadingIndicator />
    else
        return ReactDOM.createPortal(
            <Fragment>
                <Backdrop />
                <DraggableDialog
                    {...bindDrag()}
                    style={{
                        x: isFullScreen ? 0 : x,
                        y: isFullScreen ? 0 : y,
                        bottom: isFullScreen ? 0 : 'auto',
                        right: isFullScreen ? 0 : 'auto',
                        top: isFullScreen ? 0 : '50%',
                        left: isFullScreen ? 0 : '50%',
                    }}
                >
                    <ConfirmationDialog
                        open={openSaveDialog}
                        title={t("dialogs.dataNotSaved")}
                        content={t('dialogs.confirmCloseDialog')}
                        onClose={handleDiscardConfirm}
                        onDecline={handleDiscardDecline}
                        onAccept={handleDiscardAccept}
                    />

                    <Div_DialogWidget fullScreen={isFullScreen} userWidth={isFullScreen ? '100vw' : `${dimensions.width}px`} userHeight={isFullScreen ? '100dvh' : `${dimensions.height}px`}>
                        <Div_DialogWidgetTitle
                            ref={titleBarRef}
                            onDoubleClick={toggleFullScreen}
                        >
                            <span style={{ fontWeight: 'bold', fontSize: '1rem', fontVariant: 'small-caps' }}>
                                {t(userProperties[EUsers.name])}
                            </span>
                            <Div_DialogWidgetTitleButtons>
                                <IconButton_Contrast
                                    aria-label="toggle full screen"
                                    onClick={toggleFullScreen}
                                    icon={isFullScreen ? LYFullscreenExitIcon : LYFullscreenIcon}
                                />
                            </Div_DialogWidgetTitleButtons>
                        </Div_DialogWidgetTitle>
                        <Div_Users>
                            <Paper_Dialogs elevation={0} >
                                <AlertMessage
                                    open={errorState.open}
                                    severity={errorState.severity}
                                    message={errorState.message}
                                    onClose={onCloseError}
                                />
                                <Paper_DialogToolbar elevation={0}>
                                    <Div_DialogToolbar>
                                        <Div_DialogToolbarButtons>
                                            <Button
                                                disabled={false}
                                                variant="outlined" // Use 'outlined' for a modern, clean look
                                                startIcon={LYCancelIcon}
                                                onClick={handleCancel}
                                                color={isModified ? EStandardColor.error : EStandardColor.primary}
                                            >
                                                {t('button.cancel')}
                                            </Button>
                                            <Button
                                                disabled={!isModified}
                                                variant="outlined" // Use 'outlined' for a modern, clean look
                                                startIcon={LYSaveIcon}
                                                onClick={handleSave}
                                                color={isModified ? EStandardColor.success : EStandardColor.primary}
                                            >
                                                {t('button.save')}
                                            </Button>
                                        </Div_DialogToolbarButtons>
                                    </Div_DialogToolbar>
                                </Paper_DialogToolbar>

                                <Tabs_Dialogs
                                    value={selectedSetting}
                                    onChange={handleSettingClick}
                                    aria-label="settings tabs"
                                >
                                    {settings.map((setting) => (
                                        <Tab_Dialogs id={setting.id} key={setting.id} label={setting.label} value={setting.id} />
                                    ))}
                                </Tabs_Dialogs>
                                {settings.map((setting) => (
                                    <TabPanel key={setting.id} value={selectedSetting} index={setting.id}>
                                        <Div>{setting.component}</Div>
                                    </TabPanel>
                                ))}
                            </Paper_Dialogs>
                        </Div_Users>
                    </Div_DialogWidget>
                </DraggableDialog>
            </Fragment>, document.body
        );
}