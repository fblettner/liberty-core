/*
 * Copyright (c) 2025 NOMANA-IT and/or its affiliates.
 * All rights reserved. Use is subject to license terms.
 * *
 */
import styled from "@emotion/styled";

type DividerProps = {
  orientation?: 'horizontal' | 'vertical';
  flexItem?: boolean;
  darkMode?: boolean;
};

const StyledDivider = styled.div<{ orientation: 'horizontal' | 'vertical'; flexItem: boolean }>(
  ({ orientation, flexItem, theme }) => ({
    backgroundColor: theme.palette.mode === "dark" ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.12)',
    width: orientation === 'vertical' ? '1px' : '100%',
    height: orientation === 'vertical' ? '100%' : '1px',
    flexShrink: 0,
    alignSelf: flexItem ? 'stretch' : 'center',
    boxSizing: 'border-box',
    position: 'relative',
    zIndex: 1,
  })
);

export function Divider({ orientation = 'horizontal', flexItem = false}: DividerProps) {

  return (
    <StyledDivider
      orientation={orientation}
      flexItem={flexItem}
    />
  );
}