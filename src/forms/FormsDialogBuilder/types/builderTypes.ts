/*
 * Copyright (c) 2025 NOMANA-IT and/or its affiliates.
 * All rights reserved. Use is subject to license terms.
 */

import { EDialogDetails, IDialogDetails } from '@ly_types/lyDialogs';

// Component type definitions for the palette
export interface IPaletteComponent {
    type: ComponentFieldType;
    label: string;
    icon: string;
    defaultConfig: Partial<IDialogDetails>;
}

export enum ComponentFieldType {
    Input = 'Input',
    InputNumber = 'InputNumber',
    InputDate = 'InputDate',
    InputCheckbox = 'InputCheckbox',
    InputColor = 'InputColor',
    InputEnum = 'InputEnum',
    InputLookup = 'InputLookup',
    InputPassword = 'InputPassword',
    InputMultiline = 'InputMultiline',
    FormsTable = 'FormsTable',
    FormsTree = 'FormsTree',
    FormsList = 'FormsList',
    FormsGrid = 'FormsGrid',
    InputAction = 'InputAction',
}

// Field parameter (filter) entry
export interface IFieldParameter {
    flt_id: number;
    flt_type: string;
    flt_source: string;
    flt_target: string | null;
    flt_value: string | null;
}

// Field condition parameter entry
export interface IFieldConditionParameter {
    cdn_id: number;
    cdn_type: string;
    cdn_source: string;
    cdn_target: string | null;
    cdn_value: string | null;
}

// Builder field - extends IDialogDetails with builder-specific properties
export interface IBuilderField extends IDialogDetails {
    builderID: string; // Unique ID for the builder (UUID)
    isSelected: boolean;
    parameters?: IFieldParameter[];
    conditionParameters?: IFieldConditionParameter[];
}

// Tab configuration for builder
export interface IBuilderTab {
    id: string;
    label: string;
    sequence: number;
    cols: number;
    fields: IBuilderField[];
    condition?: number;
    disable_add?: boolean;
    disable_edit?: boolean;
}

// Builder state
export interface IBuilderState {
    dialogID: number | null;
    dialogLabel: string;
    queryPool: string;
    queryID: number;
    tabs: IBuilderTab[];
    activeTab: string;
    selectedField: IBuilderField | null;
    selectedTab: IBuilderTab | null;
    isDirty: boolean;
}

// Drag and drop types
export interface IDragItem {
    type: 'PALETTE_ITEM' | 'CANVAS_ITEM';
    fieldType?: ComponentFieldType;
    field?: IBuilderField;
    tabID?: string;
}

// Property panel field types
export interface IPropertyField {
    key: string;
    label: string;
    type: 'text' | 'number' | 'checkbox' | 'select' | 'textarea';
    options?: Array<{ value: string; label: string }>;
    required?: boolean;
}
