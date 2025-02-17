import { ReactNode } from "react";
import { AuthProvider, AuthProviderProps, useAuth as oidcUseAuth } from "react-oidc-context";

interface AuthProviderWrapperProps {
  children: ReactNode;
  config: AuthProviderProps;
}

export const AuthProviderWrapper = ({ children, config }: AuthProviderWrapperProps) => {
  if (!config) {
    throw new Error("AuthProviderWrapper requires 'oidcConfig' to be provided.");
  }
  return <AuthProvider {...config}>{children}</AuthProvider>;
};

export const useAuth = () => {
  try {
    return oidcUseAuth(); // Normal usage
  } catch (error) {
    return {
      isAuthenticated: false,
      user: null,
      signinPopup: async () => {
        throw new Error("AuthProviderWrapper is missing! Wrap your app with <AuthProviderWrapper>.");
      },
      signoutPopup: async () => {
        throw new Error("AuthProviderWrapper is missing! Wrap your app with <AuthProviderWrapper>.");
      },
    };
  }
};