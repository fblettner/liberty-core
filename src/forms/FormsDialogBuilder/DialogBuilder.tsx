/*
 * Copyright (c) 2025 NOMANA-IT and/or its affiliates.
 * All rights reserved. Use is subject to license terms.
 */

import React, { useState, useCallback } from 'react';
import styled from '@emotion/styled';
import { v4 as uuidv4 } from 'uuid';
import { ComponentPalette } from './components/ComponentPalette';
import { BuilderCanvas } from './components/BuilderCanvas';
import { PropertyPanel } from './components/PropertyPanel';
import { IBuilderState, IBuilderField, IBuilderTab, ComponentFieldType } from './types/builderTypes';
import { PALETTE_COMPONENTS } from './config/paletteConfig';
import { EDialogDetails } from '@ly_types/lyDialogs';
import { Tabs } from '@ly_common/Tabs';
import { Tab } from '@ly_common/Tab';
import { Button } from '@ly_common/Button';
import { Div } from '@ly_styles/Div';
import { Typography } from '@ly_common/Typography';
import { LYAddIcon, LYCancelIcon, LYSaveIcon, LYSettingsIcon } from '@ly_styles/icons';
import { IconButton } from '@ly_common/IconButton';
import { AdvancedFlexPanels } from '@ly_common/FlexAdvanced';
import { EStandardColor } from '@ly_utils/commonUtils';
import { t } from 'i18next';
import { OnCancelFunction } from '@ly_forms/FormsDialog/utils/commonUtils';
import { ConfirmationDialog } from '@ly_common/ConfirmationDialog';
import { LYComponentEvent } from '@ly_types/lyComponents';

const BuilderContainer = styled(Div)({
    height: '100%',
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
});

const PanelWrapper = styled(Div)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    overflow: 'hidden',
    boxSizing: 'border-box',
    flex: '1 1 0px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    borderRadius: '12px',
    transition: 'transform 0.3s ease',
    border: `1px solid ${theme.palette.divider}`,
    backgroundColor: theme.palette.background.paper,
}));

const MainArea = styled(Div)({
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
});

const Toolbar = styled(Div)(({ theme }) => ({
    padding: '16px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: `1px solid ${theme.palette.divider}`,
    backgroundColor: theme.palette.background.paper,
}));

const ToolbarLeft = styled(Div)({
    display: 'flex',
    gap: '16px',
    alignItems: 'center',
});

const TabsContainer = styled(Div)(({ theme }) => ({
    borderBottom: `1px solid ${theme.palette.divider}`,
    padding: '0 16px',
    backgroundColor: theme.palette.background.paper,
}));

interface IDialogBuilderProps {
    frmID?: number;
    onCancel: OnCancelFunction;
    onSave: (state: IBuilderState) => Promise<void>;
    onPreview: (state: IBuilderState) => void;
    initialState?: IBuilderState;
}

export const DialogBuilder: React.FC<IDialogBuilderProps> = ({
    frmID,
    onCancel,
    onSave,
    onPreview,
    initialState,
}) => {

    const [builderState, setBuilderState] = useState<IBuilderState>(
        initialState || {
            dialogID: frmID || null,
            dialogLabel: 'New Dialog',
            queryPool: 'DEFAULT',
            queryID: 0,
            tabs: [
                {
                    id: uuidv4(),
                    label: 'Tab 1',
                    sequence: 1,
                    cols: 2,
                    fields: [],
                },
            ],
            activeTab: '',
            selectedField: null,
            selectedTab: null,
            isDirty: false,
        }
    );

    const [showHeaderProperties, setShowHeaderProperties] = useState(false);
    const [draggedTab, setDraggedTab] = useState<string | null>(null);
    const [openSaveDialog, setOpenSaveDialog] = useState(false);

    // Initialize active tab
    React.useEffect(() => {
        if (!builderState.activeTab && builderState.tabs.length > 0) {
            setBuilderState((prev) => ({
                ...prev,
                activeTab: prev.tabs[0].id,
            }));
        }
    }, [builderState.activeTab, builderState.tabs]);

    const handleFieldAdd = useCallback((fieldType: ComponentFieldType, tabID: string) => {
        const paletteComponent = PALETTE_COMPONENTS.find((c) => c.type === fieldType);
        if (!paletteComponent) return;

        setBuilderState((prev) => {
            const tabs = prev.tabs.map((tab) => {
                if (tab.id !== tabID) return tab;

                const newField: IBuilderField = {
                    builderID: uuidv4(),
                    [EDialogDetails.id]: '',
                    [EDialogDetails.tab_sequence]: tab.sequence.toString(),
                    [EDialogDetails.sequence]: tab.fields.length + 1,
                    [EDialogDetails.language]: 'EN',
                    [EDialogDetails.label]: `New ${paletteComponent.label}`,
                    [EDialogDetails.dictionaryID]: '',
                    [EDialogDetails.component]: paletteComponent.defaultConfig[EDialogDetails.component] || 'DD',
                    [EDialogDetails.componentID]: 0,
                    [EDialogDetails.type]: paletteComponent.defaultConfig[EDialogDetails.type] || '',
                    [EDialogDetails.rules]: paletteComponent.defaultConfig[EDialogDetails.rules] || '',
                    [EDialogDetails.rulesValues]: '',
                    [EDialogDetails.default]: '',
                    [EDialogDetails.target]: '',
                    [EDialogDetails.visible]: paletteComponent.defaultConfig[EDialogDetails.visible] as string || 'Y',
                    [EDialogDetails.disabled]: paletteComponent.defaultConfig[EDialogDetails.disabled] as string || 'N',
                    [EDialogDetails.required]: paletteComponent.defaultConfig[EDialogDetails.required] as string || 'N',
                    [EDialogDetails.key]: paletteComponent.defaultConfig[EDialogDetails.key] as string || 'N',
                    [EDialogDetails.colspan]: paletteComponent.defaultConfig[EDialogDetails.colspan] as number || 1,
                    [EDialogDetails.dynamic_params]: '',
                    [EDialogDetails.fixed_params]: '',
                    [EDialogDetails.pool_params]: '',
                    [EDialogDetails.output_params]: '',
                    [EDialogDetails.cdn_id]: 0,
                    [EDialogDetails.cdn_dynamic_params]: '',
                    [EDialogDetails.cdn_fixed_params]: '',
                    isSelected: false,
                };

                return {
                    ...tab,
                    fields: [...tab.fields, newField],
                };
            });

            return { ...prev, tabs, isDirty: true };
        });
    }, []);

    const handleFieldSelect = useCallback((field: IBuilderField) => {
        setShowHeaderProperties(false);
        setBuilderState((prev) => ({
            ...prev,
            selectedField: field,
            selectedTab: null,
            tabs: prev.tabs.map((tab) => ({
                ...tab,
                fields: tab.fields.map((f) => ({
                    ...f,
                    isSelected: f.builderID === field.builderID,
                })),
            })),
        }));
    }, []);

    const handleFieldUpdate = useCallback((updatedField: IBuilderField) => {
        setBuilderState((prev) => ({
            ...prev,
            tabs: prev.tabs.map((tab) => ({
                ...tab,
                fields: tab.fields.map((f) =>
                    f.builderID === updatedField.builderID ? updatedField : f
                ),
            })),
            selectedField: updatedField,
            isDirty: true,
        }));
    }, []);

    const handleFieldDelete = useCallback((fieldID: string, tabID: string) => {
        setBuilderState((prev) => ({
            ...prev,
            tabs: prev.tabs.map((tab) => {
                if (tab.id !== tabID) return tab;
                return {
                    ...tab,
                    fields: tab.fields
                        .filter((f) => f.builderID !== fieldID)
                        .map((f, index) => ({ ...f, [EDialogDetails.sequence]: index + 1 })),
                };
            }),
            selectedField: prev.selectedField?.builderID === fieldID ? null : prev.selectedField,
            isDirty: true,
        }));
    }, []);

    const handleFieldMove = useCallback((tabID: string, dragIndex: number, hoverIndex: number) => {
        setBuilderState((prev) => ({
            ...prev,
            tabs: prev.tabs.map((tab) => {
                if (tab.id !== tabID) return tab;

                const fields = [...tab.fields];
                const dragField = fields.find((f) => f[EDialogDetails.sequence] === dragIndex);
                const hoverField = fields.find((f) => f[EDialogDetails.sequence] === hoverIndex);

                if (dragField && hoverField) {
                    dragField[EDialogDetails.sequence] = hoverIndex;
                    hoverField[EDialogDetails.sequence] = dragIndex;
                }

                return { ...tab, fields };
            }),
            isDirty: true,
        }));
    }, []);

    const handleFieldMoveToTab = useCallback((field: IBuilderField, newTabID: string) => {
        setBuilderState((prev) => {
            let fieldToMove: IBuilderField | null = null;
            let sourceTabID: string | null = null;

            // Find the field and its current tab
            prev.tabs.forEach((tab) => {
                const found = tab.fields.find((f) => f.builderID === field.builderID);
                if (found) {
                    fieldToMove = found;
                    sourceTabID = tab.id;
                }
            });

            if (!fieldToMove || !sourceTabID || sourceTabID === newTabID) {
                return prev;
            }

            return {
                ...prev,
                tabs: prev.tabs.map((tab) => {
                    // Remove from source tab
                    if (tab.id === sourceTabID) {
                        return {
                            ...tab,
                            fields: tab.fields
                                .filter((f) => f.builderID !== field.builderID)
                                .map((f, index) => ({ ...f, [EDialogDetails.sequence]: index + 1 })),
                        };
                    }
                    // Add to target tab
                    if (tab.id === newTabID) {
                        const newSequence = tab.fields.length + 1;
                        return {
                            ...tab,
                            fields: [...tab.fields, { ...fieldToMove!, [EDialogDetails.sequence]: newSequence }],
                        };
                    }
                    return tab;
                }),
                isDirty: true,
            };
        });
    }, []);

    const handleTabChange = useCallback((event: React.SyntheticEvent, newValue: string) => {
        const selectedTab = builderState.tabs.find(tab => tab.id === newValue);
        setBuilderState((prev) => ({
            ...prev,
            activeTab: newValue,
            selectedTab: selectedTab || null,
            selectedField: null,
            tabs: prev.tabs.map((t) => ({
                ...t,
                fields: t.fields.map((f) => ({
                    ...f,
                    isSelected: false,
                })),
            })),
        }));
        setShowHeaderProperties(false);
    }, [builderState.tabs]);

    const handleAddTab = useCallback(() => {
        const newTab: IBuilderTab = {
            id: uuidv4(),
            label: `Tab ${builderState.tabs.length + 1}`,
            sequence: builderState.tabs.length + 1,
            cols: 2,
            fields: [],
        };

        setBuilderState((prev) => ({
            ...prev,
            tabs: [...prev.tabs, newTab],
            activeTab: newTab.id,
            isDirty: true,
        }));
    }, [builderState.tabs.length]);
    const handleDialogHeaderUpdate = useCallback((key: 'dialogID' | 'dialogLabel' | 'queryID', value: any) => {
        setBuilderState((prev) => ({
            ...prev,
            [key]: value,
            isDirty: true,
        }));
    }, []);

    const handleShowHeaderProperties = useCallback(() => {
        setShowHeaderProperties(true);
        setBuilderState((prev) => ({
            ...prev,
            selectedField: null,
            selectedTab: null,
            tabs: prev.tabs.map((tab) => ({
                ...tab,
                fields: tab.fields.map((f) => ({
                    ...f,
                    isSelected: false,
                })),
            })),
        }));
    }, []);

    const handleTabUpdate = useCallback((updatedTab: IBuilderTab) => {
        setBuilderState((prev) => ({
            ...prev,
            tabs: prev.tabs.map((tab) =>
                tab.id === updatedTab.id ? updatedTab : tab
            ),
            selectedTab: updatedTab,
            isDirty: true,
        }));
    }, []);

    const handleTabDragStart = useCallback((tabId: string) => {
        setDraggedTab(tabId);
    }, []);

    const handleTabDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
    }, []);

    const handleTabDrop = useCallback((targetTabId: string) => {
        if (!draggedTab || draggedTab === targetTabId) {
            setDraggedTab(null);
            return;
        }

        setBuilderState((prev) => {
            const draggedIndex = prev.tabs.findIndex(t => t.id === draggedTab);
            const targetIndex = prev.tabs.findIndex(t => t.id === targetTabId);

            if (draggedIndex === -1 || targetIndex === -1) return prev;

            // Reorder tabs
            const newTabs = [...prev.tabs];
            const [draggedTabData] = newTabs.splice(draggedIndex, 1);
            newTabs.splice(targetIndex, 0, draggedTabData);

            // Update sequence numbers
            const updatedTabs = newTabs.map((tab, index) => ({
                ...tab,
                sequence: index + 1,
                fields: tab.fields.map(field => ({
                    ...field,
                    [EDialogDetails.tab_sequence]: (index + 1).toString(),
                })),
            }));

            return {
                ...prev,
                tabs: updatedTabs,
                isDirty: true,
            };
        });

        setDraggedTab(null);
    }, [draggedTab]);


    const handleSave = useCallback(async () => {
        await onSave(builderState);
        setBuilderState((prev) => ({ ...prev, isDirty: false }));
    }, [builderState, onSave]);

    const handlePreview = useCallback(() => {
        onPreview(builderState);
    }, [builderState, onPreview]);

    const handleDiscardConfirm = useCallback(() => { setOpenSaveDialog(true) }, [setOpenSaveDialog]);
    const handleDiscardDecline = useCallback(() => { setOpenSaveDialog(false) }, [setOpenSaveDialog]);
    const handleDiscardAccept = useCallback(() => {
        setOpenSaveDialog(false);
        onCancel()
    }, [setOpenSaveDialog, onCancel]
    );
    const handleCloseDialog = useCallback(() => {
            if (builderState.isDirty) {
                setOpenSaveDialog(true);
            } else {
                onCancel();
            }
        }, [builderState.isDirty, setOpenSaveDialog, onCancel]);
    

    const activeTabData = builderState.tabs.find((t) => t.id === builderState.activeTab);

    return (
        <BuilderContainer>
            <ConfirmationDialog
                open={openSaveDialog}
                title={t("dialogs.dataNotSaved")}
                content={t('dialogs.confirmCloseDialog')}
                onClose={handleDiscardConfirm}
                onDecline={handleDiscardDecline}
                onAccept={handleDiscardAccept}
            />
            <AdvancedFlexPanels rows={1} columns={3} initialColumnSizes={[[0.1, 0.6, 0.3]]} enableDrag={false}>
                {[[
                    <PanelWrapper key="palette">
                        <ComponentPalette />
                    </PanelWrapper>,
                    <PanelWrapper key="main">
                        <MainArea>
                            <Toolbar>
                                <ToolbarLeft>
                                    <Typography variant="h6">{builderState.dialogLabel || 'Unnamed Dialog'}</Typography>
                                </ToolbarLeft>
                                <Div style={{ display: 'flex', gap: '16px' }}>
                                    <IconButton
                                        onClick={handleShowHeaderProperties}
                                        icon={LYSettingsIcon}
                                        aria-label="Dialog Properties"
                                        isSelected={showHeaderProperties}
                                    />
                                    <Button onClick={handlePreview} variant="outlined">
                                        Preview
                                    </Button>
                                    <Button
                                        disabled={false}
                                        variant="outlined" // Use 'outlined' for a modern, clean look
                                        startIcon={LYCancelIcon}
                                        onClick={handleCloseDialog}
                                        color={builderState.isDirty ? EStandardColor.error : EStandardColor.primary}
                                    >
                                        {t('button.cancel')}
                                    </Button>
                                    <Button
                                        disabled={!builderState.isDirty}
                                        variant="outlined" // Use 'outlined' for a modern, clean look
                                        startIcon={LYSaveIcon}
                                        onClick={handleSave}
                                        color={!builderState.isDirty ? EStandardColor.success : EStandardColor.primary}
                                    >
                                        {t('button.save')}
                                    </Button>
                                </Div>
                            </Toolbar>

                            <TabsContainer>
                                <Div style={{ display: 'flex', alignItems: 'center' }}>
                                    <Div style={{ display: 'flex' }}>
                                        {builderState.tabs.map((tab) => (
                                            <Div
                                                key={tab.id}
                                                draggable
                                                onDragStart={(e) => {
                                                    handleTabDragStart(tab.id);
                                                    e.stopPropagation();
                                                }}
                                                onDragOver={handleTabDragOver}
                                                onDrop={(e) => {
                                                    handleTabDrop(tab.id);
                                                    e.stopPropagation();
                                                }}
                                                onClick={(e) => {
                                                    // Manually trigger tab change and selection
                                                    const selectedTab = builderState.tabs.find(t => t.id === tab.id);
                                                    if (selectedTab) {
                                                        setBuilderState((prev) => ({
                                                            ...prev,
                                                            activeTab: tab.id,
                                                            selectedTab: selectedTab,
                                                            selectedField: null,
                                                            tabs: prev.tabs.map((t) => ({
                                                                ...t,
                                                                fields: t.fields.map((f) => ({
                                                                    ...f,
                                                                    isSelected: false,
                                                                })),
                                                            })),
                                                        }));
                                                        setShowHeaderProperties(false);
                                                    }
                                                }}
                                                style={{
                                                    cursor: draggedTab === tab.id ? 'grabbing' : 'grab',
                                                    display: 'inline-block'
                                                }}
                                            >
                                                <Tab
                                                    id={tab.id}
                                                    label={tab.label}
                                                    value={tab.id}
                                                    isActive={builderState.activeTab === tab.id}
                                                />
                                            </Div>
                                        ))}
                                    </Div>
                                    <IconButton onClick={handleAddTab} icon={LYAddIcon} aria-label="Add Tab" />
                                </Div>
                            </TabsContainer>

                            {activeTabData && (
                                <BuilderCanvas
                                    tab={activeTabData}
                                    onFieldAdd={handleFieldAdd}
                                    onFieldSelect={handleFieldSelect}
                                    onFieldDelete={handleFieldDelete}
                                    onFieldMove={handleFieldMove}
                                />
                            )}
                        </MainArea>
                    </PanelWrapper>,
                    <PanelWrapper key="properties">
                        <PropertyPanel
                            key="properties"
                            selectedField={showHeaderProperties ? null : builderState.selectedField}
                            selectedTab={builderState.selectedTab}
                            tabs={builderState.tabs}
                            onFieldUpdate={handleFieldUpdate}
                            onTabUpdate={handleTabUpdate}
                            onFieldMoveToTab={handleFieldMoveToTab}
                            dialogID={builderState.dialogID}
                            dialogLabel={builderState.dialogLabel}
                            queryID={builderState.queryID}
                            onDialogHeaderUpdate={handleDialogHeaderUpdate}
                        />
                    </PanelWrapper>
                ]]}
            </AdvancedFlexPanels>
        </BuilderContainer>
    );
};
