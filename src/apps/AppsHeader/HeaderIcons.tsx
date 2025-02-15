/*
 * Copyright (c) 2022 NOMANA-IT and/or its affiliates.
 * All rights reserved. Use is subject to license terms.
 * *
 */
import { memo } from "react";
import { Div_HeaderIcons } from "@ly_styles/Div";
import { IconButton_Contrast } from "@ly_styles/IconButton";
import { LYLightModeIcon, LYDarkModeIcon, LYSmartToyIcon, LYNotificationsIcon, LYAccountCircleIcon, LYLogoutIcon } from "@ly_styles/icons";

interface IHeaderIcons {
  darkMode: boolean;
  isUserLoggedIn: boolean;
  onToggleChat: () => void;
  onToggleDarkMode: () => void;
  onToggleUserSettings:  () => void;
  onSignout: () => void;
}

export const HeaderIcons = memo((props: IHeaderIcons) => {
  const { darkMode, isUserLoggedIn, onToggleChat, onToggleDarkMode, onToggleUserSettings, onSignout } = props;

  return (
    <Div_HeaderIcons>
      <IconButton_Contrast
        aria-label="Toggle Dark Mode"
        onClick={onToggleDarkMode}
        icon={darkMode ? LYLightModeIcon : LYDarkModeIcon}
      />
      {isUserLoggedIn && (
        <IconButton_Contrast
          onClick={onToggleChat}
          icon={LYSmartToyIcon}
        />
      )}

      {isUserLoggedIn && (
        <IconButton_Contrast
           icon={LYNotificationsIcon} 
        />
      )}
      {isUserLoggedIn && (
        <IconButton_Contrast
          onClick={onToggleUserSettings}
          icon={LYAccountCircleIcon} 
        />
      )}
      {isUserLoggedIn && (
        <IconButton_Contrast
          onClick={onSignout}
          icon={LYLogoutIcon} 
        />
      )}
    </Div_HeaderIcons>
  );
});