/*
 * Copyright (c) 2022 NOMANA-IT and/or its affiliates.
 * All rights reserved. Use is subject to license terms.
 * *
 */

import { Divider } from "@ly_common/Divider";
import { useMediaQuery, useDeviceDetection } from "@ly_common/UseMediaQuery";
import { Div_HeaderAppBar, Div_HeaderToolbar, Div_Header } from "@ly_styles/Div";
import { IconButton_Contrast } from "@ly_styles/IconButton";
import { LYMenuIcon, LYLogoIcon } from "@ly_styles/icons";
import { Typo_AppsName } from "@ly_styles/Typography";
import { HeaderIcons } from "@ly_apps/AppsHeader/HeaderIcons";
import { socketHandler } from "@ly_utils/socket";
import { useAppContext } from "@ly_context/AppProvider";
import { EApplications, ESessionMode } from "@ly_types/lyApplications";
import { EUsers } from "@ly_types/lyUsers";
import { GlobalSettings } from "@ly_utils/GlobalSettings";
import { UIDisplayMode } from "@ly_types/common";


export interface IAppsHeaderProps {
  darkMode: boolean;
  onToggleMenusDrawer: () => void;
  onToggleDarkMode: () => void;
  onSignout: () => void;
  onToggleUserSettings: () => void;
  onToggleChat: () => void;
}

export function AppsHeader(props: IAppsHeaderProps) {
  const { darkMode, onToggleMenusDrawer, onToggleDarkMode, onToggleUserSettings, onToggleChat, onSignout } = props;
  const { userProperties, appsProperties, modulesProperties, setUserProperties, setAppsProperties, socket } = useAppContext();
  const appsName = appsProperties[EApplications.name];
  const isUserLoggedIn = userProperties[EUsers.status] === true;
  const isSmallScreen = useMediaQuery("(max-width: 600px)");
  const isMobile = useDeviceDetection();

  const handleSignout = () => {
    if (socket) {
      const socketFunctions = socketHandler(socket);
      socketFunctions.signout();
    }
    setAppsProperties({
      [EApplications.id]: 0,
      [EApplications.pool]: GlobalSettings.getDefaultPool,
      [EApplications.name]: "LIBERTY",
      [EApplications.description]: "Liberty Framework",
      [EApplications.offset]: 5000,
      [EApplications.limit]: 5000,
      [EApplications.version]: GlobalSettings.getVersion,
      [EApplications.session]: ESessionMode.session,
      [EApplications.dashboard]: -1,
      [EApplications.theme]: "liberty",
      [EApplications.jwt_token]: ""
    });
    setUserProperties({
      [EUsers.status]: false,
      [EUsers.id]: "",
      [EUsers.name]: "",
      [EUsers.email]: "",
      [EUsers.password]: "",
      [EUsers.admin]: "N",
      [EUsers.language]: "en",
      [EUsers.displayMode]: UIDisplayMode.dark,
      [EUsers.darkMode]: true,
      [EUsers.theme]: "liberty",
      [EUsers.dashboard]: -1,
      [EUsers.readonly]: "Y",
    });
    onSignout();
  }

  return (
    <Div_HeaderAppBar>
      {/* Position the Menu Icon Absolutely */}
      {isUserLoggedIn && (
        <IconButton_Contrast
          onClick={onToggleMenusDrawer}
          icon={LYMenuIcon}
          style={{ marginLeft: "8px" }}
        />
      )}

      {/* Centered Content */}
      <Div_HeaderToolbar>
        {/* Left Section */}
        <Div_Header>
          <LYLogoIcon width="32px" height="32px" />
          {!isSmallScreen && !isMobile &&
            <Typo_AppsName noWrap>
              {appsName}
            </Typo_AppsName>
          }
        </Div_Header>

        <Divider orientation="vertical" flexItem />
        <HeaderIcons
          onToggleChat={onToggleChat}
          onToggleDarkMode={onToggleDarkMode}
          darkMode={darkMode}
          onToggleUserSettings={onToggleUserSettings}
          onSignout={handleSignout}
        />
      </Div_HeaderToolbar>

    </Div_HeaderAppBar>
  );
}
