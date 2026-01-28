/*
 * Copyright (c) 2025 NOMANA-IT and/or its affiliates.
 * All rights reserved. Use is subject to license terms.
 */

import React, { useState, useCallback, useRef, useEffect, Fragment } from 'react';
import ReactDOM from 'react-dom';
import { useSpring } from '@react-spring/web';
import { useDrag } from '@use-gesture/react';
import { DialogBuilder } from './DialogBuilder';
import { FormsDialog } from '@ly_forms/FormsDialog/FormsDialog';
import { IBuilderState } from './types/builderTypes';
import { saveDialogToDatabase, loadDialogFromDatabase, builderStateToDialogDetails } from './utils/builderApi';
import { useAppContext } from '@ly_context/AppProvider';
import { Dialog } from '@ly_common/Dialog';
import { LYComponentMode } from '@ly_types/lyComponents';
import { ComponentProperties } from '@ly_types/lyComponents';
import { Button } from '@ly_common/Button';
import { Div, Div_DialogWidget, Div_DialogWidgetTitle, Div_DialogWidgetTitleButtons, Div_DialogWidgetContent, Div_ResizeBox, Backdrop } from '@ly_styles/Div';
import { Typography } from '@ly_common/Typography';
import { LYCloseIcon, LYFullscreenIcon, LYFullscreenExitIcon } from '@ly_styles/icons';
import { IconButton_Contrast } from '@ly_styles/IconButton';
import { DraggableDialog } from '@ly_common/DragableDialog';
import { useMediaQuery, useDeviceDetection } from '@ly_common/UseMediaQuery';
import { DIALOG_WIDGET_DIMENSION } from '@ly_utils/commonUtils';

interface IDialogBuilderWrapperProps {
    open: boolean;
    frmID?: number;
    onClose: () => void;
}

/**
 * Dialog wrapper component for DialogBuilder following the application's dialog pattern
 */
export const DialogBuilderWrapper: React.FC<IDialogBuilderWrapperProps> = ({ open, frmID, onClose }) => {
    const { appsProperties, userProperties, modulesProperties } = useAppContext();
    const isSmallScreen = useMediaQuery('(max-width:600px)');
    const isMobile = useDeviceDetection();
    
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewState, setPreviewState] = useState<IBuilderState | null>(null);
    const [initialState, setInitialState] = useState<IBuilderState | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isFullScreen, setIsFullScreen] = useState(true);
    const [dimensions, setDimensions] = useState({ width: DIALOG_WIDGET_DIMENSION.width, height: DIALOG_WIDGET_DIMENSION.height });
    
    const resizeRef = useRef<HTMLDivElement | null>(null);
    const titleBarRef = useRef<HTMLDivElement | null>(null);

    // Update fullscreen state based on screen size
    useEffect(() => {
        if (isSmallScreen || isMobile) {
            setIsFullScreen(true);
        }
    }, [isSmallScreen, isMobile]);

    const [{ x, y }, api] = useSpring(() => ({
        x: 0,
        y: 0,
    }));

    // Gesture hook for dragging and resizing
    const bindDrag = useDrag(
        (state) => {
            const isResizing = state.event.target === resizeRef.current;

            if (isResizing) {
                // Handle resizing
                const newWidth = Math.max(800, state.offset[0]); // Minimum width for builder
                const newHeight = Math.max(600, state.offset[1]); // Minimum height for builder
                setDimensions({ width: newWidth, height: newHeight });
            } else if (!isFullScreen) {
                if (titleBarRef.current && titleBarRef.current.contains(state.event.target as Node))
                    // Handle dragging
                    api.start({ x: state.offset[0], y: state.offset[1] });
            }
        },
        {
            from: (state) => {
                const isResizing = state.target === resizeRef.current;
                if (isResizing) {
                    return [dimensions.width, dimensions.height];
                } else {
                    return [x.get(), y.get()];
                }
            },
        }
    );

    const toggleFullScreen = () => {
        if (!isSmallScreen && !isMobile) {
            setIsFullScreen((prev) => !prev);
        }
    };

    // Load existing dialog on mount
    React.useEffect(() => {
        if (frmID) {
            setIsLoading(true);
            loadDialogFromDatabase({
                dialogID: frmID,
                appsProperties,
                modulesProperties,
            })
                .then((state) => setInitialState(state))
                .catch((error) => console.error('Error loading dialog:', error))
                .finally(() => setIsLoading(false));
        }
    }, [frmID, appsProperties, modulesProperties]);

    // Save handler
    const handleSave = useCallback(
        async (state: IBuilderState) => {
            try {
                const result = await saveDialogToDatabase({
                    builderState: state,
                    appsProperties,
                    modulesProperties,
                });

                console.log('Dialog saved successfully:', result.dialogID);
                
                // Optionally show success message
                alert(`Dialog saved successfully! ID: ${result.dialogID}`);
            } catch (error) {
                console.error('Error saving dialog:', error);
                alert('Error saving dialog. Please try again.');
            }
        },
        [appsProperties, modulesProperties]
    );

    // Preview handler
    const handlePreview = useCallback((state: IBuilderState) => {
        setPreviewState(state);
        setPreviewOpen(true);
    }, []);

    const handlePreviewClose = useCallback(() => {
        setPreviewOpen(false);
    }, []);

    if (!open) return null;

    if (isLoading) {
        return ReactDOM.createPortal(
            <Fragment>
                <Backdrop />
                <DraggableDialog
                    style={{
                        x: 0,
                        y: 0,
                        top: '50%',
                        left: '50%',
                    }}
                >
                    <Div_DialogWidget fullScreen={false} userWidth="400px" userHeight="200px">
                        <Div_DialogWidgetContent>
                            <Div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                                <Typography>Loading forms builder...</Typography>
                            </Div>
                        </Div_DialogWidgetContent>
                    </Div_DialogWidget>
                </DraggableDialog>
            </Fragment>,
            document.body
        );
    }

    return ReactDOM.createPortal(
        <Fragment>
            <Backdrop />
            <DraggableDialog
                {...bindDrag()}
                style={{
                    x: isFullScreen ? 0 : x,
                    y: isFullScreen ? 0 : y,
                    bottom: isFullScreen ? 0 : 'auto',
                    right: isFullScreen ? 0 : 'auto',
                    top: isFullScreen ? 0 : '50%',
                    left: isFullScreen ? 0 : '50%',
                }}
            >
                <Div_DialogWidget 
                    fullScreen={isFullScreen} 
                    userWidth={isFullScreen ? '100vw' : `${dimensions.width}px`}
                    userHeight={isFullScreen ? '100dvh' : `${dimensions.height}px`}
                >
                    {/* Header */}
                    <Div_DialogWidgetTitle
                        ref={titleBarRef}
                        onDoubleClick={toggleFullScreen}
                    >
                        <span style={{ fontWeight: 'bold', fontSize: '1rem', fontVariant: 'small-caps' }}>
                            {frmID ? `Edit Dialog Form #${frmID}` : 'New Dialog Builder'}
                        </span>
                        <Div_DialogWidgetTitleButtons>
                            <IconButton_Contrast 
                                aria-label="toggle full screen" 
                                onClick={toggleFullScreen} 
                                icon={isFullScreen ? LYFullscreenExitIcon : LYFullscreenIcon} 
                            />
                        </Div_DialogWidgetTitleButtons>
                    </Div_DialogWidgetTitle>
                    
                    <Div_DialogWidgetContent>
                        <DialogBuilder
                            frmID={frmID}
                            onCancel={onClose}
                            onSave={handleSave}
                            onPreview={handlePreview}
                            initialState={initialState || undefined}
                        />
                    </Div_DialogWidgetContent>

                    {/* Resize handles */}
                    {!isFullScreen && (
                        <Div_ResizeBox ref={resizeRef} />
                    )}
                </Div_DialogWidget>
            </DraggableDialog>

            {/* Preview Dialog */}
            {previewOpen && previewState && (
                <Dialog open={previewOpen} onClose={handlePreviewClose} maxWidth="lg">
                    <PreviewDialog state={previewState} onClose={handlePreviewClose} />
                </Dialog>
            )}
        </Fragment>,
        document.body
    );
};

// Preview component that renders the built dialog using FormsDialog
const PreviewDialog: React.FC<{ state: IBuilderState; onClose: () => void }> = ({ state, onClose }) => {
    const { header, details, tabs } = builderStateToDialogDetails(state);

    // Create component properties for FormsDialog
    const componentProperties: ComponentProperties = {
        id: state.dialogID || -1,
        type: 'FormsDialog' as any,
        label: state.dialogLabel,
        filters: [],
        componentMode: LYComponentMode.add,
        showPreviousButton: false,
        isChildren: false,
    };

    return (
        <Div style={{ padding: '16px' }}>
            <Div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <Typography variant="h6">Preview: {state.dialogLabel}</Typography>
                <Button onClick={onClose}>Close Preview</Button>
            </Div>
            <FormsDialog componentProperties={componentProperties} onClose={onClose} />
        </Div>
    );
};
