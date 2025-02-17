import { ISnackMessage } from "@ly_types/lySnackMessages";
import { ESeverity } from "@ly_utils/commonUtils";
import { createContext, useContext, useState, ReactNode } from "react";
import { v4 as uuidv4 } from "uuid";


// Define context type
interface SnackMessageContextType {
  snackMessages: ISnackMessage[];
  addSnackMessage: (message: string, severity: ESeverity) => void;
  removeSnackMessage: (id: string) => void;
}

// Create Context (but don't provide default values)
const SnackMessageContext = createContext<SnackMessageContextType | undefined>(undefined);

// Provider Component
export const SnackMessageProvider = ({ children }: { children: ReactNode }) => {
  const [snackMessages, setSnackMessages] = useState<ISnackMessage[]>([]);

  // Function to add a snack message
  const addSnackMessage = (message: string, severity: any) => {
    const newMessage: ISnackMessage = {
      id: uuidv4(),
      message,
      severity,
      open: true,
    };
    setSnackMessages((prev) => [...prev, newMessage]);

    // Auto-remove message after 6 seconds
    setTimeout(() => removeSnackMessage(newMessage.id), 6000);
  };

  // Function to remove a snack message
  const removeSnackMessage = (id: string) => {
    setSnackMessages((prev) => prev.filter((msg) => msg.id !== id));
  };

  return (
    <SnackMessageContext.Provider value={{ snackMessages, addSnackMessage, removeSnackMessage }}>
      {children}
    </SnackMessageContext.Provider>
  );
};

export const useSnackMessage = () => {
  const context = useContext(SnackMessageContext);

  if (!context) {
    console.warn("⚠️ Warning: `useSnackMessage` is used outside of `SnackMessageProvider`.");
    
    // Return NOOP functions to prevent crashes
    return {
      snackMessages: [],
      addSnackMessage: () => console.warn("⚠️ `addSnackMessage` is unavailable because `SnackMessageProvider` is missing."),
      removeSnackMessage: () => console.warn("⚠️ `removeSnackMessage` is unavailable because `SnackMessageProvider` is missing."),
    };
  }

  return context;
};