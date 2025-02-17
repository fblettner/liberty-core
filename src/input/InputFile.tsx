/*
 * Copyright (c) 2025 NOMANA-IT and/or its affiliates.
 * All rights reserved. Use is subject to license terms.
 * *
 */
// React Import
import React from 'react';
import { t } from 'i18next';

import { EStandardColor, ESeverity } from '@ly_utils/commonUtils';
import { LYAttachFileIcon } from '@ly_styles/icons';
import { Div } from '@ly_styles/Div';
import { IconButton } from '@ly_common/IconButton';
import { useAppContext } from '@ly_context/AppProvider';


interface InputFileProps {
    onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    fileInputRef: React.RefObject<HTMLInputElement| null> ;
    disabled: boolean;
    accept: string;  
}

export const InputFile = ({
    onFileChange,
    fileInputRef,
    disabled,
    accept,
}: InputFileProps) => {
    const {  addSnackMessage } = useAppContext();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const maxSize = 5 * 1024 * 1024; // 5 MB
            const validTypes: string[] = accept.split(',').map(type => type.trim());

            if (file.size > maxSize) {
                addSnackMessage( t("files.size"), ESeverity.error)
                return;
            }
            // Check file type
            const isValidType = validTypes.some(type => {
                if (type.startsWith('.')) {
                    // Check for file extension
                    return file.name.endsWith(type);
                }
                return file.type === type; // Check for MIME type
            });

            if (!isValidType) {
                addSnackMessage(t("files.type"), ESeverity.error)
                return;
            }

            // File is valid, call the onFileChange handler
            addSnackMessage(t("files.success"), ESeverity.success)
            onFileChange(e);
        }

        // Reset the file input so the same file can be selected again
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };


    return (
        <Div>
            <input
                accept={accept}
                style={{ display: 'none' }}
                id="file-upload"
                type="file"
                onChange={handleFileChange}
                ref={fileInputRef}
                aria-label="upload file"
            />
            <label htmlFor="file-upload">
                <IconButton
                    component="span"
                    color={EStandardColor.primary}
                    aria-label="attach file"
                    disabled={disabled} icon={LYAttachFileIcon}
                />
            </label>
        </Div>
    );
};
