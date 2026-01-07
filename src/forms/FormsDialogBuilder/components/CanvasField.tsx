/*
 * Copyright (c) 2025 NOMANA-IT and/or its affiliates.
 * All rights reserved. Use is subject to license terms.
 */

import React, { useRef, useState } from 'react';
import styled from '@emotion/styled';
import { IBuilderField } from '../types/builderTypes';
import { Typography } from '@ly_common/Typography';
import { Div } from '@ly_styles/Div';
import { EDialogDetails } from '@ly_types/lyDialogs';
import { LYDeleteIcon, LYEditIcon } from '@ly_styles/icons';
import { IconButton } from '@ly_common/IconButton';
import { LYIconSize } from '@ly_utils/commonUtils';

const FieldCard = styled.div<{ isSelected?: boolean; isDragging?: boolean; isDropTarget?: boolean }>(({ theme, isSelected, isDragging, isDropTarget }) => ({
    padding: '12px',
    margin: '4px 0',
    cursor: 'move',
    border: isDropTarget ? `2px solid #2196f3` : isSelected ? `2px solid ${theme.palette.primary.main}` : `1px solid ${theme.palette.divider}`,
    backgroundColor: isSelected ? theme.palette.action.selected : theme.palette.background.paper,
    opacity: isDragging ? 0.5 : 1,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    transition: 'all 0.2s',
    borderRadius: '8px',
    height: '100%',
    minHeight: '60px',
    '&:hover': {
        borderColor: theme.palette.primary.main,
        boxShadow: theme.shadows[1],
    },
}));

const FieldInfo = styled(Div)({
    flex: 1,
    minWidth: 0,
    display: 'flex',
    alignItems: 'center',
});

const FieldActions = styled(Div)({
    display: 'flex',
    gap: '4px',
});

const FieldIcon = styled.span({
    marginRight: '8px',
    fontSize: '18px',
});

interface ICanvasFieldProps {
    field: IBuilderField;
    tabID: string;
    index: number;
    onSelect: (field: IBuilderField) => void;
    onDelete: (fieldID: string) => void;
    onMove: (dragIndex: number, hoverIndex: number) => void;
}

export const CanvasField: React.FC<ICanvasFieldProps> = ({
    field,
    tabID,
    index,
    onSelect,
    onDelete,
    onMove,
}) => {
    const ref = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isDropTarget, setIsDropTarget] = useState(false);

    const handleDragStart = (e: React.DragEvent) => {
        setIsDragging(true);
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', field[EDialogDetails.sequence].toString());
    };

    const handleDragEnd = () => {
        setIsDragging(false);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        e.dataTransfer.dropEffect = 'move';
        setIsDropTarget(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.stopPropagation();
        // Only clear drop target if we're leaving the card itself, not child elements
        if (e.currentTarget === e.target) {
            setIsDropTarget(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDropTarget(false);
        
        const sourceSequence = parseInt(e.dataTransfer.getData('text/plain'));
        const targetSequence = field[EDialogDetails.sequence];
     
        if (sourceSequence && targetSequence && sourceSequence !== targetSequence) {
            onMove(sourceSequence, targetSequence);
        }
    };

    const getFieldIcon = () => {
        const component = field[EDialogDetails.component];
        const rules = field[EDialogDetails.rules];
        
        if (rules === 'color') return '🎨';
        if (rules === 'enum') return '📋';
        if (rules === 'lookup') return '🔍';
        if (rules === 'password') return '🔒';
        if (component === 'FormsTable') return '📊';
        if (component === 'FormsTree') return '🌲';
        if (component === 'FormsList') return '📑';
        if (component === 'FormsGrid') return '⊞';
        if (component === 'InputAction') return '⚡';
        
        const type = field[EDialogDetails.type];
        if (type === 'number') return '🔢';
        if (type === 'date' || type === 'jdedate') return '📅';
        if (type === 'boolean') return '☑️';
        
        return '📝';
    };

    return (
        <FieldCard
            ref={ref}
            draggable
            isSelected={field.isSelected}
            isDragging={isDragging}
            isDropTarget={isDropTarget}
            data-field-sequence={field[EDialogDetails.sequence]}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => onSelect(field)}
        >
            <FieldInfo>
                <FieldIcon>{getFieldIcon()}</FieldIcon>
                <Div>
                    <Typography variant="body2" fontWeight={500}>
                        {field[EDialogDetails.label] || 'Untitled Field'}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                        {field[EDialogDetails.id] || field[EDialogDetails.dictionaryID] || 'No ID'}
                        {' • '}
                        {field[EDialogDetails.component]}
                        {field[EDialogDetails.required] === 'Y' && ' • Required'}
                    </Typography>
                </Div>
            </FieldInfo>
            <FieldActions>
                <IconButton
                    size={LYIconSize.small}
                    onClick={(e) => {
                        e.stopPropagation();
                        onSelect(field);
                    }}
                    icon={LYEditIcon}
                    aria-label="Edit field"
                />
                <IconButton
                    size={LYIconSize.small}
                    color="error"
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete(field.builderID);
                    }}
                    icon={LYDeleteIcon}
                    aria-label="Delete field"
                />
            </FieldActions>
        </FieldCard>
    );
};
