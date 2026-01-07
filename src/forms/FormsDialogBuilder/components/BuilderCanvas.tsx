/*
 * Copyright (c) 2025 NOMANA-IT and/or its affiliates.
 * All rights reserved. Use is subject to license terms.
 */

import React, { useState } from 'react';
import styled from '@emotion/styled';
import { Typography } from '@ly_common/Typography';
import { Div } from '@ly_styles/Div';
import { ComponentFieldType, IBuilderField, IBuilderTab } from '../types/builderTypes';
import { CanvasField } from './CanvasField';
import { EDialogDetails } from '@ly_types/lyDialogs';

const CanvasContainer = styled(Div)(({ theme }) => ({
    flex: 1,
    height: '100%',
    overflowY: 'auto',
    padding: '16px',
    minHeight: '400px',
    backgroundColor: theme.palette.background.default,
}));

const GridContainer = styled(Div, {
    shouldForwardProp: (prop) => prop !== 'columns',
})<{ columns: number }>(({ columns }) => ({
    display: 'grid',
    gridTemplateColumns: `repeat(${columns}, 1fr)`,
    gap: '8px',
    width: '100%',
}));

const DropZone = styled(Div, {
    shouldForwardProp: (prop) => prop !== 'isOver',
})<{ isOver?: boolean }>(({ theme, isOver }) => ({
    minHeight: '300px',
    padding: '16px',
    border: `2px dashed ${isOver ? theme.palette.primary.main : theme.palette.divider}`,
    borderRadius: '8px',
    backgroundColor: isOver ? theme.palette.action.hover : 'transparent',
    transition: 'all 0.2s',
}));

const EmptyState = styled(Div)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    minHeight: '250px',
    color: theme.palette.text.secondary,
}));

interface IBuilderCanvasProps {
    tab: IBuilderTab;
    onFieldAdd: (fieldType: ComponentFieldType, tabID: string) => void;
    onFieldSelect: (field: IBuilderField) => void;
    onFieldDelete: (fieldID: string, tabID: string) => void;
    onFieldMove: (tabID: string, dragIndex: number, hoverIndex: number) => void;
}

export const BuilderCanvas: React.FC<IBuilderCanvasProps> = ({
    tab,
    onFieldAdd,
    onFieldSelect,
    onFieldDelete,
    onFieldMove,
}) => {
    const [isOver, setIsOver] = useState(false);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
        setIsOver(true);
    };

    const handleDragLeave = () => {
        setIsOver(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsOver(false);

        try {
            const data = JSON.parse(e.dataTransfer.getData('application/json'));
            if (data.type === 'PALETTE_ITEM' && data.fieldType) {
                onFieldAdd(data.fieldType, tab.id);
            }
        } catch (error) {
            console.error('Error parsing drop data:', error);
        }
    };

    return (
        <CanvasContainer>
            <Div style={{ marginBottom: '16px' }}>
                <Typography variant="h6">{tab.label}</Typography>
                <Typography variant="caption" color="textSecondary">
                    Columns: {tab.cols} • Fields: {tab.fields.length}
                </Typography>
            </Div>

            <DropZone
                isOver={isOver}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                {tab.fields.length === 0 ? (
                    <EmptyState>
                        <Typography variant="h6" gutterBottom>
                            Drop components here
                        </Typography>
                        <Typography variant="body2">
                            Drag components from the palette to build your dialog
                        </Typography>
                    </EmptyState>
                ) : (
                    <GridContainer columns={tab.cols}>
                        {tab.fields
                            .sort((a, b) => a[EDialogDetails.sequence] - b[EDialogDetails.sequence])
                            .map((field, index) => (
                                <Div
                                    key={field.builderID}
                                    style={{
                                        gridColumn: `span ${Math.min(field[EDialogDetails.colspan] || 1, tab.cols)}`,
                                    }}
                                >
                                    <CanvasField
                                        field={field}
                                        tabID={tab.id}
                                        index={index}
                                        onSelect={onFieldSelect}
                                        onDelete={(fieldID) => onFieldDelete(fieldID, tab.id)}
                                        onMove={(dragIndex, hoverIndex) =>
                                            onFieldMove(tab.id, dragIndex, hoverIndex)
                                        }
                                    />
                                </Div>
                            ))}
                    </GridContainer>
                )}
            </DropZone>
        </CanvasContainer>
    );
};
