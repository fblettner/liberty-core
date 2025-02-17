import { useSnackMessage } from "@ly_context/SnackMessageProvider";
import { Stack_SnackMessage } from "@ly_styles/Stack";
import { useEffect } from "react";
import { Alert } from "./Alert";


export const SnackMessage = () => {
  const { snackMessages, removeSnackMessage } = useSnackMessage();

  useEffect(() => {
    snackMessages.forEach((snack) => {
      const timer = setTimeout(() => {
        removeSnackMessage(snack.id);
      }, 6000);
      return () => clearTimeout(timer);
    });
  }, [snackMessages, removeSnackMessage]);

  return (
    <Stack_SnackMessage>
      {snackMessages.slice().reverse().map((snack) => (
        <Alert
          key={snack.id}
          variant={snack.severity}
          onClose={() => removeSnackMessage(snack.id)}
          dismissible
        >
          {snack.message}
        </Alert>
      ))}
    </Stack_SnackMessage>
  );
};