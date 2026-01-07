/*
 * Copyright (c) 2025 NOMANA-IT and/or its affiliates.
 * All rights reserved. Use is subject to license terms.
 */

/**
 * USAGE EXAMPLES
 * 
 * This file demonstrates different ways to use the DialogBuilder
 * in your Liberty Core application.
 */

import React from 'react';
import { DialogBuilderWrapper } from '@ly_forms/FormsDialogBuilder';
import { Button } from '@ly_common/Button';

// ============================================================================
// Example 1: Create New Dialog
// ============================================================================
export function CreateNewDialogExample() {
    const [showBuilder, setShowBuilder] = React.useState(false);

    return (
        <div>
            <Button onClick={() => setShowBuilder(true)}>
                Create New Dialog
            </Button>

                <DialogBuilderWrapper
                    // dialogID is undefined = create new
                    onClose={() => setShowBuilder(false)} open={showBuilder}                />
        </div>
    );
}

// ============================================================================
// Example 2: Edit Existing Dialog
// ============================================================================
export function EditDialogExample() {
    const [showBuilder, setShowBuilder] = React.useState(false);
    const existingDialogID = 123; // Load dialog with ID 123

    return (
        <div>
            <Button onClick={() => setShowBuilder(true)}>
                Edit Dialog #{existingDialogID}
            </Button>

                <DialogBuilderWrapper
                    frmID={existingDialogID}
                    onClose={() => setShowBuilder(false)}
                    open={showBuilder}
                />
            </div>
    );
}

// ============================================================================
// Example 3: Dialog List with Builder
// ============================================================================
export function DialogManagementPage() {
    const [dialogs, setDialogs] = React.useState([
        { id: 1, label: 'Customer Form', lastModified: '2025-01-05' },
        { id: 2, label: 'Order Entry', lastModified: '2025-01-04' },
        { id: 3, label: 'Product Details', lastModified: '2025-01-03' },
    ]);
    const [selectedDialogID, setSelectedDialogID] = React.useState<number | null>(null);
    const [showBuilder, setShowBuilder] = React.useState(false);

    return (
        <div>
            <h1>Dialog Management</h1>
            
            <Button onClick={() => {
                setSelectedDialogID(-1);
                setShowBuilder(true);
            }}>
                Create New Dialog
            </Button>

            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Last Modified</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {dialogs.map((dialog) => (
                        <tr key={dialog.id}>
                            <td>{dialog.id}</td>
                            <td>{dialog.label}</td>
                            <td>{dialog.lastModified}</td>
                            <td>
                                <Button onClick={() => setSelectedDialogID(dialog.id)}>
                                    Edit
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {selectedDialogID !== null && (
                <DialogBuilderWrapper
                    frmID={selectedDialogID === -1 ? undefined : selectedDialogID}
                    onClose={() => setSelectedDialogID(null)} open={showBuilder}                />
            )}
        </div>
    );
}

// ============================================================================
// Example 4: Integration with Menu System
// ============================================================================
export function AppWithDialogBuilder() {
    const [currentView, setCurrentView] = React.useState<'home' | 'builder'>('home');
    const [dialogID, setDialogID] = React.useState<number | undefined>();

    const openBuilder = (id?: number) => {
        setDialogID(id);
        setCurrentView('builder');
    };

    const closeBuilder = () => {
        setCurrentView('home');
        setDialogID(undefined);
    };

    return (
        <div>
            {currentView === 'home' && (
                <div>
                    <h1>Application Home</h1>
                    <Button onClick={() => openBuilder()}>New Dialog</Button>
                    <Button onClick={() => openBuilder(456)}>Edit Dialog #456</Button>
                </div>
            )}

            {currentView === 'builder' && (
                <DialogBuilderWrapper
                    frmID={dialogID}
                    onClose={closeBuilder}
                    open={currentView === 'builder'}
                />
            )}
        </div>
    );
}

// ============================================================================
// Example 5: Advanced Usage with Custom Save Handler
// ============================================================================
import { DialogBuilder } from '@ly_forms/FormsDialogBuilder';
import { IBuilderState } from '@ly_forms/FormsDialogBuilder';
import { saveDialogToDatabase } from '@ly_forms/FormsDialogBuilder';
import { useAppContext } from '@ly_context/AppProvider';

export function AdvancedBuilderExample() {
    const { appsProperties, modulesProperties } = useAppContext();
    const [showPreview, setShowPreview] = React.useState(false);
    const [previewState, setPreviewState] = React.useState<IBuilderState | null>(null);

    const handleSave = async (state: IBuilderState) => {
        try {
            // Custom pre-save validation
            if (!state.dialogLabel) {
                alert('Please enter a dialog name');
                return;
            }

            // Save to database
            const result = await saveDialogToDatabase({
                builderState: state,
                appsProperties,
                modulesProperties,
            });

            // Custom post-save actions
            console.log('Dialog saved:', result.dialogID);
            
            // Could trigger webhook, audit log, etc.
            // await logAuditEvent('dialog_saved', result.dialogID);
            
            alert(`Success! Dialog ${result.dialogID} saved.`);
        } catch (error) {
            console.error('Save failed:', error);
            alert('Failed to save dialog. Check console for details.');
        }
    };

    const handlePreview = (state: IBuilderState) => {
        setPreviewState(state);
        setShowPreview(true);
    };

    return (
        <DialogBuilder
            onSave={handleSave}
            onPreview={handlePreview}
        />
    );
}

// ============================================================================
// Example 6: Programmatically Create Dialog
// ============================================================================
import { v4 as uuidv4 } from 'uuid';
import { EDialogDetails } from '@ly_types/lyDialogs';

export function ProgrammaticDialogCreation() {
    const { appsProperties, modulesProperties } = useAppContext();

    const createCustomerDialog = async () => {
        const dialogState: IBuilderState = {
            dialogID: null,
            dialogLabel: 'Customer Form',
            queryPool: 'CUSTOMERS',
            queryID: 100,
            tabs: [
                {
                    id: uuidv4(),
                    label: 'General Info',
                    sequence: 1,
                    cols: 2,
                    fields: [
                        {
                            builderID: uuidv4(),
                            [EDialogDetails.id]: 'CUST_NAME',
                            [EDialogDetails.tab_sequence]: '1',
                            [EDialogDetails.sequence]: 1,
                            [EDialogDetails.language]: 'EN',
                            [EDialogDetails.component]: 'DD',
                            [EDialogDetails.componentID]: 0,
                            [EDialogDetails.dictionaryID]: 'CUST_NAME',
                            [EDialogDetails.label]: 'Customer Name',
                            [EDialogDetails.type]: 'string',
                            [EDialogDetails.rules]: '',
                            [EDialogDetails.rulesValues]: '',
                            [EDialogDetails.default]: '',
                            [EDialogDetails.target]: 'CUST_NAME',
                            [EDialogDetails.visible]: 'Y',
                            [EDialogDetails.disabled]: 'N',
                            [EDialogDetails.required]: 'Y',
                            [EDialogDetails.key]: 'Y',
                            [EDialogDetails.colspan]: 2,
                            [EDialogDetails.dynamic_params]: '',
                            [EDialogDetails.fixed_params]: '',
                            [EDialogDetails.pool_params]: '',
                            [EDialogDetails.output_params]: '',
                            [EDialogDetails.cdn_id]: 0,
                            [EDialogDetails.cdn_dynamic_params]: '',
                            [EDialogDetails.cdn_fixed_params]: '',
                            isSelected: false,
                        },
                        // Add more fields...
                    ],
                },
            ],
            activeTab: '',
            selectedField: null,
            selectedTab: null,
            isDirty: false,
        };

        // Save programmatically
        const result = await saveDialogToDatabase({
            builderState: dialogState,
            appsProperties,
            modulesProperties,
        });

        console.log('Created dialog:', result.dialogID);
    };

    return (
        <Button onClick={createCustomerDialog}>
            Create Customer Dialog Programmatically
        </Button>
    );
}

// ============================================================================
// Example 7: Clone Existing Dialog
// ============================================================================
import { loadDialogFromDatabase } from '@ly_forms/FormsDialogBuilder';

export function CloneDialogExample() {
    const { appsProperties, modulesProperties } = useAppContext();
    const [showBuilder, setShowBuilder] = React.useState(false);
    const [clonedState, setClonedState] = React.useState<IBuilderState | null>(null);

    const cloneDialog = async (sourceDialogID: number) => {
        try {
            // Load source dialog
            const sourceState = await loadDialogFromDatabase({
                dialogID: sourceDialogID,
                appsProperties,
                modulesProperties,
            });

            // Modify for clone
            const clonedState: IBuilderState = {
                ...sourceState,
                dialogID: null, // New dialog
                dialogLabel: `${sourceState.dialogLabel} (Copy)`,
                isDirty: true,
            };

            setClonedState(clonedState);
            setShowBuilder(true);
        } catch (error) {
            console.error('Failed to clone dialog:', error);
        }
    };

    return (
        <div>
            <Button onClick={() => cloneDialog(789)}>
                Clone Dialog #789
            </Button>

            {showBuilder && clonedState && (
                <DialogBuilder
                    initialState={clonedState}
                    onSave={async (state) => {
                        await saveDialogToDatabase({
                            builderState: state,
                            appsProperties,
                            modulesProperties,
                        });
                        setShowBuilder(false);
                    }}
                    onPreview={(state) => console.log('Preview:', state)}
                />
            )}
        </div>
    );
}
