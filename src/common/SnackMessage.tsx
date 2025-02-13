/*
 * Copyright (c) 2022 NOMANA-IT and/or its affiliates.
 * All rights reserved. Use is subject to license terms.
 */
// React Import
import { useEffect } from "react";

// Custom import
import { ISnackMessage } from "@ly_types/lySnackMessages";
import { Stack_SnackMessage } from "@ly_styles/Stack";
import { Alert } from "@ly_common/Alert";

interface SnackMessageProps {
  snackMessages: ISnackMessage[];
  removeMessage: (id: string) => void;
}

export const SnackMessage = ({ snackMessages, removeMessage }: SnackMessageProps) => {
    useEffect(() => {
      snackMessages.forEach((snack) => {
        const timer = setTimeout(() => {
          removeMessage(snack.id); // Automatically close after 6 seconds
        }, 6000);
        return () => clearTimeout(timer);
      });
    }, [snackMessages, removeMessage]);
  
    return (
      <Stack_SnackMessage>
        {snackMessages.slice().reverse().map((snack: ISnackMessage) => (  // Reverse the array
          <Alert
            key={snack.id}
            variant={snack.severity}
            onClose={() => removeMessage(snack.id)}
            dismissible
          >
            {snack.message}
          </Alert>
        ))}
      </Stack_SnackMessage>
    );
  };