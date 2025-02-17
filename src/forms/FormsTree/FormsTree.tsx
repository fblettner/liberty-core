/*
 * Copyright (c) 2022 NOMANA-IT and/or its affiliates.
 * All rights reserved. Use is subject to license terms.
 * *
 */

// Custom Import
import { FormsTable } from "@ly_forms/FormsTable/FormsTable";
import { ComponentProperties, LYComponentDisplayMode, LYComponentViewMode } from "@ly_types/lyComponents";

export interface IFormsTree {
    componentProperties: ComponentProperties;
    displayMode: LYComponentDisplayMode;
}

export function FormsTree(props: IFormsTree) {
    const { componentProperties, displayMode } = props;
    return (
        <FormsTable
            componentProperties={componentProperties}
            displayMode={displayMode}
            viewMode={LYComponentViewMode.tree}
            viewGrid={false}
            readonly={false}
        />
    )
}