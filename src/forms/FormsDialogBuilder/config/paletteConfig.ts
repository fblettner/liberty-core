/*
 * Copyright (c) 2025 NOMANA-IT and/or its affiliates.
 * All rights reserved. Use is subject to license terms.
 */

import { ComponentFieldType, IPaletteComponent } from '../types/builderTypes';
import { EDialogDetails } from '@ly_types/lyDialogs';
import { EDictionaryRules, EDictionaryType } from '@ly_types/lyDictionary';

// Define all available components in the palette
export const PALETTE_COMPONENTS: IPaletteComponent[] = [
    {
        type: ComponentFieldType.Input,
        label: 'Text Input',
        icon: '📝',
        defaultConfig: {
            [EDialogDetails.component]: 'DD',
            [EDialogDetails.type]: EDictionaryType.text,
            [EDialogDetails.rules]: '',
            [EDialogDetails.colspan]: 1,
            [EDialogDetails.visible]: 'Y',
            [EDialogDetails.disabled]: 'N',
            [EDialogDetails.required]: 'N',
            [EDialogDetails.key]: 'N',
        }
    },
    {
        type: ComponentFieldType.InputNumber,
        label: 'Number Input',
        icon: '🔢',
        defaultConfig: {
            [EDialogDetails.component]: 'DD',
            [EDialogDetails.type]: EDictionaryType.number,
            [EDialogDetails.rules]: '',
            [EDialogDetails.colspan]: 1,
            [EDialogDetails.visible]: 'Y',
            [EDialogDetails.disabled]: 'N',
            [EDialogDetails.required]: 'N',
            [EDialogDetails.key]: 'N',
        }
    },
    {
        type: ComponentFieldType.InputDate,
        label: 'Date Picker',
        icon: '📅',
        defaultConfig: {
            [EDialogDetails.component]: 'DD',
            [EDialogDetails.type]: EDictionaryType.date,
            [EDialogDetails.rules]: '',
            [EDialogDetails.colspan]: 1,
            [EDialogDetails.visible]: 'Y',
            [EDialogDetails.disabled]: 'N',
            [EDialogDetails.required]: 'N',
            [EDialogDetails.key]: 'N',
        }
    },
    {
        type: ComponentFieldType.InputCheckbox,
        label: 'Checkbox',
        icon: '☑️',
        defaultConfig: {
            [EDialogDetails.component]: 'DD',
            [EDialogDetails.type]: EDictionaryType.boolean,
            [EDialogDetails.rules]: '',
            [EDialogDetails.colspan]: 1,
            [EDialogDetails.visible]: 'Y',
            [EDialogDetails.disabled]: 'N',
            [EDialogDetails.required]: 'N',
            [EDialogDetails.key]: 'N',
        }
    },
    {
        type: ComponentFieldType.InputColor,
        label: 'Color Picker',
        icon: '🎨',
        defaultConfig: {
            [EDialogDetails.component]: 'DD',
            [EDialogDetails.type]: EDictionaryType.text,
            [EDialogDetails.rules]: EDictionaryRules.color,
            [EDialogDetails.colspan]: 1,
            [EDialogDetails.visible]: 'Y',
            [EDialogDetails.disabled]: 'N',
            [EDialogDetails.required]: 'N',
            [EDialogDetails.key]: 'N',
        }
    },
    {
        type: ComponentFieldType.InputEnum,
        label: 'Enum',
        icon: '📋',
        defaultConfig: {
            [EDialogDetails.component]: 'DD',
            [EDialogDetails.type]: EDictionaryType.text,
            [EDialogDetails.rules]: EDictionaryRules.enum,
            [EDialogDetails.colspan]: 1,
            [EDialogDetails.visible]: 'Y',
            [EDialogDetails.disabled]: 'N',
            [EDialogDetails.required]: 'N',
            [EDialogDetails.key]: 'N',
        }
    },
    {
        type: ComponentFieldType.InputLookup,
        label: 'Lookup',
        icon: '🔍',
        defaultConfig: {
            [EDialogDetails.component]: 'DD',
            [EDialogDetails.type]: EDictionaryType.text,
            [EDialogDetails.rules]: EDictionaryRules.lookup,
            [EDialogDetails.colspan]: 1,
            [EDialogDetails.visible]: 'Y',
            [EDialogDetails.disabled]: 'N',
            [EDialogDetails.required]: 'N',
            [EDialogDetails.key]: 'N',
        }
    },
    {
        type: ComponentFieldType.InputPassword,
        label: 'Password',
        icon: '🔒',
        defaultConfig: {
            [EDialogDetails.component]: 'DD',
            [EDialogDetails.type]: EDictionaryType.text,
            [EDialogDetails.rules]: EDictionaryRules.password,
            [EDialogDetails.colspan]: 1,
            [EDialogDetails.visible]: 'Y',
            [EDialogDetails.disabled]: 'N',
            [EDialogDetails.required]: 'N',
            [EDialogDetails.key]: 'N',
        }
    },
    {
        type: ComponentFieldType.InputMultiline,
        label: 'Text Area',
        icon: '📄',
        defaultConfig: {
            [EDialogDetails.component]: 'DD',
            [EDialogDetails.type]: EDictionaryType.text,
            [EDialogDetails.rules]: '',
            [EDialogDetails.colspan]: 2,
            [EDialogDetails.visible]: 'Y',
            [EDialogDetails.disabled]: 'N',
            [EDialogDetails.required]: 'N',
            [EDialogDetails.key]: 'N',
        }
    },
    {
        type: ComponentFieldType.FormsTable,
        label: 'Table',
        icon: '📊',
        defaultConfig: {
            [EDialogDetails.component]: 'FormsTable',
            [EDialogDetails.type]: '',
            [EDialogDetails.colspan]: 2,
            [EDialogDetails.visible]: 'Y',
            [EDialogDetails.disabled]: 'N',
            [EDialogDetails.required]: 'N',
            [EDialogDetails.key]: 'N',
        }
    },
    {
        type: ComponentFieldType.FormsTree,
        label: 'Tree',
        icon: '🌲',
        defaultConfig: {
            [EDialogDetails.component]: 'FormsTree',
            [EDialogDetails.type]: '',
            [EDialogDetails.colspan]: 2,
            [EDialogDetails.visible]: 'Y',
            [EDialogDetails.disabled]: 'N',
            [EDialogDetails.required]: 'N',
            [EDialogDetails.key]: 'N',
        }
    },
    {
        type: ComponentFieldType.FormsList,
        label: 'List',
        icon: '📑',
        defaultConfig: {
            [EDialogDetails.component]: 'FormsList',
            [EDialogDetails.type]: '',
            [EDialogDetails.colspan]: 2,
            [EDialogDetails.visible]: 'Y',
            [EDialogDetails.disabled]: 'N',
            [EDialogDetails.required]: 'N',
            [EDialogDetails.key]: 'N',
        }
    },
    {
        type: ComponentFieldType.FormsGrid,
        label: 'Grid',
        icon: '⊞',
        defaultConfig: {
            [EDialogDetails.component]: 'FormsGrid',
            [EDialogDetails.type]: '',
            [EDialogDetails.colspan]: 2,
            [EDialogDetails.visible]: 'Y',
            [EDialogDetails.disabled]: 'N',
            [EDialogDetails.required]: 'N',
            [EDialogDetails.key]: 'N',
        }
    },
    {
        type: ComponentFieldType.InputAction,
        label: 'Action Button',
        icon: '⚡',
        defaultConfig: {
            [EDialogDetails.component]: 'InputAction',
            [EDialogDetails.type]: '',
            [EDialogDetails.colspan]: 1,
            [EDialogDetails.visible]: 'Y',
            [EDialogDetails.disabled]: 'N',
            [EDialogDetails.required]: 'N',
            [EDialogDetails.key]: 'N',
        }
    },
];
