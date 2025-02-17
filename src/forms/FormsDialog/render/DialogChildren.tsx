/*
 * Copyright (c) 2022 NOMANA-IT and/or its affiliates.
 * All rights reserved. Use is subject to license terms.
 * *
 */
// React Import
import React, { useCallback } from "react";
import { useState, useRef, useEffect } from "react";

// MUI Import

// Custom Import
import { ComponentProperties, LYComponentEvent, LYComponentMode } from "@ly_types/lyComponents";
import { CDialogContent, EDialogTabs, EDialogHeader, IDialogDetails, IDialogHeader, IDialogsTab } from "@ly_types/lyDialogs";
import { LoadingIndicator } from "@ly_common/LoadingIndicator";
import { DialogForms } from "@ly_forms/FormsDialog/render/DialogForms";
import { initDialog, ISaveDataAPIParams, saveDataAPI } from "@ly_forms/FormsDialog/utils/apiUtils";
import { onActionEndHandler, updateContentValueHandler } from "@ly_forms/FormsDialog/utils/dialogUtils";
import { ESeverity, IContentValue, IDialogAction, IErrorState, IReserveStatus, OnChangeParams } from "@ly_utils/commonUtils";
import { getRecordHandler } from "@ly_forms/FormsDialog/utils/recordUtils";
import { IActionsStatus } from "@ly_types/lyActions";
import Logger from "@ly_services/lyLogging";
import { ResultStatus } from "@ly_types/lyQuery";
import { Paper_Dialogs } from "@ly_styles/Paper";
import { Stack_Dialogs } from "@ly_styles/Stack";
import { socketHandler } from "@ly_utils/socket";
import { useAppContext } from "@ly_context/AppProvider";

type Props = Readonly<{
    componentProperties: ComponentProperties;
    sendAction?: IDialogAction;
    setSendAction?: React.Dispatch<React.SetStateAction<IDialogAction>>;
    isModified: boolean;
    setIsModified: React.Dispatch<React.SetStateAction<boolean>>;
    setErrorState: React.Dispatch<React.SetStateAction<IErrorState>>;
    parentActiveTab: string;
    parentTabIndex: string;
}>;

export function DialogChildren(props: Props) {
    const { componentProperties, sendAction, setSendAction, isModified, setIsModified, setErrorState, parentActiveTab, parentTabIndex } = props;
    const { userProperties, appsProperties, modulesProperties, setUserProperties, setAppsProperties, socket, setSocket } = useAppContext();

    // Declare variables
    const [reserveStatus, setReserveStatus] = useState<IReserveStatus>({ status: false, user: "", record: "" });
    const [activeTab, setActiveTab] = useState(componentProperties.id + '-tab-id-1');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [tabs, setTabs] = useState<IDialogsTab[]>([]);
    const [dialogContent, setDialogContent] = useState<CDialogContent>(new CDialogContent());
    const [dialogComponent, setDialogComponent] = useState<CDialogContent>(new CDialogContent());
    const [dialogsMode, setDialogsMode] = useState<LYComponentMode>(componentProperties.componentMode);
    const [maxRows, setMaxRows] = useState(15)

    const componentRef = useRef<ComponentProperties>(componentProperties);
    const dialogDetailsRef = useRef<IDialogDetails[]>([]);
    const dialogHeaderRef = useRef<IDialogHeader>({
        [EDialogHeader.id]: '',
        [EDialogHeader.label]: '',
        [EDialogHeader.pool]: '',
        [EDialogHeader.queryID]: 0,
        [EDialogHeader.language]: ''
    });

    const refPaper = useRef<HTMLDivElement>(null)

    // Calculate the max number of rows for a multiline text field
    useEffect(() => {
        if (refPaper.current) {
            setMaxRows(Math.round(refPaper.current.clientHeight / 40))
        }
    }, [])

    const getRecord = useCallback(() => {
        const params = {
            dialogDetailsRef,
            dialogContent,
            dialogHeaderRef,
            appsProperties
        }
        return getRecordHandler(params)
    }, [dialogContent, dialogDetailsRef, dialogHeaderRef, appsProperties])

    const reserveRecord = useCallback(() => {
        if (socket) {
            const socketFunctions = socketHandler(socket);
            socketFunctions.reserve(getRecord(), setReserveStatus);
        }
        const logger = new Logger({
            transactionName: "FormsDialog.reserveRecord",
            data: getRecord(),
            modulesProperties: modulesProperties
        });
        logger.logMessage("Socket: Reserve Record");
    }, [getRecord, setReserveStatus, socket, modulesProperties, socketHandler, Logger]);

    const releaseRecord = useCallback(() => {
        if (socket) {
            const socketFunctions = socketHandler(socket);
            socketFunctions.release(getRecord());
        }
        const logger = new Logger({
            transactionName: "FormsDialog.releaseRecord",
            data: getRecord(),
            modulesProperties: modulesProperties
        });
        logger.logMessage("Socket: Release Record");
    }, [getRecord, setReserveStatus, socket, modulesProperties, socketHandler, Logger]);

    const fetchData = useCallback(async () => {
        const params = {
            setIsLoading,
            dialogHeaderRef,
            componentProperties: componentRef.current,
            appsProperties,
            userProperties,
            modulesProperties,
            dialogsMode,
            dialogContent,
            setDialogContent,
            dialogDetailsRef,
            dialogComponent,
            setDialogComponent,
            setDialogsMode,
            isModified,
            setTabs,
            setActiveTab,
            reserveRecord,
        }
        await initDialog(params);
    }, [componentRef.current, dialogsMode, isModified, reserveRecord, setActiveTab, setDialogComponent, setDialogContent, setDialogsMode, setTabs, userProperties, appsProperties, modulesProperties,
        dialogContent, dialogDetailsRef, dialogComponent, dialogHeaderRef, setIsLoading, componentProperties]
    );


    useEffect(() => {
        const init = async () => {
            componentRef.current = props.componentProperties
            await fetchData();
        };
        init();
        return () => {
            setTabs([]);
            releaseRecord();
        };
    }, [props.componentProperties.id, dialogsMode]);

    useEffect(() => {
        setIsLoading(true);
        const init = async () => {
            await fetchData();
        }
        init();
    }, [dialogsMode]);

    useEffect(() => {
        // Dispatch an action when data is updated
        if (reserveStatus !== null) {
            if (reserveStatus.status) {
                setErrorState({ open: true, message: "Record Reserved" + reserveStatus.user, severity:  ESeverity.error })
            } else
                setErrorState({ open: false, message: "", severity:  ESeverity.info })
        }
    }, [reserveStatus]);

    useEffect(() => {
        if (sendAction && componentRef.current.isChildren) {
            const initAction = async () => {
                if (sendAction.event === LYComponentEvent.Save || sendAction.event === LYComponentEvent.SaveClose) {
                    const saveParams: ISaveDataAPIParams = {
                        dialogContent,
                        appsProperties,
                        userProperties,
                        modulesProperties,
                        dialogsMode,
                        componentProperties: componentRef.current,
                        isChildren: true,
                        dialogHeaderRef,
                        dialogDetailsRef,
                        parentKey: sendAction.keys,
                        setIsModified,
                        setErrorState,
                    };

                    // Process the save action
                    let result = await saveDataAPI(saveParams);
                    if (result.status === ResultStatus.success) {
                        if (setSendAction)
                            setSendAction({
                                event: LYComponentEvent.none,
                                message: "",
                                keys: null
                            })
                    }
                }
            };

            initAction();
        }
    }, [sendAction]);


    const handleTabChanged = (event: React.SyntheticEvent, newValue: string) => {
        setActiveTab(newValue);
    };



    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        let refreshTab = false;
        setIsModified(true);
        tabs.forEach((item: IDialogsTab) => {
            if (item[EDialogTabs.params] !== null && item[EDialogTabs.params].includes(event.target.id)) {
                refreshTab = true;
            }
        });

        updateContentDPValue(event.target.id, event.target.value, refreshTab)
    }

    const onCheckboxChange = (event: OnChangeParams) => {
        let refreshTab = false;
        setIsModified(true);
        tabs.forEach((item: IDialogsTab) => {
            if (item[EDialogTabs.params] !== null && item[EDialogTabs.params].includes(event.id)) {
                refreshTab = true;
            }
        });

        updateContentDPValue(event.id, event.value, refreshTab)

    }

    const onAutoCompleteChange = (event: OnChangeParams) => {
        let refreshTab = false;
        setIsModified(true);
        tabs.forEach((item: IDialogsTab) => {
            if (item[EDialogTabs.params] !== null && item[EDialogTabs.params].includes(event.id)) {
                refreshTab = true;
            }
        });

        updateContentDPValue(event.id, event.value, refreshTab)

    }

    const updateContentDPValue = (id: string, value: IContentValue, refreshTab: boolean) => {
        const params = {
            id,
            value,
            refreshTab,
            setDialogContent,
            componentProperties: componentRef.current,
            appsProperties,
            userProperties,
            modulesProperties,
            isModified,
            setTabs,
            setActiveTab,
            dialogDetailsRef,
            setDialogComponent
        }
        updateContentValueHandler(params)
    };


    const onActionEnd = (event: IActionsStatus) => {
        const params = {
            event,
            setErrorState,
            dialogContent,
            setDialogContent,
            dialogDetailsRef,
            appsProperties,
            modulesProperties,
            setDialogComponent
        }
        onActionEndHandler(params)
    }


    if (isLoading) return <LoadingIndicator />
    else
        return (
            <Stack_Dialogs>
                <Paper_Dialogs elevation={0} ref={refPaper} >
                    <DialogForms
                        tabs={tabs}
                        activeTab={activeTab}
                        dialogDetailsRef={dialogDetailsRef}
                        onTabChange={handleTabChanged}
                        componentProperties={componentRef.current}
                        dialogContent={dialogContent}
                        dialogComponent={dialogComponent}
                        onActionEnd={onActionEnd}
                        onInputChange={onChange}
                        onAutocompleteChange={onAutoCompleteChange}
                        onCheckboxChange={onCheckboxChange}
                        maxRows={maxRows}
                        dialogsMode={dialogsMode}
                        isModified={isModified}
                        setIsModified={setIsModified}
                        sendAction={sendAction}
                        setErrorState={setErrorState}
                        parentActiveTab={parentActiveTab}
                        parentTabIndex={parentTabIndex}
                        reserveStatus={reserveStatus}
                    />
                </Paper_Dialogs>
            </Stack_Dialogs>
        )
}
