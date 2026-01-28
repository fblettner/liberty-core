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
import { IBuilderField, IBuilderTab, IFieldParameter, IFieldConditionParameter } from '@ly_forms/FormsDialogBuilder/types/builderTypes';
import { EDialogDetails } from '@ly_types/lyDialogs';
import { Divider } from '@ly_common/Divider';
import { Button } from '@ly_common/Button';
import { Tabs } from '@ly_common/Tabs';
import { Tab } from '@ly_common/Tab';
import { IconButton } from '@ly_common/IconButton';
import { Dialog } from '@ly_common/Dialog';
import { LYAddIcon, LYDeleteIcon, LYEditIcon } from '@ly_styles/icons';
import { LYIconSize } from '@ly_utils/commonUtils';
import { GridFlexContainer, GridItem } from '@ly_common/Grid';

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
                </Div>
                <Divider />
                <GridFlexContainer key={'tab-properties-grid'} spacing={2} px={0} py={2}
                    flexDirection='row'>
                    <GridItem
                        style={{ flexGrow: 0 }}
                        size={12}
                        key="tab-properties-order">
                        <Input
                            id="tab-order"
                            label="Tab Order"
                            type="number"
                            value={selectedTab.sequence || 1}
                            onChange={(e) => handleTabChange('sequence', parseInt(e.target.value))}
                            fullWidth
                            variant="standard"
                        />
                    </GridItem>
                    <GridItem
                        style={{ flexGrow: 0 }}
                        size={12}
                        key="tab-properties-description">
                        <Input
                            id="tab-description"
                            label="Description"
                            value={selectedTab.label || ''}
                            onChange={(e) => handleTabChange('label', e.target.value)}
                            fullWidth
                            variant="standard"
                        />
                    </GridItem>
                    <GridItem
                        style={{ flexGrow: 0 }}
                        size={12}
                        key="tab-properties-cols">
                        <Input
                            id="tab-cols"
                            label="Columns to display"
                            type="number"
                            value={selectedTab.cols || 1}
                            onChange={(e) => handleTabChange('cols', parseInt(e.target.value))}
                            fullWidth
                            variant="standard"
                        />
                    </GridItem>
                    <GridItem
                        style={{ flexGrow: 0 }}
                        size={12}
                        key="tab-properties-condition">
                        <Input
                            id="tab-condition"
                            label="Display condition"
                            type="number"
                            value={selectedTab.condition || ''}
                            onChange={(e) => handleTabChange('condition', e.target.value ? parseInt(e.target.value) : undefined)}
                            fullWidth
                            variant="standard"
                        />
                    </GridItem>
                    <GridItem
                        style={{ flexGrow: 0 }}
                        size={6}
                        key="tab-properties-disable-add">
                        <InputCheckbox
                            id="tab-disable-add"
                            label="Disable on Add (Y/N)"
                            defaultValue={selectedTab.disable_add || false}
                            onChange={(e: { value: any; }) => handleTabChange('disable_add', e.value)}
                        />
                    </GridItem>
                    <GridItem
                        style={{ flexGrow: 0 }}
                        size={6}
                        key="tab-properties-disable-edit">
                        <InputCheckbox
                            id="tab-disable-edit"
                            label="Disable on Edit (Y/N)"
                            defaultValue={selectedTab.disable_edit || false}
                            onChange={(e: { value: any; }) => handleTabChange('disable_edit', e.value)}
                        />
                    </GridItem>
                </GridFlexContainer>
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
                <GridFlexContainer key={'dialog-properties-grid'} spacing={2} px={0} py={2}
                    flexDirection='row'>
                    <GridItem
                        style={{ flexGrow: 0 }}
                        size={12}
                        key="dialog-properties-label">
                        <Input
                            id="dialog-label"
                            label="Dialog Label"
                            value={dialogLabel}
                            onChange={(e) => onDialogHeaderUpdate('dialogLabel', e.target.value)}
                            fullWidth
                            variant="standard"
                        />
                    </GridItem>
                    <GridItem
                        style={{ flexGrow: 0 }}
                        size={12}
                        key="dialog-properties-id">
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
                    </GridItem>
                    <GridItem
                        style={{ flexGrow: 0 }}
                        size={12}
                        key="dialog-properties-query">
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
                    </GridItem>
                </GridFlexContainer>
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
            </Div>
            <Divider />

            <Tabs value={activeFieldTab} onChange={(e, newValue) => setActiveFieldTab(newValue)}>
                <Tab id="tab-properties" label="Properties" value="properties" />
                <Tab id="tab-parameters" label="Parameters" value="parameters" />
                <Tab id="tab-conditions" label="Conditions" value="conditions" />
            </Tabs>

            <Div>
                {/* Properties Tab */}
                {activeFieldTab === 'properties' && (
                    <GridFlexContainer key={'field-properties-grid'} spacing={2} px={0} py={0}
                        flexDirection='row'>
                        <GridItem
                            style={{ flexGrow: 0 }}
                            size={12}
                            key="field-properties-id">
                            <Input
                                id="input-field"
                                label="Field ID"
                                value={selectedField[EDialogDetails.id] || ''}
                                onChange={(e) => handleChange(EDialogDetails.id, e.target.value)}
                                fullWidth
                                variant="standard"
                            />
                        </GridItem>
                        <GridItem
                            style={{ flexGrow: 0 }}
                            size={12}
                            key="field-properties-sequence">
                            <Input
                                id="input-sequence"
                                label="Field Order"
                                type="number"
                                value={selectedField[EDialogDetails.sequence] || 0}
                                onChange={(e) => handleChange(EDialogDetails.sequence, parseInt(e.target.value))}
                                fullWidth
                                variant="standard"
                            />
                        </GridItem>
                        <GridItem
                            style={{ flexGrow: 0 }}
                            size={12}
                            key="field-properties-label">
                            <Input
                                id="input-label"
                                label="Description"
                                value={selectedField[EDialogDetails.label] || ''}
                                onChange={(e) => handleChange(EDialogDetails.label, e.target.value)}
                                fullWidth
                                variant="standard"
                            />
                        </GridItem>
                        <GridItem
                            style={{ flexGrow: 0 }}
                            size={12}
                            key="field-properties-dictionary">
                            <Input
                                id="input-dd"
                                label="Dictionary ID"
                                value={selectedField[EDialogDetails.dictionaryID] || ''}
                                onChange={(e) => handleChange(EDialogDetails.dictionaryID, e.target.value)}
                                fullWidth
                                variant="standard"
                                helperText="Column dictionary (use custom value to override)"
                            />
                        </GridItem>
                        <GridItem
                            style={{ flexGrow: 0 }}
                            size={12}
                            key="field-properties-target">
                            <Input
                                id="input-target"
                                label="Target Field"
                                value={selectedField[EDialogDetails.target] || ''}
                                onChange={(e) => handleChange(EDialogDetails.target, e.target.value)}
                                fullWidth
                                variant="standard"
                            />
                        </GridItem>
                        <GridItem
                            style={{ flexGrow: 0 }}
                            size={12}
                            key="field-properties-tab">
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
                        </GridItem>
                        <GridItem
                            style={{ flexGrow: 0 }}
                            size={12}
                            key="field-properties-colspan">
                            <Input
                                id="input-colspan"
                                label="Columns to display"
                                type="number"
                                value={selectedField[EDialogDetails.colspan] || 1}
                                onChange={(e) => handleChange(EDialogDetails.colspan, parseInt(e.target.value))}
                                fullWidth
                                variant="standard"
                            />
                        </GridItem>
                        <GridItem
                            style={{ flexGrow: 0 }}
                            size={12}
                            key="field-properties-behavior">
                            <SectionTitle variant="caption">Behavior</SectionTitle>
                        </GridItem>
                        <GridItem
                            style={{ flexGrow: 0 }}
                            size={6}
                            key="field-properties-visible">
                            <InputCheckbox
                                id="visible"
                                label="Visible (Y/N)"
                                defaultValue={selectedField[EDialogDetails.visible] === 'Y'}
                                onChange={(e: { value: any; }) => handleChange(EDialogDetails.visible, e.value ? 'Y' : 'N')}
                            />
                        </GridItem>
                        <GridItem
                            style={{ flexGrow: 0 }}
                            size={6}
                            key="field-properties-disabled">
                            <InputCheckbox
                                id="disabled"
                                label="Disabled (Y/N)"
                                defaultValue={selectedField[EDialogDetails.disabled] === 'Y'}
                                onChange={(e: { value: any; }) => handleChange(EDialogDetails.disabled, e.value ? 'Y' : 'N')}
                            />
                        </GridItem>
                        <GridItem
                            style={{ flexGrow: 0 }}
                            size={6}
                            key="field-properties-required">
                            <InputCheckbox
                                id="required"
                                label="Required (Y/N)"
                                defaultValue={selectedField[EDialogDetails.required] === 'Y'}
                                onChange={(e: { value: any; }) => handleChange(EDialogDetails.required, e.value ? 'Y' : 'N')}
                            />
                        </GridItem>
                        <GridItem
                            style={{ flexGrow: 0 }}
                            size={6}
                            key="field-properties-key">
                            <InputCheckbox
                                id="key"
                                label="Key Field (Y/N)"
                                defaultValue={selectedField[EDialogDetails.key] === 'Y'}
                                onChange={(e: { value: any; }) => handleChange(EDialogDetails.key, e.value ? 'Y' : 'N')}
                            />
                        </GridItem>
                        {!isDataComponent && (
                            <>
                                <GridItem
                                    style={{ flexGrow: 0 }}
                                    size={12}
                                    key="field-properties-rules">
                                    <Input
                                        id="input-rules"
                                        label="Rules"
                                        value={selectedField[EDialogDetails.rules] || ''}
                                        onChange={(e) => handleChange(EDialogDetails.rules, e.target.value)}
                                        fullWidth
                                        variant="standard"
                                    />
                                </GridItem>
                                <GridItem
                                    style={{ flexGrow: 0 }}
                                    size={12}
                                    key="field-properties-rules-values">
                                    <Input
                                        id="input-rules-values"
                                        label="Rules Values (ID)"
                                        value={selectedField[EDialogDetails.rulesValues] || ''}
                                        onChange={(e) => handleChange(EDialogDetails.rulesValues, e.target.value)}
                                        fullWidth
                                        variant="standard"
                                        helperText="For enum/lookup: enter the ID"
                                    />
                                </GridItem>
                                <GridItem
                                    style={{ flexGrow: 0 }}
                                    size={12}
                                    key="field-properties-default">
                                    <Input
                                        id="input-default"
                                        label="Default Value"
                                        value={selectedField[EDialogDetails.default] || ''}
                                        onChange={(e) => handleChange(EDialogDetails.default, e.target.value)}
                                        fullWidth
                                        variant="standard"
                                    />
                                </GridItem>
                            </>
                        )}
                        {isDataComponent && (
                            <>
                                <GridItem
                                    style={{ flexGrow: 0 }}
                                    size={12}
                                    key="field-properties-data-component">
                                    <SectionTitle variant="caption">Data Component</SectionTitle>
                                </GridItem>
                                <GridItem
                                    style={{ flexGrow: 0 }}
                                    size={12}
                                    key="field-properties-component-id">
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
                                </GridItem>
                            </>
                        )}
                    </GridFlexContainer>
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
