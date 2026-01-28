/*
 * Copyright (c) 2025 NOMANA-IT and/or its affiliates.
 * All rights reserved. Use is subject to license terms.
 */

import { IBuilderState, IBuilderTab, IBuilderField } from '../types/builderTypes';
import { IDialogDetails, EDialogDetails, EDialogHeader, IDialogHeader, EDialogTabs, IDialogsTab } from '@ly_types/lyDialogs';
import { IAppsProps, EApplications } from '@ly_types/lyApplications';
import { IModulesProps } from '@ly_types/lyModules';
import { ToolsQuery } from '@ly_services/lyQuery';
import { GlobalSettings } from '@ly_utils/GlobalSettings';
import { QuerySource } from '@ly_types/lyQuery';
import { LYComponentType } from '@ly_types/lyComponents';

interface ISaveDialogParams {
    builderState: IBuilderState;
    appsProperties: IAppsProps;
    modulesProperties: IModulesProps;
}

interface ILoadDialogParams {
    dialogID: number;
    appsProperties: IAppsProps;
    modulesProperties: IModulesProps;
}

/**
 * Converts BuilderState to database format and saves to Postgres
 */
export async function saveDialogToDatabase(params: ISaveDialogParams): Promise<{ success: boolean; dialogID: number }> {
    const { builderState, appsProperties, modulesProperties } = params;

    try {
        // 1. Save Dialog Header
        const headerData: IDialogHeader = {
            [EDialogHeader.id]: builderState.dialogID?.toString() || '',
            [EDialogHeader.label]: builderState.dialogLabel,
            [EDialogHeader.pool]: builderState.queryPool,
            [EDialogHeader.queryID]: builderState.queryID,
            [EDialogHeader.language]: 'EN',
        };

        // Save or update header
        const headerResult = builderState.dialogID 
            ? await ToolsQuery.put({
                source: QuerySource.Query,
                framework_pool: appsProperties[EApplications.pool],
                query: GlobalSettings.getFramework.dialogs_header,
                sessionMode: appsProperties[EApplications.session],
                modulesProperties: modulesProperties,
                jwt_token: appsProperties[EApplications.jwt_token]
            }, JSON.stringify(headerData))
            : await ToolsQuery.post({
                source: QuerySource.Query,
                framework_pool: appsProperties[EApplications.pool],
                query: GlobalSettings.getFramework.dialogs_header,
                sessionMode: appsProperties[EApplications.session],
                modulesProperties: modulesProperties,
                jwt_token: appsProperties[EApplications.jwt_token]
            }, JSON.stringify(headerData));

        const dialogID = builderState.dialogID || headerResult.items?.[0]?.FRM_ID;

        // 2. Delete existing details and tabs (for update scenario)
        if (builderState.dialogID) {
            await ToolsQuery.delete({
                source: QuerySource.Query,
                framework_pool: appsProperties[EApplications.pool],
                query: GlobalSettings.getFramework.dialogs_details,
                sessionMode: appsProperties[EApplications.session],
                modulesProperties: modulesProperties,
                jwt_token: appsProperties[EApplications.jwt_token]
            }, JSON.stringify({ FRM_ID: dialogID }));

            await ToolsQuery.delete({
                source: QuerySource.Query,
                framework_pool: appsProperties[EApplications.pool],
                query: GlobalSettings.getFramework.dialogs_tab,
                sessionMode: appsProperties[EApplications.session],
                modulesProperties: modulesProperties,
                jwt_token: appsProperties[EApplications.jwt_token]
            }, JSON.stringify({ FRM_ID: dialogID }));
        }

        // 3. Save Tabs
        for (const tab of builderState.tabs) {
            const tabData = {
                FRM_ID: dialogID,
                [EDialogTabs.id]: tab.id,
                [EDialogTabs.sequence]: tab.sequence.toString(),
                [EDialogTabs.label]: tab.label,
                [EDialogTabs.cols]: tab.cols,
                [EDialogTabs.hide]: false,
                [EDialogTabs.condition]: tab.condition || null,
                [EDialogTabs.disable_add]: tab.disable_add ? 'Y' : 'N',
                [EDialogTabs.disable_edit]: tab.disable_edit ? 'Y' : 'N',
            };

            await ToolsQuery.post({
                source: QuerySource.Query,
                framework_pool: appsProperties[EApplications.pool],
                query: GlobalSettings.getFramework.dialogs_tab,
                sessionMode: appsProperties[EApplications.session],
                modulesProperties: modulesProperties,
                jwt_token: appsProperties[EApplications.jwt_token]
            }, JSON.stringify(tabData));

            // 4. Save Fields for this tab
            for (const field of tab.fields) {
                const detailData: Record<string, any> = {
                    FRM_ID: dialogID,
                    [EDialogDetails.id]: field[EDialogDetails.id],
                    [EDialogDetails.tab_sequence]: field[EDialogDetails.tab_sequence],
                    [EDialogDetails.sequence]: field[EDialogDetails.sequence],
                    [EDialogDetails.language]: field[EDialogDetails.language],
                    [EDialogDetails.component]: field[EDialogDetails.component],
                    [EDialogDetails.componentID]: field[EDialogDetails.componentID],
                    [EDialogDetails.dictionaryID]: field[EDialogDetails.dictionaryID],
                    [EDialogDetails.label]: field[EDialogDetails.label],
                    [EDialogDetails.type]: field[EDialogDetails.type],
                    [EDialogDetails.rules]: field[EDialogDetails.rules],
                    [EDialogDetails.rulesValues]: field[EDialogDetails.rulesValues],
                    [EDialogDetails.default]: field[EDialogDetails.default],
                    [EDialogDetails.target]: field[EDialogDetails.target],
                    [EDialogDetails.visible]: field[EDialogDetails.visible],
                    [EDialogDetails.disabled]: field[EDialogDetails.disabled],
                    [EDialogDetails.required]: field[EDialogDetails.required],
                    [EDialogDetails.key]: field[EDialogDetails.key],
                    [EDialogDetails.colspan]: field[EDialogDetails.colspan],
                    [EDialogDetails.dynamic_params]: field[EDialogDetails.dynamic_params],
                    [EDialogDetails.fixed_params]: field[EDialogDetails.fixed_params],
                    [EDialogDetails.pool_params]: field[EDialogDetails.pool_params],
                    [EDialogDetails.output_params]: field[EDialogDetails.output_params],
                    [EDialogDetails.cdn_id]: field[EDialogDetails.cdn_id],
                    [EDialogDetails.cdn_dynamic_params]: field[EDialogDetails.cdn_dynamic_params],
                    [EDialogDetails.cdn_fixed_params]: field[EDialogDetails.cdn_fixed_params],
                };

                await ToolsQuery.post({
                    source: QuerySource.Query,
                    framework_pool: appsProperties[EApplications.pool],
                    query: GlobalSettings.getFramework.dialogs_details,
                    sessionMode: appsProperties[EApplications.session],
                    modulesProperties: modulesProperties,
                    jwt_token: appsProperties[EApplications.jwt_token]
                }, JSON.stringify(detailData));
            }
        }

        return { success: true, dialogID };
    } catch (error) {
        console.error('Error saving dialog to database:', error);
        throw error;
    }
}

/**
 * Loads dialog configuration from Postgres and converts to BuilderState
 */
export async function loadDialogFromDatabase(params: ILoadDialogParams): Promise<IBuilderState> {
    const { dialogID, appsProperties, modulesProperties } = params;

    try {
        // 1. Load Dialog Header
        const headerResult = await ToolsQuery.get({
            source: QuerySource.Query,
            framework_pool: appsProperties[EApplications.pool],
            query: GlobalSettings.getFramework.dialogs_header,
            sessionMode: appsProperties[EApplications.session],
            modulesProperties: modulesProperties,
            jwt_token: appsProperties[EApplications.jwt_token],
            params: JSON.stringify({ FRM_ID: dialogID })
        });

        if (!headerResult.items || headerResult.items.length === 0) {
            throw new Error(`Dialog ${dialogID} not found`);
        }

        const header = headerResult.items[0];

        // 2. Load Tabs
        const tabsResult = await ToolsQuery.get({
            source: QuerySource.Query,
            framework_pool: appsProperties[EApplications.pool],
            query: GlobalSettings.getFramework.dialogs_tab,
            sessionMode: appsProperties[EApplications.session],
            modulesProperties: modulesProperties,
            jwt_token: appsProperties[EApplications.jwt_token],
            params: JSON.stringify({ FRM_ID: dialogID })
        });

        // 3. Load Details (Fields)
        const detailsResult = await ToolsQuery.get({
            source: QuerySource.Query,
            framework_pool: appsProperties[EApplications.pool],
            query: GlobalSettings.getFramework.dialogs_details,
            sessionMode: appsProperties[EApplications.session],
            modulesProperties: modulesProperties,
            jwt_token: appsProperties[EApplications.jwt_token],
            params: JSON.stringify({ FRM_ID: dialogID })
        });

        // 4. Convert to BuilderState
        const tabs: IBuilderTab[] = tabsResult.items.map((tabData: any) => {
            const tabFields = detailsResult.items
                .filter((detail: any) => detail[EDialogDetails.tab_sequence] === tabData[EDialogTabs.sequence])
                .map((detail: any): IBuilderField => ({
                    builderID: `${detail[EDialogDetails.id]}-${detail[EDialogDetails.sequence]}`,
                    [EDialogDetails.id]: detail[EDialogDetails.id],
                    [EDialogDetails.tab_sequence]: detail[EDialogDetails.tab_sequence],
                    [EDialogDetails.sequence]: detail[EDialogDetails.sequence],
                    [EDialogDetails.language]: detail[EDialogDetails.language],
                    [EDialogDetails.component]: detail[EDialogDetails.component],
                    [EDialogDetails.componentID]: detail[EDialogDetails.componentID],
                    [EDialogDetails.dictionaryID]: detail[EDialogDetails.dictionaryID],
                    [EDialogDetails.label]: detail[EDialogDetails.label],
                    [EDialogDetails.type]: detail[EDialogDetails.type],
                    [EDialogDetails.rules]: detail[EDialogDetails.rules],
                    [EDialogDetails.rulesValues]: detail[EDialogDetails.rulesValues],
                    [EDialogDetails.default]: detail[EDialogDetails.default],
                    [EDialogDetails.target]: detail[EDialogDetails.target],
                    [EDialogDetails.visible]: detail[EDialogDetails.visible],
                    [EDialogDetails.disabled]: detail[EDialogDetails.disabled],
                    [EDialogDetails.required]: detail[EDialogDetails.required],
                    [EDialogDetails.key]: detail[EDialogDetails.key],
                    [EDialogDetails.colspan]: detail[EDialogDetails.colspan],
                    [EDialogDetails.dynamic_params]: detail[EDialogDetails.dynamic_params],
                    [EDialogDetails.fixed_params]: detail[EDialogDetails.fixed_params],
                    [EDialogDetails.pool_params]: detail[EDialogDetails.pool_params],
                    [EDialogDetails.output_params]: detail[EDialogDetails.output_params],
                    [EDialogDetails.cdn_id]: detail[EDialogDetails.cdn_id],
                    [EDialogDetails.cdn_dynamic_params]: detail[EDialogDetails.cdn_dynamic_params],
                    [EDialogDetails.cdn_fixed_params]: detail[EDialogDetails.cdn_fixed_params],
                    isSelected: false,
                }));

            return {
                id: tabData[EDialogTabs.id],
                label: tabData[EDialogTabs.label],
                sequence: parseInt(tabData[EDialogTabs.sequence]),
                cols: tabData[EDialogTabs.cols],
                condition: tabData[EDialogTabs.condition] || undefined,
                disable_add: tabData[EDialogTabs.disable_add] === 'Y',
                disable_edit: tabData[EDialogTabs.disable_edit] === 'Y',
                fields: tabFields,
            };
        });

        const builderState: IBuilderState = {
            dialogID: dialogID,
            dialogLabel: header[EDialogHeader.label],
            queryPool: header[EDialogHeader.pool],
            queryID: header[EDialogHeader.queryID],
            tabs: tabs,
            activeTab: tabs[0]?.id || '',
            selectedField: null,
            selectedTab: null,
            isDirty: false,
        };

        return builderState;
    } catch (error) {
        console.error('Error loading dialog from database:', error);
        throw error;
    }
}

/**
 * Converts BuilderState to IDialogDetails[] format for FormsDialog component
 */
export function builderStateToDialogDetails(builderState: IBuilderState): {
    header: IDialogHeader;
    details: IDialogDetails[];
    tabs: IDialogsTab[];
} {
    const header: IDialogHeader = {
        [EDialogHeader.id]: builderState.dialogID?.toString() || '',
        [EDialogHeader.label]: builderState.dialogLabel,
        [EDialogHeader.pool]: builderState.queryPool,
        [EDialogHeader.queryID]: builderState.queryID,
        [EDialogHeader.language]: 'EN',
    };

    const details: IDialogDetails[] = [];
    const tabs: IDialogsTab[] = [];


    builderState.tabs.forEach((tab) => {
        tabs.push({
            [EDialogTabs.id]: parseInt(tab.id) || 0,
            [EDialogTabs.sequence]: tab.sequence.toString(),
            [EDialogTabs.label]: tab.label,
            [EDialogTabs.hide]: false,
            [EDialogTabs.cols]: tab.cols,
            [EDialogTabs.params]: null,
        });

        tab.fields.forEach((field) => {
            details.push({
                [EDialogDetails.id]: field[EDialogDetails.id],
                [EDialogDetails.tab_sequence]: field[EDialogDetails.tab_sequence],
                [EDialogDetails.sequence]: field[EDialogDetails.sequence],
                [EDialogDetails.language]: field[EDialogDetails.language],
                [EDialogDetails.component]: field[EDialogDetails.component],
                [EDialogDetails.componentID]: field[EDialogDetails.componentID],
                [EDialogDetails.dictionaryID]: field[EDialogDetails.dictionaryID],
                [EDialogDetails.label]: field[EDialogDetails.label],
                [EDialogDetails.type]: field[EDialogDetails.type],
                [EDialogDetails.rules]: field[EDialogDetails.rules],
                [EDialogDetails.rulesValues]: field[EDialogDetails.rulesValues],
                [EDialogDetails.default]: field[EDialogDetails.default],
                [EDialogDetails.target]: field[EDialogDetails.target],
                [EDialogDetails.visible]: field[EDialogDetails.visible],
                [EDialogDetails.disabled]: field[EDialogDetails.disabled],
                [EDialogDetails.required]: field[EDialogDetails.required],
                [EDialogDetails.key]: field[EDialogDetails.key],
                [EDialogDetails.colspan]: field[EDialogDetails.colspan],
                [EDialogDetails.dynamic_params]: field[EDialogDetails.dynamic_params],
                [EDialogDetails.fixed_params]: field[EDialogDetails.fixed_params],
                [EDialogDetails.pool_params]: field[EDialogDetails.pool_params],
                [EDialogDetails.output_params]: field[EDialogDetails.output_params],
                [EDialogDetails.cdn_id]: field[EDialogDetails.cdn_id],
                [EDialogDetails.cdn_dynamic_params]: field[EDialogDetails.cdn_dynamic_params],
                [EDialogDetails.cdn_fixed_params]: field[EDialogDetails.cdn_fixed_params],
            });
        });
    });

    return { header, details, tabs };
}
