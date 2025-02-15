/*
 * Copyright (c) 2022 NOMANA-IT and/or its affiliates.
 * All rights reserved. Use is subject to license terms.
 * *
 */

import { LYSmartToyIcon, LYLocalLibraryIcon, LYLinkIcon, LYSettingsIcon, LYLogoutIcon } from "@ly_styles/icons";
import { List_StaticMenus } from "@ly_styles/List";
import { IAppsProps, EApplications } from "@ly_types/lyApplications";
import { ComponentProperties } from "@ly_types/lyComponents";
import { EMenus } from "@ly_types/lyMenus";
import { IModulesProps } from "@ly_types/lyModules";
import { IUsersProps, EUsers } from "@ly_types/lyUsers";
import { t } from "i18next";
import { useMemo } from "react";
import { StaticRecursiveMenus } from "./StaticRecursiveMenus";

// Define the types for the props
interface IStaticMenusProps {
  openMenus: string[];
  setOpenMenus: React.Dispatch<React.SetStateAction<string[]>>;
  selectedIndex: string | null;
  setSelectedIndex: (index: string | null) => void;
  onMenuSelect: (component: ComponentProperties) => void;
  onToggleMenusDrawer: () => void;
  appsProperties: IAppsProps;
  userProperties: IUsersProps;
  modulesProperties: IModulesProps;
}

export function StaticMenus(props: IStaticMenusProps) {
  const { openMenus, setOpenMenus, selectedIndex, setSelectedIndex, onMenuSelect, appsProperties, userProperties, modulesProperties } = props;


  // Fixed data for the menu bottom
  const memoizedData = useMemo(
    () => [
      { [EMenus.key]: "lyAI", [EMenus.label]: "Liberty AI", menuIcon: LYSmartToyIcon, [EMenus.visible]: true, children: [] },
      { [EMenus.key]: "documentation", [EMenus.label]: "Documentation", menuIcon: LYLocalLibraryIcon, [EMenus.visible]: true, children: [] },
      { [EMenus.key]: "lyTools", [EMenus.label]: "Liberty Tools", menuIcon: LYLinkIcon, [EMenus.visible]: true, children: [] },
      { [EMenus.key]: "admin", [EMenus.label]: t("admin"), menuIcon: LYSettingsIcon, [EMenus.visible]: userProperties[EUsers.admin] === "Y", children: [] },
    ],
    [userProperties, appsProperties[EApplications.session]]
  );

  return (
    <List_StaticMenus padding={false}>
      {memoizedData.filter((menu) => menu[EMenus.visible]).map((item) => (
        <StaticRecursiveMenus
          key={item[EMenus.key]}
          item={item}
          openMenus={openMenus}
          setOpenMenus={setOpenMenus}
          selectedIndex={selectedIndex}
          setSelectedIndex={setSelectedIndex}
          onMenuSelect={onMenuSelect}
          appsProperties={appsProperties}
          userProperties={userProperties}
          modulesProperties={modulesProperties}
        />
      ))}
    </List_StaticMenus>
  );
}