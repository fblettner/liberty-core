/*
 * Copyright (c) 2022 NOMANA-IT and/or its affiliates.
 * All rights reserved. Use is subject to license terms.
 * *
 */

// React Import
import React, { Fragment } from 'react';

// Import Custom
import { CDialogContent, EDialogDetails, EDialogTabs, IDialogDetails } from '@ly_types/lyDialogs';
import { ComponentProperties, LYComponentMode, LYComponentType } from '@ly_types/lyComponents';
import { TabContainer } from "@ly_forms/FormsDialog/render/TabContainer";
import { TabPanel } from '@ly_forms/FormsDialog/render/TabPanel';
import { DialogTab } from '@ly_forms/FormsDialog/render/DialogTab';
import { IDialogsTab } from "@ly_types/lyDialogs";
import { IDialogAction, IErrorState, IReserveStatus } from '@ly_utils/commonUtils';
import { OnActionEndFunction, OnAutocompleteChangeFunction, OnCheckboxChangeFunction, OnInputChangeFunction, OnTabChangeFunction } from '@ly_forms/FormsDialog/utils/commonUtils';
import { GridFlexContainer } from '@ly_common/Grid';
import { IAppsProps } from '@ly_types/lyApplications';
import { IUsersProps } from '@ly_types/lyUsers';
import { IModulesProps } from '@ly_types/lyModules';

interface IDialogForms {
    tabs: IDialogsTab[];
    activeTab: string;
    dialogDetailsRef: React.MutableRefObject<IDialogDetails[]>;
    onTabChange: OnTabChangeFunction;
    dialogContent: CDialogContent;
    dialogComponent: CDialogContent
    componentProperties: ComponentProperties
    maxRows: number
    onAutocompleteChange: OnAutocompleteChangeFunction;
    onInputChange: OnInputChangeFunction;
    onCheckboxChange: OnCheckboxChangeFunction;
    dialogsMode: LYComponentMode;
    isModified: boolean;
    setIsModified: React.Dispatch<React.SetStateAction<boolean>>;
    sendAction?: IDialogAction;
    setSendAction?: React.Dispatch<React.SetStateAction<IDialogAction>>;
    setErrorState: React.Dispatch<React.SetStateAction<IErrorState>>;
    onActionEnd: OnActionEndFunction;
    parentActiveTab?: string
    parentTabIndex?: string;
    appsProperties: IAppsProps;
    userProperties: IUsersProps;
    modulesProperties: IModulesProps;
    reserveStatus: IReserveStatus;
    onReserveRecord: (type: string, payload: string) => void;
}

export const DialogForms = (props: IDialogForms) => {
    const {
        tabs,
        activeTab,
        dialogDetailsRef,
        onTabChange,
        dialogContent,
        dialogComponent,
        componentProperties,
        reserveStatus,
        maxRows,
        onAutocompleteChange,
        onInputChange,
        onCheckboxChange,
        dialogsMode,
        isModified,
        setIsModified,
        sendAction,
        setSendAction,
        setErrorState,
        onActionEnd,
        parentActiveTab,
        parentTabIndex,
        appsProperties,
        userProperties,
        modulesProperties,
        onReserveRecord
    } = props;

    const renderTab = (item: IDialogDetails, tab: IDialogsTab) => {
        return (
            <DialogTab
                item={item}
                tab={tab}
                componentProperties={componentProperties}
                dialogContent={dialogContent}
                dialogComponent={dialogComponent}
                reserveStatus={reserveStatus}
                onActionEnd={onActionEnd}
                onInputChange={onInputChange}
                onAutocompleteChange={onAutocompleteChange}
                onCheckboxChange={onCheckboxChange}
                maxRows={maxRows}
                dialogsMode={dialogsMode}
                isModified={isModified}
                setIsModified={setIsModified}
                sendAction={sendAction}
                setSendAction={setSendAction}
                setErrorState={setErrorState}
                activeTab={activeTab}
                parentActiveTab={parentActiveTab}
                parentTabIndex={parentTabIndex}
                appsProperties={appsProperties}
                userProperties={userProperties}
                modulesProperties={modulesProperties}
                onReserveRecord={onReserveRecord}
            />
        )
    }

    return (
        <Fragment>
            {tabs.length > 1 &&
                <TabContainer
                    tabs={tabs}
                    activeTab={activeTab}
                    onTabChange={onTabChange}
                />
            }
                {tabs.filter((tab) => tab[EDialogTabs.hide] !== true).map((tab: IDialogsTab) => (
                    <TabPanel key={tab[EDialogTabs.sequence] + '-panel'} value={activeTab} index={tab[EDialogTabs.sequence]} >
                        <GridFlexContainer key={tab[EDialogTabs.sequence] + '-grid'} spacing={4} px={2} py={2}
                            flexDirection='row'
                            style={{
                                height: dialogDetailsRef.current.some((panel: IDialogDetails) =>
                                    panel[EDialogDetails.tab_sequence] === tab[EDialogTabs.sequence] &&
                                    (panel[EDialogDetails.component] === LYComponentType.FormsTable
                                        || panel[EDialogDetails.component] === LYComponentType.FormsTree
                                        || panel[EDialogDetails.component] === LYComponentType.FormsList
                                        || panel[EDialogDetails.component] === LYComponentType.FormsGrid
                                    ))
                                    ? '100%' : undefined,
                            }}>
                            {dialogDetailsRef.current
                                .filter((panel: IDialogDetails) => panel[EDialogDetails.tab_sequence] === tab[EDialogTabs.sequence])
                                .map((item: IDialogDetails) => (
                                    <Fragment key={item[EDialogDetails.id]}>
                                        {renderTab(item, tab)}
                                    </Fragment>
                                ))}
                        </GridFlexContainer>
                    </TabPanel>
                ))}
        </Fragment>
    )
}

