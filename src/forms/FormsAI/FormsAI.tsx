/*
 * Copyright (c) 2022 NOMANA-IT and/or its affiliates.
 * All rights reserved. Use is subject to license terms.
 * *
 */
// React Import
import { useState, useEffect, useRef, memo } from 'react';
import { t } from 'i18next';

// Custom Import
import { InputChat } from '@ly_input/InputChat/InputChat';
import { handleSendMessage } from '@ly_services/lyChat';
import { IChatMessage } from '@ly_types/lyChat';
import { ComponentProperties } from '@ly_types/lyComponents';
import { handleScroll, scrollToBottom } from '@ly_utils/scrollUtils';
import { FormsChat } from '@ly_forms/FormsChat/FormsChat';
import Logger from '@ly_services/lyLogging';
import { EStandardColor } from '@ly_utils/commonUtils';
import { Div_AIError, Div_AIProgress } from '@ly_styles/Div';
import { Paper_FormsAI } from '@ly_styles/Paper';
import { Stack_FormsAI } from '@ly_styles/Stack';
import { CircularProgress } from "@ly_common/CircularProgress";
import { Button } from '@ly_common/Button';
import { QueryRoute } from '@ly_types/lyQuery';
import { send_to_ai } from '@ly_utils/openai';
import { useAppContext } from '@ly_context/AppProvider';

interface IMemoizedFormsChatProps {
  chat: IChatMessage;
  addMessageToHistory: (message: IChatMessage) => void;
}

const MemoizedFormsChat = memo((props: IMemoizedFormsChatProps) => {
  const { chat, addMessageToHistory } = props;
  return (
    <FormsChat
      chat={chat}
      addMessageToHistory={addMessageToHistory}
    />
  )
})

interface IFormsAIProps {
  componentProperties: ComponentProperties
}

export function FormsAI(props: IFormsAIProps) {
  const { componentProperties } = props;
  const { userProperties, appsProperties, modulesProperties, setUserProperties, setAppsProperties, socket, setSocket } = useAppContext();
  const [userInput, setUserInput] = useState<string>('');
  const [chatHistory, setChatHistory] = useState<IChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showScrollButton, setShowScrollButton] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false); // Track if there's an error
  const [retryLoading, setRetryLoading] = useState<boolean>(false);
  const [isTruncated, setIsTruncated] = useState(false);

  const isFirstRender = useRef(true);
  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const autoScrollEnabledRef = useRef(true);


  const SCROLL_THRESHOLD = 100;

  const scrollBottom = () => scrollToBottom(chatContainerRef);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Initialize chat on the first render
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      initChat();
    }
  }, [componentProperties.id]);

  // Helper function to handle errors
  const handleError = (error: unknown) => {
    let errorMessage = t("ai.error"); // Default error message

    if (error instanceof Error) {
      // Handle standard Error
      errorMessage = error.message;
    } else if (typeof error === "object" && error !== null && "response" in error) {
      // Check for Axios-like error structure
      const err = error as { response?: { data?: { message?: string } } };
      errorMessage = err.response?.data?.message || t("ai.error");
    }

    addMessageToHistory({ sender: 'Bot', message: errorMessage, type: 'text' });
    setError(true);
  };

  // Initial chat setup
  const initChat = async () => {
    setIsLoading(true);
    setError(false); // Reset error before attempting to fetch

    try {
      const botResponse = await send_to_ai(QueryRoute.ai_welcome, [],
        modulesProperties
      );

      const botMessage: IChatMessage = { sender: 'Bot', message: botResponse.message, type: 'text' };
      addMessageToHistory(botMessage);
    } catch (error) {
      const logger = new Logger({
        transactionName: "FormsAI.initChat",
        modulesProperties: modulesProperties,
        data: error
      });
      logger.logException("AI: Error fetching bot response");

      handleError(error); // Handle errors gracefully
    }

    setIsLoading(false);
  };

  // Scroll to bottom when chat history updates
  useEffect(() => {
    if (autoScrollEnabledRef.current) {
      requestAnimationFrame(() => scrollBottom());
    }
  }, [chatHistory]);

  // Function to add messages to chat history
  const addMessageToHistory = (message: IChatMessage) => {
    setChatHistory((prev) => [...prev, message]);
  };

  const handleSend = async () => {
    await handleSendMessage(
      appsProperties,
      userProperties,
      modulesProperties,
      userInput,
      selectedFile,
      chatHistory,
      addMessageToHistory,
      setUserInput,
      setSelectedFile,
      scrollBottom,
      setIsLoading,
      setIsTruncated
    );
  };

  return (
    <Stack_FormsAI>
      <Paper_FormsAI
        elevation={1}
        ref={chatContainerRef}
        onScroll={() => handleScroll(chatContainerRef, autoScrollEnabledRef, setShowScrollButton, SCROLL_THRESHOLD)}
      >
        {chatHistory.map((chat, index) => (
          <MemoizedFormsChat 
            key={index} 
            chat={chat} 
            addMessageToHistory={addMessageToHistory}
          />
        ))}

        {isLoading && (
          <Div_AIProgress>
            <CircularProgress />
          </Div_AIProgress>
        )}



        {error && (
          <Div_AIError>
            <Button
              variant="contained"
              color={EStandardColor.error}
              onClick={async () => {
                setRetryLoading(true);
                await initChat();
                setRetryLoading(false);
              }}
              disabled={retryLoading}
              startIcon={retryLoading && <CircularProgress size={20} color="inherit" />}
            >
              {retryLoading ? '' : t('ai.tryAgain')}
            </Button>
          </Div_AIError>
        )}
      </Paper_FormsAI>

      <InputChat
        ref={inputRef}
        disabled={isLoading}
        userInput={userInput}
        onChange={setUserInput}
        selectedFile={selectedFile}
        onFileChange={e => setSelectedFile(e.target.files?.[0] ?? null)}
        onRemoveFile={() => setSelectedFile(null)}
        onSend={handleSend}
        fileInputRef={fileInputRef}
        isTruncated={isTruncated}
        scrollBottom={scrollBottom}
        showScrollButton={showScrollButton}
        onContinue={async () => {
          await handleSendMessage(
            appsProperties,
            userProperties,
            modulesProperties,
            "Message truncated, continue",
            null,
            chatHistory,
            addMessageToHistory,
            setUserInput,
            setSelectedFile,
            scrollBottom,
            setIsLoading,
            setIsTruncated
          );
        }}
      />
    </Stack_FormsAI>
  );
}