/*
 * Copyright (c) 2025 NOMANA-IT and/or its affiliates.
 * All rights reserved. Use is subject to license terms.
 * *
 */
import styled from "@emotion/styled";
import { DefaultZIndex } from "@ly_types/common";
import { animated, AnimatedProps } from "@react-spring/web";
import { HTMLAttributes, ReactNode } from "react";

interface DraggableDialogProps extends AnimatedProps<HTMLAttributes<HTMLDivElement>> {
    children?: ReactNode; 
    isFullScreen?: boolean;
    x: number;
    y: number;
  }
  
export const DraggableDialog = styled(animated.div,  {
    shouldForwardProp: (prop) => prop !== "isFullScreen" && prop !== "isFullScreen" && prop !== "x" && prop !== "y",
}) <DraggableDialogProps>`
        x: ${(props) => (props.isFullScreen ? 0 : props.x)},
        y: ${(props) => (props.isFullScreen ? 0 : props.y)},
        position: 'fixed',
        bottom: ${(props) => (props.isFullScreen ? 0 : 'auto')},
        right: ${(props) => (props.isFullScreen ? 0 : 'auto')},
        top: ${(props) => (props.isFullScreen ? 0 : '50%')},
        left: ${(props) => (props.isFullScreen ? 0 : '50%')},
        touchAction: 'none',
        zIndex: ${DefaultZIndex.Dialog},
`;
