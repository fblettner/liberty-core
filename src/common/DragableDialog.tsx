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
  style?: any; 
}

export const DraggableDialog = styled(animated.div, {
  shouldForwardProp: (prop) => prop !== "isFullScreen",
})<DraggableDialogProps>`
  position: fixed;
  touch-action: none;
  z-index: ${DefaultZIndex.Dialog};
`;