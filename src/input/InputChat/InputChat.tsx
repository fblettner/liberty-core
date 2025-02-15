/*
 * Copyright (c) 2022 NOMANA-IT and/or its affiliates.
 * All rights reserved. Use is subject to license terms.
 * *
 */
// React Import
import React, { forwardRef, useCallback } from 'react';
import { t } from 'i18next';

// Custom Import
import { InputFile } from '@ly_input/InputFile';
import { FileDisplay } from '@ly_input/InputChat/FileDisplay';
import { EStandardColor } from '@ly_utils/commonUtils';
import { LYArrowDownwardIcon, LYArrowRightIcon, LYTelegramIcon } from '@ly_styles/icons';
import { LYIconSize } from "@ly_utils/commonUtils";
import { Div_ChatScrollButtons, Div_InputChat } from '@ly_styles/Div';
import { IconButton } from '@ly_common/IconButton';
import { IconButton_Contrast } from '@ly_styles/IconButton';
import { Input } from '@ly_common/Input';
import { IAppsProps } from '@ly_types/lyApplications';
import { IUsersProps } from '@ly_types/lyUsers';
import { IModulesProps } from '@ly_types/lyModules';
import { ISnackMessage } from '@ly_types/lySnackMessages';


interface IChatProps {
  userInput: string;
  onChange: (value: string) => void;
  selectedFile: File | null;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveFile: () => void;
  onSend: () => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  disabled: boolean;
  onContinue: () => void;
  isTruncated: boolean;
  showScrollButton: boolean;
  scrollBottom: () => void;
  snackMessage: (message: ISnackMessage) => void;
}

export const InputChat = forwardRef<HTMLInputElement, IChatProps>(
  (
    {
      userInput,
      onChange,
      selectedFile,
      onFileChange,
      onRemoveFile,
      onSend,
      fileInputRef,
      disabled,
      onContinue,
      isTruncated,
      showScrollButton,
      scrollBottom,
      snackMessage
    },
    ref
  ) => {
    const isSendDisabled = !userInput.trim() && !selectedFile;

    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        onSend();
      }
    }, [onSend]);


    return (
      <Div_InputChat>
        {showScrollButton && (
          <Div_ChatScrollButtons>
            <IconButton
              onClick={() => scrollBottom()}
              icon={LYArrowDownwardIcon}
            />
          </Div_ChatScrollButtons>
        )}

        {/* File Input */}
        <InputFile
          onFileChange={onFileChange}
          fileInputRef={fileInputRef}
          disabled={disabled}
          accept=".txt,.csv,.json,.md,.xml,.tsx"
          snackMessage={snackMessage}
        />

        {/* Text Field */}
        <Input
          ref={ref}
          id="user-input"
          value={userInput}
          onChange={({ target: { value } }) => onChange(value)}
          variant="outlined" // More modern look compared to "standard"
          fullWidth
          disabled={disabled}
          label={t("ai.message")}
          placeholder={t("chat.message")}
          onKeyDown={handleKeyDown}
          multiline
          rows={1}
          startAdornment={selectedFile && (<FileDisplay selectedFile={selectedFile} onRemoveFile={onRemoveFile} />)}
        />

        {/* Send Button */}
        <IconButton_Contrast
          onClick={onSend}
          disabled={isSendDisabled}
          aria-label="send message"
          icon={LYTelegramIcon}
          size={LYIconSize.large}
        />

        {/* Continue Button (if truncated) */}
        {isTruncated && (
          <IconButton
            onClick={onContinue}
            color={EStandardColor.primary}
            aria-label="continue message"
            icon={LYArrowRightIcon}
          />
        )}
      </Div_InputChat>
    );
  }
);
