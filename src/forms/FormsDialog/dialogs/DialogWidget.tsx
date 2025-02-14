/*
 * Copyright (c) 2022 NOMANA-IT and/or its affiliates.
 * All rights reserved. Use is subject to license terms.
 */
// React Import
import { Fragment, useEffect, useRef, useState } from "react";
import { useSpring } from "@react-spring/web";
import { useDrag } from "@use-gesture/react";
import ReactDOM from "react-dom";

// Custom Import
import { Div_DialogWidgetContent, Div_DialogWidgetTitleButtons, Div_ResizeBox, Div_DialogWidget, Div_DialogWidgetTitle, Backdrop } from '@ly_styles/Div';
import { DIALOG_WIDGET_DIMENSION, IReserveStatus } from '@ly_utils/commonUtils';
import { FormsDialog } from "@ly_forms/FormsDialog/FormsDialog";
import { ComponentProperties } from "@ly_types/lyComponents";
import { OnCloseFunction } from "@ly_forms/FormsDialog/utils/commonUtils";
import { IDialogAction } from "@ly_utils/commonUtils";
import { LYFullscreenExitIcon, LYFullscreenIcon } from "@ly_styles/icons";
import { useDeviceDetection, useMediaQuery } from '@ly_common/UseMediaQuery';
import { IconButton_Contrast } from "@ly_styles/IconButton";
import { DraggableDialog } from "@ly_common/DragableDialog";
import { IAppsProps } from "@ly_types/lyApplications";
import { IUsersProps } from "@ly_types/lyUsers";
import { IModulesProps } from "@ly_types/lyModules";

// Custom Import
interface IDialogWidget {
    open: boolean;
    componentProperties: ComponentProperties;
    onClose: OnCloseFunction
    sendAction?: IDialogAction
    appsProperties: IAppsProps;
    userProperties: IUsersProps;
    modulesProperties: IModulesProps;
    reserveStatus: IReserveStatus;
    onReserveRecord: (type: string, payload: string) => void;
}


export const DialogWidget = (props: IDialogWidget) => {
    const { open, componentProperties, onClose, appsProperties, userProperties, modulesProperties, reserveStatus, onReserveRecord } = props;

    const isSmallScreen = useMediaQuery("(max-width: 600px)");
    const isMobile = useDeviceDetection();

    const [isFullScreen, setIsFullScreen] = useState(() => isSmallScreen || isMobile); // Set fullscreen initially if small screen
    const [dimensions, setDimensions] = useState({ width: DIALOG_WIDGET_DIMENSION.width, height: DIALOG_WIDGET_DIMENSION.height });
    const resizeRef = useRef<HTMLDivElement | null>(null);
    const titleBarRef = useRef<HTMLDivElement | null>(null); // Add ref for the title bar

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
                const newWidth = Math.max(300, state.offset[0]); // Minimum width
                const newHeight = Math.max(200, state.offset[1]); // Minimum height
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

    
    if (!open) return null;
    return ReactDOM.createPortal(
        <Fragment>
            <Backdrop />
            <DraggableDialog
                {...bindDrag()} // Attach drag and resize functionality
                x={x.get()}
                y={y.get()}
                isFullScreen={isFullScreen}
            >
                <Div_DialogWidget fullScreen={isFullScreen} userWidth={isFullScreen ? '100vw' : `${dimensions.width}px`}
                    userHeight={isFullScreen ? '100dvh' : `${dimensions.height}px`}>
                    {/* Header */}
                    <Div_DialogWidgetTitle
                        ref={titleBarRef}
                        onDoubleClick={toggleFullScreen}
                    >
                        <span style={{ fontWeight: 'bold', fontSize: '1rem', fontVariant: 'small-caps' }}>
                            {componentProperties.label}
                        </span>
                        <Div_DialogWidgetTitleButtons>
                            <IconButton_Contrast aria-label="toggle full screen" onClick={toggleFullScreen}
                                icon={isFullScreen ? LYFullscreenExitIcon : LYFullscreenIcon}/>
                        </Div_DialogWidgetTitleButtons>
                    </Div_DialogWidgetTitle>
                    <Div_DialogWidgetContent>
                        <FormsDialog
                            componentProperties={componentProperties}
                            onClose={onClose}
                            appsProperties={appsProperties}
                            userProperties={userProperties}
                            modulesProperties={modulesProperties}
                            reserveStatus={reserveStatus}
                            onReserveRecord={onReserveRecord}
                        />
                    </Div_DialogWidgetContent>
                    {/* Resize handles */}
                    {!isFullScreen && (
                        <Div_ResizeBox
                            ref={resizeRef}
                        />
                    )}


                </Div_DialogWidget>
            </DraggableDialog>
        </Fragment>, document.body
    );
}
