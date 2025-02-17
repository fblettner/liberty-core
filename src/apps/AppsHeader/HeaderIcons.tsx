/*
 * Copyright (c) 2022 NOMANA-IT and/or its affiliates.
 * All rights reserved. Use is subject to license terms.
 * *
 */
import { memo } from "react";
import { Div_HeaderIcons } from "@ly_styles/Div";
import { IconButton_Contrast } from "@ly_styles/IconButton";
import { LYLightModeIcon, LYDarkModeIcon, LYSmartToyIcon, LYNotificationsIcon, LYAccountCircleIcon, LYLogoutIcon } from "@ly_styles/icons";
import { useAppContext } from "@ly_context/AppProvider";
import { EUsers } from "@ly_types/lyUsers";

interface IHeaderIcons {
  darkMode: boolean;
  onToggleChat: () => void;
  onToggleDarkMode: () => void;
  onToggleUserSettings:  () => void;
  onSignout: () => void;
}

export const HeaderIcons = memo((props: IHeaderIcons) => {
  const { darkMode, onToggleChat, onToggleDarkMode, onToggleUserSettings, onSignout } = props;
  const { userProperties } = useAppContext();
  const isUserLoggedIn = userProperties[EUsers.status] === true;
  
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