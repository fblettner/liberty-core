/*
 * Copyright (c) 2025 NOMANA-IT and/or its affiliates.
 * All rights reserved. Use is subject to license terms.
 */

import React, { useState } from 'react';
import styled from '@emotion/styled';
import { ComponentFieldType, IPaletteComponent } from '../types/builderTypes';
import { Typography } from '@ly_common/Typography';
import { Div } from '@ly_styles/Div';

const PaletteItemCard = styled(Div)(({ theme }) => ({
    padding: '12px',
    margin: '4px 0',
    cursor: 'grab',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'all 0.2s',
    borderRadius: '8px',
    border: `1px solid ${theme.palette.divider}`,
    backgroundColor: theme.palette.background.paper,
    '&:hover': {
        backgroundColor: theme.palette.action.hover,
        transform: 'translateY(-2px)',
        boxShadow: theme.shadows[2],
    },
    '&:active': {
        cursor: 'grabbing',
        transform: 'scale(0.98)',
    }
}));

const IconWrapper = styled.span({
    fontSize: '20px',
    lineHeight: 1,
});

interface IPaletteItemProps {
    component: IPaletteComponent;
    onDragStart: (component: IPaletteComponent) => void;
}

export const PaletteItem: React.FC<IPaletteItemProps> = ({ component, onDragStart }) => {
    return (
        <PaletteItemCard
            draggable
            onDragStart={(e) => {
                e.dataTransfer.effectAllowed = 'copy';
                e.dataTransfer.setData('application/json', JSON.stringify({
                    type: 'PALETTE_ITEM',
                    fieldType: component.type,
                }));
                onDragStart(component);
            }}
        >
            <IconWrapper>{component.icon}</IconWrapper>
            <Typography variant="body2">{component.label}</Typography>
        </PaletteItemCard>
    );
};
