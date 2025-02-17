/*
 * Copyright (c) 2025 NOMANA-IT and/or its affiliates.
 * All rights reserved. Use is subject to license terms.
 */
import { ReactNode } from "react";
import { AuthProvider, AuthProviderProps, useAuth as oidcUseAuth} from "react-oidc-context";

interface AuthProviderWrapperProps {
  children: ReactNode;
  oidcConfig: AuthProviderProps; 
}

export const AuthProviderWrapper = ({ children, oidcConfig }: AuthProviderWrapperProps) => {
  if (!oidcConfig) {
    throw new Error("AuthProviderWrapper requires 'oidcConfig' to be provided.");
  }

  return <AuthProvider {...oidcConfig}>{children}</AuthProvider>;
};

export const useAuth = oidcUseAuth;