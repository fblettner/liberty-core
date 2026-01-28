/*
 * Copyright (c) 2025 NOMANA-IT and/or its affiliates.
 * All rights reserved. Use is subject to license terms.
 */

import React from 'react';
import styled from '@emotion/styled';
import { Typography } from '@ly_common/Typography';
import { Div } from '@ly_styles/Div';
import { PALETTE_COMPONENTS } from '../config/paletteConfig';
import { PaletteItem } from './PaletteItem';
import { Divider } from '@ly_common/Divider';
import { IPaletteComponent } from '../types/builderTypes';

const PaletteContainer = styled(Div)(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    height: "100%",
    flex: "1 1 0px",
    overflowY: 'auto',
    padding: '16px',
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
    fontWeight: 600,
    marginTop: '16px',
    marginBottom: '8px',
    color: theme.palette.text.secondary,
}));

interface IComponentPaletteProps {
    onDragStart?: (component: IPaletteComponent) => void;
}

export const ComponentPalette: React.FC<IComponentPaletteProps> = ({ onDragStart = () => {} }) => {
    // Group components by category
    const inputComponents = PALETTE_COMPONENTS.filter(c =>
        c.type.startsWith('Input') && c.type !== 'InputAction'
    );
    
    const formComponents = PALETTE_COMPONENTS.filter(c =>
        c.type.startsWith('Forms')
    );
    
    const actionComponents = PALETTE_COMPONENTS.filter(c =>
        c.type === 'InputAction'
    );

    return (
        <PaletteContainer>
            <SectionTitle variant="caption">Input Fields</SectionTitle>
            {inputComponents.map((component) => (
                <PaletteItem key={component.type} component={component} onDragStart={onDragStart} />
            ))}

            <SectionTitle variant="caption">Data Components</SectionTitle>
            {formComponents.map((component) => (
                <PaletteItem key={component.type} component={component} onDragStart={onDragStart} />
            ))}

            <SectionTitle variant="caption">Actions</SectionTitle>
            {actionComponents.map((component) => (
                <PaletteItem key={component.type} component={component} onDragStart={onDragStart} />
            ))}
        </PaletteContainer>
    );
};
