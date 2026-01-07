/*
 * Copyright (c) 2025 NOMANA-IT and/or its affiliates.
 * All rights reserved. Use is subject to license terms.
 */

import React, { useCallback, useState } from 'react';
import styled from '@emotion/styled';
import { Typography } from '@ly_common/Typography';
import { Div } from '@ly_styles/Div';
import { Input } from '@ly_common/Input';
import { Select } from '@ly_common/Select';
import { InputCheckbox } from '@ly_input/InputCheckbox';
import { InputLookup } from '@ly_input/InputLookup/InputLookup';
import { InputEnum } from '@ly_input/InputEnum/InputEnum';
import { IBuilderField, IBuilderTab, IFieldParameter, IFieldConditionParameter } from '../types/builderTypes';
import { EDialogDetails } from '@ly_types/lyDialogs';
import { Divider } from '@ly_common/Divider';
import { Button } from '@ly_common/Button';
import { Tabs } from '@ly_common/Tabs';
import { Tab } from '@ly_common/Tab';
import { IconButton } from '@ly_common/IconButton';
import { Dialog } from '@ly_common/Dialog';
import { LYAddIcon, LYDeleteIcon, LYEditIcon } from '@ly_styles/icons';
import { LYIconSize } from '@ly_utils/commonUtils';

const PropertyContainer = styled(Div)(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    height: "100%",
    flex: "1 1 0px",
    overflowY: 'auto',
    padding: '16px',
}));

const PropertySection = styled(Div)({
    marginBottom: '16px',
});

const SectionTitle = styled(Typography)(({ theme }) => ({
    fontWeight: 600,
    marginBottom: '8px',
    color: theme.palette.text.secondary,
}));

const EmptyState = styled(Div)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '200px',
    padding: '24px',
}));

const ParameterList = styled(Div)(({ theme }) => ({
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: '4px',
    marginTop: '8px',
}));

const ParameterItem = styled(Div)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: '8px 12px',
    borderBottom: `1px solid ${theme.palette.divider}`,
    '&:last-child': {
        borderBottom: 'none',
    },
    '&:hover': {
        backgroundColor: theme.palette.action.hover,
    },
}));

const ParameterInfo = styled(Div)({
    flex: 1,
    minWidth: 0,
});

const ParameterActions = styled(Div)({
    display: 'flex',
    gap: '4px',
});

interface IPropertyPanelProps {
    selectedField: IBuilderField | null;
    selectedTab: IBuilderTab | null;
    tabs: IBuilderTab[];
    onFieldUpdate: (field: IBuilderField) => void;
    onTabUpdate: (tab: IBuilderTab) => void;
    onFieldMoveToTab: (field: IBuilderField, newTabID: string) => void;
    onClose: () => void;
    dialogID: number | null;
    dialogLabel: string;
    queryID: number;
    onDialogHeaderUpdate: (key: 'dialogID' | 'dialogLabel' | 'queryID', value: any) => void;
}

export const PropertyPanel: React.FC<IPropertyPanelProps> = ({
    selectedField,
    selectedTab,
    tabs,
    onFieldUpdate,
    onTabUpdate,
    onFieldMoveToTab,
    onClose,
    dialogID,
    dialogLabel,
    queryID,
    onDialogHeaderUpdate,
}) => {
    const [activeFieldTab, setActiveFieldTab] = useState('properties');
    const [editingParameter, setEditingParameter] = useState<{ index: number; param: IFieldParameter } | null>(null);
    const [editingConditionParameter, setEditingConditionParameter] = useState<{ index: number; param: IFieldConditionParameter } | null>(null);

    const handleChange = useCallback((key: string, value: any) => {
        if (!selectedField) return;

        const updatedField = {
            ...selectedField,
            [key]: value,
        };
        onFieldUpdate(updatedField);
    }, [selectedField, onFieldUpdate]);

    const handleTabChange = useCallback((key: keyof IBuilderTab, value: any) => {
        if (!selectedTab) return;

        const updatedTab = {
            ...selectedTab,
            [key]: value,
        };
        onTabUpdate(updatedTab);
    }, [selectedTab, onTabUpdate]);

    // Find which tab contains the selected field
    const currentFieldTab = selectedField 
        ? tabs.find((tab) => tab.fields.some((f) => f.builderID === selectedField.builderID))
        : null;

    const handleSaveParameter = useCallback(() => {
        if (!editingParameter || !selectedField) return;

        const updatedParams = [...(selectedField.parameters || [])];
        updatedParams[editingParameter.index] = editingParameter.param;
        handleChange('parameters', updatedParams);
        setEditingParameter(null);
    }, [editingParameter, selectedField, handleChange]);

    const handleSaveConditionParameter = useCallback(() => {
        if (!editingConditionParameter || !selectedField) return;

        const updatedParams = [...(selectedField.conditionParameters || [])];
        updatedParams[editingConditionParameter.index] = editingConditionParameter.param;
        handleChange('conditionParameters', updatedParams);
        setEditingConditionParameter(null);
    }, [editingConditionParameter, selectedField, handleChange]);

    // Show tab properties when a tab is selected
    if (selectedTab) {
        return (
            <PropertyContainer>
                <Div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <Typography variant="h6">Tab Properties</Typography>
                    <Button onClick={onClose}>Close</Button>
                </Div>
                <Divider />

                <PropertySection>
                    <SectionTitle variant="caption">Properties</SectionTitle>

                    <Input
                        id="tab-order"
                        label="Tab Order"
                        type="number"
                        value={selectedTab.sequence || 1}
                        onChange={(e) => handleTabChange('sequence', parseInt(e.target.value))}
                        fullWidth
                        variant="standard"
                    />

                    <Input
                        id="tab-description"
                        label="Description"
                        value={selectedTab.label || ''}
                        onChange={(e) => handleTabChange('label', e.target.value)}
                        fullWidth
                        variant="standard"
                    />
                </PropertySection>

                <PropertySection>
                    <SectionTitle variant="caption">Display</SectionTitle>

                    <Input
                        id="tab-condition"
                        label="Display condition"
                        type="number"
                        value={selectedTab.condition || ''}
                        onChange={(e) => handleTabChange('condition', e.target.value ? parseInt(e.target.value) : undefined)}
                        fullWidth
                        variant="standard"
                    />

                    <Input
                        id="tab-cols"
                        label="Columns to display"
                        type="number"
                        value={selectedTab.cols || 1}
                        onChange={(e) => handleTabChange('cols', parseInt(e.target.value))}
                        fullWidth
                        variant="standard"
                    />
                </PropertySection>

                <PropertySection>
                    <SectionTitle variant="caption">Behavior</SectionTitle>

                    <InputCheckbox
                        id="tab-disable-add"
                        label="Disable on Add (Y/N)"
                        defaultValue={selectedTab.disable_add || false}
                        onChange={(e: { value: any; }) => handleTabChange('disable_add', e.value)}
                    />

                    <InputCheckbox
                        id="tab-disable-edit"
                        label="Disable on Edit (Y/N)"
                        defaultValue={selectedTab.disable_edit || false}
                        onChange={(e: { value: any; }) => handleTabChange('disable_edit', e.value)}
                    />
                </PropertySection>
            </PropertyContainer>
        );
    }

    if (!selectedField) {
        return (
            <PropertyContainer>
                <Div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <Typography variant="h6">Dialog Properties</Typography>
                </Div>
                <Divider />

                <PropertySection>
                    <SectionTitle variant="caption">Header</SectionTitle>

                    <Input
                        id="dialog-label"
                        label="Dialog Label"
                        value={dialogLabel}
                        onChange={(e) => onDialogHeaderUpdate('dialogLabel', e.target.value)}
                        fullWidth
                        variant="standard"
                    />

                    <div style={{ marginTop: '16px' }}>
                        <InputLookup
                            id="dialog-id"
                            lookupID={24}
                            label="Dialog ID"
                            disabled={false}
                            defaultValue={dialogID ? dialogID.toString() : null}
                            onChange={(params) => {
                                onDialogHeaderUpdate('dialogID', parseInt(params.value?.toString() || '0') || 0);
                            }}
                            fixed_params={dialogID ? `DLG_ID=${dialogID}` : ""}
                            variant="standard"
                        />
                    </div>

                    <div style={{ marginTop: '16px' }}>
                        <InputLookup
                            id="query-id"
                            lookupID={1}
                            label="Query ID"
                            disabled={false}
                            defaultValue={queryID ? queryID.toString() : null}
                            onChange={(params) => {
                                onDialogHeaderUpdate('queryID', parseInt(params.value?.toString() || '0') || 0);
                            }}
                            fixed_params={queryID ? `QUERY_TYPE=CRUD;QUERY_ID=${queryID}` : "QUERY_TYPE=CRUD"}
                            variant="standard"
                        />
                    </div>
                </PropertySection>
            </PropertyContainer>
        );
    }

    const isDataComponent = ['FormsTable', 'FormsTree', 'FormsList', 'FormsGrid'].includes(
        selectedField[EDialogDetails.component]
    );

    return (
        <PropertyContainer>
            <Div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <Typography variant="h6">Field Properties</Typography>
                <Button onClick={onClose}>Close</Button>
            </Div>
            <Divider />

            <Tabs value={activeFieldTab} onChange={(e, newValue) => setActiveFieldTab(newValue)}>
                <Tab id="tab-properties" label="Properties" value="properties" />
                <Tab id="tab-parameters" label="Parameters" value="parameters" />
                <Tab id="tab-conditions" label="Conditions" value="conditions" />
            </Tabs>

            <Div style={{ marginTop: '16px' }}>
                {/* Properties Tab */}
                {activeFieldTab === 'properties' && (
                    <>
                        <PropertySection>
                            <SectionTitle variant="caption">Field Order</SectionTitle>
                            <Input
                                id="input-sequence"
                                label="Field Order"
                                type="number"
                                value={selectedField[EDialogDetails.sequence] || 0}
                                onChange={(e) => handleChange(EDialogDetails.sequence, parseInt(e.target.value))}
                                fullWidth
                                variant="standard"
                            />
                        </PropertySection>

                        <PropertySection>
                            <SectionTitle variant="caption">Description</SectionTitle>
                            <Input
                                id="input-label"
                                label="Description"
                                value={selectedField[EDialogDetails.label] || ''}
                                onChange={(e) => handleChange(EDialogDetails.label, e.target.value)}
                                fullWidth
                                variant="standard"
                            />
                        </PropertySection>

                        <PropertySection>
                            <SectionTitle variant="caption">Field Definition</SectionTitle>
                            
                            <Input
                                id="input-field"
                                label="Field ID"
                                value={selectedField[EDialogDetails.id] || ''}
                                onChange={(e) => handleChange(EDialogDetails.id, e.target.value)}
                                fullWidth
                                variant="standard"
                            />

                            <Input
                                id="input-dd"
                                label="Dictionary ID"
                                value={selectedField[EDialogDetails.dictionaryID] || ''}
                                onChange={(e) => handleChange(EDialogDetails.dictionaryID, e.target.value)}
                                fullWidth
                                variant="standard"
                                helperText="Column dictionary (use custom value to override)"
                            />

                            <Input
                                id="input-target"
                                label="Target Field"
                                value={selectedField[EDialogDetails.target] || ''}
                                onChange={(e) => handleChange(EDialogDetails.target, e.target.value)}
                                fullWidth
                                variant="standard"
                            />
                        </PropertySection>

                        <PropertySection>
                            <SectionTitle variant="caption">Layout</SectionTitle>

                            <Select
                                id="input-tab"
                                label="Tab"
                                value={currentFieldTab?.id || ''}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>, option: any) => {
                                    if (option?.value) {
                                        onFieldMoveToTab(selectedField, option.value);
                                    }
                                }}
                                fullWidth
                                variant="standard"
                                options={tabs.map((tab) => ({
                                    value: tab.id,
                                    label: `${tab.sequence}. ${tab.label}`,
                                }))}
                                selectOnly
                                showClearButton={false}
                            />

                            <Input
                                id="input-colspan"
                                label="Columns to display"
                                type="number"
                                value={selectedField[EDialogDetails.colspan] || 1}
                                onChange={(e) => handleChange(EDialogDetails.colspan, parseInt(e.target.value))}
                                fullWidth
                                variant="standard"
                            />
                        </PropertySection>

                        <PropertySection>
                            <SectionTitle variant="caption">Behavior</SectionTitle>

                            <InputCheckbox
                                id="visible"
                                label="Visible (Y/N)"
                                defaultValue={selectedField[EDialogDetails.visible] === 'Y'}
                                onChange={(e: { value: any; }) => handleChange(EDialogDetails.visible, e.value ? 'Y' : 'N')}
                            />

                            <InputCheckbox
                                id="disabled"
                                label="Disabled (Y/N)"
                                defaultValue={selectedField[EDialogDetails.disabled] === 'Y'}
                                onChange={(e: { value: any; }) => handleChange(EDialogDetails.disabled, e.value ? 'Y' : 'N')}
                            />

                            <InputCheckbox
                                id="required"
                                label="Required (Y/N)"
                                defaultValue={selectedField[EDialogDetails.required] === 'Y'}
                                onChange={(e: { value: any; }) => handleChange(EDialogDetails.required, e.value ? 'Y' : 'N')}
                            />

                            <InputCheckbox
                                id="key"
                                label="Key Field (Y/N)"
                                defaultValue={selectedField[EDialogDetails.key] === 'Y'}
                                onChange={(e: { value: any; }) => handleChange(EDialogDetails.key, e.value ? 'Y' : 'N')}
                            />
                        </PropertySection>

                        {/* Validation & Rules */}
                        {!isDataComponent && (
                            <PropertySection>
                                <SectionTitle variant="caption">Validation</SectionTitle>

                                <Input
                                    id="input-rules"
                                    label="Rules"
                                    value={selectedField[EDialogDetails.rules] || ''}
                                    onChange={(e) => handleChange(EDialogDetails.rules, e.target.value)}
                                    fullWidth
                                    variant="standard"
                                />

                                <Input
                                    id="input-rules-values"
                                    label="Rules Values (ID)"
                                    value={selectedField[EDialogDetails.rulesValues] || ''}
                                    onChange={(e) => handleChange(EDialogDetails.rulesValues, e.target.value)}
                                    fullWidth
                                    variant="standard"
                                    helperText="For enum/lookup: enter the ID"
                                />

                                <Input
                                    id="input-default"
                                    label="Default Value"
                                    value={selectedField[EDialogDetails.default] || ''}
                                    onChange={(e) => handleChange(EDialogDetails.default, e.target.value)}
                                    fullWidth
                                    variant="standard"
                                />
                            </PropertySection>
                        )}

                        {/* Data Component Properties */}
                        {isDataComponent && (
                            <PropertySection>
                                <SectionTitle variant="caption">Data Component</SectionTitle>

                                <Input
                                    id="input-component-id"
                                    label="Component ID"
                                    type="number"
                                    value={selectedField[EDialogDetails.componentID] || ''}
                                    onChange={(e) => handleChange(EDialogDetails.componentID, parseInt(e.target.value))}
                                    fullWidth
                                    variant="standard"
                                    helperText="Table/Tree/List/Grid ID"
                                />
                            </PropertySection>
                        )}
                    </>
                )}

                {/* Parameters Tab */}
                {activeFieldTab === 'parameters' && (
                    <>
                        <PropertySection>
                            <Div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                <SectionTitle variant="caption">Field Parameters</SectionTitle>
                                <Button
                                    startIcon={LYAddIcon}
                                    onClick={() => {
                                        const newParam: IFieldParameter = {
                                            flt_id: (selectedField.parameters?.length || 0) + 1,
                                            flt_type: '',
                                            flt_source: '',
                                            flt_target: null,
                                            flt_value: null,
                                        };
                                        const newIndex = selectedField.parameters?.length || 0;
                                        handleChange('parameters', [...(selectedField.parameters || []), newParam]);
                                        // Open edit dialog immediately
                                        setTimeout(() => {
                                            setEditingParameter({ index: newIndex, param: { ...newParam } });
                                        }, 0);
                                    }}
                                >
                                    Add Parameter
                                </Button>
                            </Div>

                            {(!selectedField.parameters || selectedField.parameters.length === 0) ? (
                                <Div style={{ padding: '16px', textAlign: 'center', color: '#666' }}>
                                    <Typography variant="body2">No parameters defined</Typography>
                                </Div>
                            ) : (
                                <ParameterList>
                                    {selectedField.parameters.map((param, index) => (
                                        <ParameterItem key={index}>
                                            <ParameterInfo>
                                                <Typography variant="body2" fontWeight={500}>
                                                    {param.flt_type || '(No Type)'}: {param.flt_source || '(No Source)'}
                                                </Typography>
                                                <Typography variant="caption" color="textSecondary">
                                                    Target: {param.flt_target || 'N/A'} | Value: {param.flt_value || 'N/A'}
                                                </Typography>
                                            </ParameterInfo>
                                            <ParameterActions>
                                                <IconButton
                                                    size={LYIconSize.small}
                                                    onClick={() => {
                                                        setEditingParameter({ index, param: { ...param } });
                                                    }}
                                                    icon={LYEditIcon}
                                                    aria-label="Edit parameter"
                                                />
                                                <IconButton
                                                    size={LYIconSize.small}
                                                    color="error"
                                                    onClick={() => {
                                                        const newParams = selectedField.parameters!.filter((_, i) => i !== index);
                                                        handleChange('parameters', newParams);
                                                    }}
                                                    icon={LYDeleteIcon}
                                                    aria-label="Delete parameter"
                                                />
                                            </ParameterActions>
                                        </ParameterItem>
                                    ))}
                                </ParameterList>
                            )}
                        </PropertySection>

                        <PropertySection>
                            <SectionTitle variant="caption">Legacy String Parameters (Read-only)</SectionTitle>
                            
                            <Input
                                id="input-dynamic-params"
                                label="Dynamic Params"
                                value={selectedField[EDialogDetails.dynamic_params] || ''}
                                fullWidth
                                multiline
                                rows={2}
                                variant="standard"
                                disabled
                                helperText="Deprecated: Use parameter list above"
                            />

                            <Input
                                id="input-fixed-params"
                                label="Fixed Params"
                                value={selectedField[EDialogDetails.fixed_params] || ''}
                                fullWidth
                                multiline
                                rows={2}
                                variant="standard"
                                disabled
                                helperText="Deprecated: Use parameter list above"
                            />
                        </PropertySection>
                    </>
                )}

                {/* Conditions Tab */}
                {activeFieldTab === 'conditions' && (
                    <>
                        <PropertySection>
                            <SectionTitle variant="caption">Display Condition</SectionTitle>

                            <Input
                                id="input-condition-id"
                                label="Display condition"
                                type="number"
                                value={selectedField[EDialogDetails.cdn_id] || ''}
                                onChange={(e) => handleChange(EDialogDetails.cdn_id, e.target.value ? parseInt(e.target.value) : null)}
                                fullWidth
                                variant="standard"
                            />
                        </PropertySection>

                        <PropertySection>
                            <Div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                <SectionTitle variant="caption">Condition Parameters</SectionTitle>
                                <Button
                                    startIcon={LYAddIcon}
                                    onClick={() => {
                                        const newParam: IFieldConditionParameter = {
                                            cdn_id: (selectedField.conditionParameters?.length || 0) + 1,
                                            cdn_type: '',
                                            cdn_source: '',
                                            cdn_target: null,
                                            cdn_value: null,
                                        };
                                        const newIndex = selectedField.conditionParameters?.length || 0;
                                        handleChange('conditionParameters', [...(selectedField.conditionParameters || []), newParam]);
                                        // Open edit dialog immediately
                                        setTimeout(() => {
                                            setEditingConditionParameter({ index: newIndex, param: { ...newParam } });
                                        }, 0);
                                    }}
                                >
                                    Add Parameter
                                </Button>
                            </Div>

                            {(!selectedField.conditionParameters || selectedField.conditionParameters.length === 0) ? (
                                <Div style={{ padding: '16px', textAlign: 'center', color: '#666' }}>
                                    <Typography variant="body2">No condition parameters defined</Typography>
                                </Div>
                            ) : (
                                <ParameterList>
                                    {selectedField.conditionParameters.map((param, index) => (
                                        <ParameterItem key={index}>
                                            <ParameterInfo>
                                                <Typography variant="body2" fontWeight={500}>
                                                    {param.cdn_type || '(No Type)'}: {param.cdn_source || '(No Source)'}
                                                </Typography>
                                                <Typography variant="caption" color="textSecondary">
                                                    Target: {param.cdn_target || 'N/A'} | Value: {param.cdn_value || 'N/A'}
                                                </Typography>
                                            </ParameterInfo>
                                            <ParameterActions>
                                                <IconButton
                                                    size={LYIconSize.small}
                                                    onClick={() => {
                                                        setEditingConditionParameter({ index, param: { ...param } });
                                                    }}
                                                    icon={LYEditIcon}
                                                    aria-label="Edit condition parameter"
                                                />
                                                <IconButton
                                                    size={LYIconSize.small}
                                                    color="error"
                                                    onClick={() => {
                                                        const newParams = selectedField.conditionParameters!.filter((_, i) => i !== index);
                                                        handleChange('conditionParameters', newParams);
                                                    }}
                                                    icon={LYDeleteIcon}
                                                    aria-label="Delete condition parameter"
                                                />
                                            </ParameterActions>
                                        </ParameterItem>
                                    ))}
                                </ParameterList>
                            )}
                        </PropertySection>

                        <PropertySection>
                            <SectionTitle variant="caption">Legacy String Parameters (Read-only)</SectionTitle>

                            <Input
                                id="input-condition-dynamic-params"
                                label="Condition Dynamic Params"
                                value={selectedField[EDialogDetails.cdn_dynamic_params] || ''}
                                fullWidth
                                multiline
                                rows={2}
                                variant="standard"
                                disabled
                                helperText="Deprecated: Use parameter list above"
                            />

                            <Input
                                id="input-condition-fixed-params"
                                label="Condition Fixed Params"
                                value={selectedField[EDialogDetails.cdn_fixed_params] || ''}
                                fullWidth
                                multiline
                                rows={2}
                                variant="standard"
                                disabled
                                helperText="Deprecated: Use parameter list above"
                            />
                        </PropertySection>
                    </>
                )}
            </Div>

            {/* Parameter Edit Dialog */}
            <Dialog open={!!editingParameter} onClose={() => setEditingParameter(null)}>
                <Div style={{ padding: '24px', minWidth: '400px' }}>
                    <Typography variant="h6" style={{ marginBottom: '16px' }}>
                        Edit Parameter
                    </Typography>

                    <InputEnum
                        id="param-type"
                        enumID={7}
                        label="Type"
                        disabled={false}
                        freeSolo={false}
                        searchByLabel={false}
                        defaultValue={editingParameter?.param.flt_type || ''}
                        onChange={(params) => {
                            if (editingParameter) {
                                setEditingParameter({
                                    ...editingParameter,
                                    param: {
                                        ...editingParameter.param,
                                        flt_type: params.value?.toString() || '',
                                    },
                                });
                            }
                        }}
                        variant="standard"
                    />

                    {editingParameter?.param.flt_type === 'VALUE' && (
                        <>
                            <Input
                                id="param-target"
                                label="Target"
                                value={editingParameter.param.flt_target || ''}
                                onChange={(e) => {
                                    setEditingParameter({
                                        ...editingParameter,
                                        param: {
                                            ...editingParameter.param,
                                            flt_target: e.target.value,
                                        },
                                    });
                                }}
                                fullWidth
                                variant="standard"
                                style={{ marginTop: '16px' }}
                            />
                            <Input
                                id="param-value"
                                label="Value"
                                value={editingParameter.param.flt_value || ''}
                                onChange={(e) => {
                                    setEditingParameter({
                                        ...editingParameter,
                                        param: {
                                            ...editingParameter.param,
                                            flt_value: e.target.value,
                                        },
                                    });
                                }}
                                fullWidth
                                variant="standard"
                                style={{ marginTop: '16px' }}
                            />
                        </>
                    )}

                    {editingParameter?.param.flt_type === 'POOL' && (
                        <Input
                            id="param-source"
                            label="Source"
                            value={editingParameter.param.flt_source || ''}
                            onChange={(e) => {
                                setEditingParameter({
                                    ...editingParameter,
                                    param: {
                                        ...editingParameter.param,
                                        flt_source: e.target.value,
                                    },
                                });
                            }}
                            fullWidth
                            variant="standard"
                            style={{ marginTop: '16px' }}
                        />
                    )}

                    {editingParameter?.param.flt_type && 
                     editingParameter.param.flt_type !== 'VALUE' && 
                     editingParameter.param.flt_type !== 'POOL' && (
                        <>
                            <Input
                                id="param-source"
                                label="Source"
                                value={editingParameter.param.flt_source || ''}
                                onChange={(e) => {
                                    setEditingParameter({
                                        ...editingParameter,
                                        param: {
                                            ...editingParameter.param,
                                            flt_source: e.target.value,
                                        },
                                    });
                                }}
                                fullWidth
                                variant="standard"
                                style={{ marginTop: '16px' }}
                            />
                            <Input
                                id="param-target"
                                label="Target"
                                value={editingParameter.param.flt_target || ''}
                                onChange={(e) => {
                                    setEditingParameter({
                                        ...editingParameter,
                                        param: {
                                            ...editingParameter.param,
                                            flt_target: e.target.value,
                                        },
                                    });
                                }}
                                fullWidth
                                variant="standard"
                                style={{ marginTop: '16px' }}
                            />
                        </>
                    )}

                    <Div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '24px' }}>
                        <Button variant="outlined" onClick={() => setEditingParameter(null)}>
                            Cancel
                        </Button>
                        <Button variant="contained" onClick={handleSaveParameter}>
                            Save
                        </Button>
                    </Div>
                </Div>
            </Dialog>

            {/* Condition Parameter Edit Dialog */}
            <Dialog open={!!editingConditionParameter} onClose={() => setEditingConditionParameter(null)}>
                <Div style={{ padding: '24px', minWidth: '400px' }}>
                    <Typography variant="h6" style={{ marginBottom: '16px' }}>
                        Edit Condition Parameter
                    </Typography>

                    <InputEnum
                        id="cdn-param-type"
                        enumID={7}
                        label="Type"
                        disabled={false}
                        freeSolo={false}
                        searchByLabel={false}
                        defaultValue={editingConditionParameter?.param.cdn_type || ''}
                        onChange={(params) => {
                            if (editingConditionParameter) {
                                setEditingConditionParameter({
                                    ...editingConditionParameter,
                                    param: {
                                        ...editingConditionParameter.param,
                                        cdn_type: params.value?.toString() || '',
                                    },
                                });
                            }
                        }}
                        variant="standard"
                    />

                    {editingConditionParameter?.param.cdn_type === 'VALUE' && (
                        <>
                            <Input
                                id="cdn-param-target"
                                label="Target"
                                value={editingConditionParameter.param.cdn_target || ''}
                                onChange={(e) => {
                                    setEditingConditionParameter({
                                        ...editingConditionParameter,
                                        param: {
                                            ...editingConditionParameter.param,
                                            cdn_target: e.target.value,
                                        },
                                    });
                                }}
                                fullWidth
                                variant="standard"
                                style={{ marginTop: '16px' }}
                            />
                            <Input
                                id="cdn-param-value"
                                label="Value"
                                value={editingConditionParameter.param.cdn_value || ''}
                                onChange={(e) => {
                                    setEditingConditionParameter({
                                        ...editingConditionParameter,
                                        param: {
                                            ...editingConditionParameter.param,
                                            cdn_value: e.target.value,
                                        },
                                    });
                                }}
                                fullWidth
                                variant="standard"
                                style={{ marginTop: '16px' }}
                            />
                        </>
                    )}

                    {editingConditionParameter?.param.cdn_type === 'POOL' && (
                        <Input
                            id="cdn-param-source"
                            label="Source"
                            value={editingConditionParameter.param.cdn_source || ''}
                            onChange={(e) => {
                                setEditingConditionParameter({
                                    ...editingConditionParameter,
                                    param: {
                                        ...editingConditionParameter.param,
                                        cdn_source: e.target.value,
                                    },
                                });
                            }}
                            fullWidth
                            variant="standard"
                            style={{ marginTop: '16px' }}
                        />
                    )}

                    {editingConditionParameter?.param.cdn_type && 
                     editingConditionParameter.param.cdn_type !== 'VALUE' && 
                     editingConditionParameter.param.cdn_type !== 'POOL' && (
                        <>
                            <Input
                                id="cdn-param-source"
                                label="Source"
                                value={editingConditionParameter.param.cdn_source || ''}
                                onChange={(e) => {
                                    setEditingConditionParameter({
                                        ...editingConditionParameter,
                                        param: {
                                            ...editingConditionParameter.param,
                                            cdn_source: e.target.value,
                                        },
                                    });
                                }}
                                fullWidth
                                variant="standard"
                                style={{ marginTop: '16px' }}
                            />
                            <Input
                                id="cdn-param-target"
                                label="Target"
                                value={editingConditionParameter.param.cdn_target || ''}
                                onChange={(e) => {
                                    setEditingConditionParameter({
                                        ...editingConditionParameter,
                                        param: {
                                            ...editingConditionParameter.param,
                                            cdn_target: e.target.value,
                                        },
                                    });
                                }}
                                fullWidth
                                variant="standard"
                                style={{ marginTop: '16px' }}
                            />
                        </>
                    )}

                    <Div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '24px' }}>
                        <Button variant="outlined" onClick={() => setEditingConditionParameter(null)}>
                            Cancel
                        </Button>
                        <Button variant="contained" onClick={handleSaveConditionParameter}>
                            Save
                        </Button>
                    </Div>
                </Div>
            </Dialog>
        </PropertyContainer>
    );
};
