/*
 * Copyright (c) 2022 NOMANA-IT and/or its affiliates.
 * All rights reserved. Use is subject to license terms.
 * *
 */

// Custom Import
import { FormsTable } from "@ly_forms/FormsTable/FormsTable";
import { IAppsProps } from "@ly_types/lyApplications";
import { ComponentProperties, LYComponentDisplayMode, LYComponentViewMode } from "@ly_types/lyComponents";
import { IModulesProps } from "@ly_types/lyModules";
import { IUsersProps } from "@ly_types/lyUsers";

export interface IFormsTree {
    componentProperties: ComponentProperties;
    displayMode: LYComponentDisplayMode;
    appsProperties: IAppsProps;
    userProperties: IUsersProps;
    modulesProperties: IModulesProps;
}

export function FormsTree(props: IFormsTree) {
    const { componentProperties, displayMode, appsProperties, userProperties, modulesProperties } = props;
    return (
        <FormsTable
            componentProperties={componentProperties}
            displayMode={displayMode}
            viewMode={LYComponentViewMode.tree}
            viewGrid={false}
            readonly={false}
            appsProperties={appsProperties}
            userProperties={userProperties}
            modulesProperties={modulesProperties}
        />
    )
}