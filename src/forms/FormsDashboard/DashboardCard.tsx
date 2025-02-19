/*
 * Copyright (c) 2022 NOMANA-IT and/or its affiliates.
 * All rights reserved. Use is subject to license terms.
 * *
 */
// React Import

//Custom Import
import { ComponentProperties, LYComponentMode, LYComponentType, LYComponentDisplayMode, LYComponentViewMode } from "@ly_types/lyComponents";
import { EDahsboardContent, IDashboardContent, IDashboardState } from "@ly_types/lyDashboard";
import { FormsChart } from "@ly_forms/FormsChart/FormsChart";
import { FormsTable } from "@ly_forms/FormsTable/FormsTable";
import { FormsTools } from "@ly_forms/FormsTools/FormsTools";
import { LYMoreVertIcon } from "@ly_styles/icons";
import { IconButton } from "@ly_common/IconButton";
import { Card_Dashboard } from "@ly_styles/Card";
import { CardContent, CardHeader } from "@ly_common/Card";
import { Div } from "@ly_styles/Div";
import { useAppContext } from "@ly_context/AppProvider";

export interface IDashboardCard {
    dashboardData: IDashboardState;
    row: number;
    column: number;
}

// Helper function to render FormsTable
interface IRenderFormsTableProps  {
    component: ComponentProperties,
    viewMode: LYComponentViewMode,
    content: IDashboardContent,
    viewGrid: boolean;
}

const renderFormsTable = (props: IRenderFormsTableProps) => {
    const { component, viewMode, content, viewGrid } = props;
    return (
        <FormsTable
            key={content[EDahsboardContent.component] + "-" + content[EDahsboardContent.componentID]}
            viewMode={viewMode}
            displayMode={LYComponentDisplayMode.dashboard}
            viewGrid={viewGrid}
            componentProperties={component}
            readonly={false}
        />
    );
}


export const DashboardCard = (props: IDashboardCard) => {
    const { dashboardData, row, column } = props;
    const { userProperties, appsProperties, modulesProperties } = useAppContext();

    let content = dashboardData.content?.find((item: IDashboardContent) => item[EDahsboardContent.rows] === row && item[EDahsboardContent.columns] === column)
    if (content === undefined)
        return <Div></Div>;

    let targetComponent: ComponentProperties = {
        id: content[EDahsboardContent.componentID],
        type: content[EDahsboardContent.component],
        label: "",
        filters: [],
        showPreviousButton: false,
        componentMode: LYComponentMode.find,
        isChildren: false,
        content: content[EDahsboardContent.content],
        
    };

    let displayComponent;

    switch (content[EDahsboardContent.component]) {
        case LYComponentType.FormsContent:
            displayComponent =  content[EDahsboardContent.content];
            break;

        case LYComponentType.FormsChart:
            displayComponent = <FormsChart
                key={`${content[EDahsboardContent.component]}-${content[EDahsboardContent.componentID]}`} 
                componentProperties={targetComponent} 
            />;
            break;
        case LYComponentType.FormsTree:
            const paramsTree = {
                component: targetComponent,
                viewMode: LYComponentViewMode.tree,
                content: content,
                viewGrid: false,
                appsProperties: appsProperties,
                userProperties: userProperties,
                modulesProperties: modulesProperties
            }
            displayComponent = renderFormsTable(paramsTree);
            break;
        case LYComponentType.FormsTable:
            const paramsTable = {
                component: targetComponent,
                viewMode: LYComponentViewMode.table,
                content: content,
                viewGrid: true,
                appsProperties: appsProperties,
                userProperties: userProperties,
                modulesProperties: modulesProperties
            }
            displayComponent = renderFormsTable(paramsTable);
            break;
        case LYComponentType.FormsList:
            const paramsList = {
                component: targetComponent,
                viewMode: LYComponentViewMode.list,
                content: content,
                viewGrid: false,
                appsProperties: appsProperties,
                userProperties: userProperties,
                modulesProperties: modulesProperties
            }
            displayComponent = renderFormsTable(paramsList);
            break;
        case LYComponentType.FormsTools:
            displayComponent = <FormsTools />;
            break;            
    }
    return (
        <Card_Dashboard >
            {content[EDahsboardContent.display_title] === "Y" &&
                <CardHeader
                    title={content[EDahsboardContent.title]}
                    action={
                        <IconButton 
                            aria-label="settings"
                            icon={LYMoreVertIcon} 
                        />
                    } />
            }
            <CardContent >
                    {displayComponent}
            </CardContent>
        </Card_Dashboard>
    )
}