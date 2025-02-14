/*
 * Copyright (c) 2025 NOMANA-IT and/or its affiliates.
 * All rights reserved. Use is subject to license terms.
 * *
 */
import '@emotion/react';
import styled from '@emotion/styled';
import { TableCell, TableRow } from '@ly_common/Table';
import { Div } from '@ly_styles/Div';
import { DefaultZIndex } from '@ly_types/common';

export const TableContainer = styled(Div)(({ theme }) => ({
  width: "100%",
  overflowX: "auto", // Enable horizontal scrolling
  backgroundColor: theme.palette.background.paper,
  borderRadius: "12px",
  boxShadow: theme.shadows[1],
  border: `1px solid ${theme.palette.divider}`,
}));

export const TableRow_Header = styled(TableRow)(({ theme }) => ({
  background: theme.palette.background.default,
  color: theme.palette.primary.main,
  "&:hover": {
    background: theme.palette.background.default,
},
}));

export const TableCell_HeaderCheckbox = styled(TableCell)(({ theme }) => ({
  position: 'sticky',
  top: 0,
  left: 0,
  zIndex: DefaultZIndex.Component + 10,
  width: '48px',                
  textAlign: 'center',         
  alignItems: 'center',      
  backgroundColor: theme.palette.background.paper, 
  borderRight: `1px solid ${theme.palette.divider}`,
  paddingTop: '12px',
  paddingBottom: '12px',
}));

export const TableCell_Checkbox = styled(TableCell)(({ theme }) => ({
  position: 'sticky',
  left: 0,
  width: '48px',                
  textAlign: 'center',         
  alignItems: 'center',     
  backgroundColor: theme.palette.background.paper, 
  borderRight: `1px solid ${theme.palette.divider}`,
  paddingTop: '6px',
  paddingBottom: '6px',
}));

export interface StyledTableRowProps {
  isSelected: boolean;
}

export const TableRow_Selected = styled(TableRow)<StyledTableRowProps>(({ theme, isSelected }) => ({
  cursor: "pointer",
  background: isSelected
    ? theme.background.default
    : "inherit",
  '&:hover': {
    background: theme.background.default,
    color: theme.color.default,
  },
}));


