/*
 * Copyright (c) 2025 NOMANA-IT and/or its affiliates.
 * All rights reserved. Use is subject to license terms.
 */
import i18n from "@ly_translations/i18n";
import { ReactNode } from "react";
import { I18nextProvider } from "react-i18next";

interface TranslationProviderProps {
  children: ReactNode;
}

export const TranslationProvider = ({ children }: TranslationProviderProps) => {
  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
};