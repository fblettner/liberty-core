import { Typography } from "@ly_common/Typography";
import { Div_ContentWrapper, Div_DrawerContainer, Div_DrawerContent, Div_DrawerHeader, Div_DrawerOverlay, Div_DrawerPanel, Div_DrawerPanelDynamic } from "@ly_styles/Div";
import { IconButton_Contrast } from "@ly_styles/IconButton";
import { LYMenuOpenIcon } from "@ly_styles/icons";
import { IAppsProps } from "@ly_types/lyApplications";
import { ComponentProperties } from "@ly_types/lyComponents";
import { IModulesProps } from "@ly_types/lyModules";
import { EUsers, IUsersProps } from "@ly_types/lyUsers";
import { useCallback, useEffect, useState } from "react";
import { DashboardMenu } from "./DashboardMenu";
import { DynamicMenus } from "./DynamicMenus";
import { StaticMenus } from "./StaticMenus";

interface IAppsMenus {
  isOpen: boolean;
  appsProperties: IAppsProps;
  userProperties: IUsersProps;
  modulesProperties: IModulesProps;
  onMenuSelect: (component: ComponentProperties) => void;
  onToggleMenusDrawer: () => void;
}

// Component Implementation
export function AppsMenus(props: IAppsMenus) {
  const { isOpen, appsProperties, userProperties, modulesProperties, onMenuSelect, onToggleMenusDrawer } = props;


  const [openMenus, setOpenMenus] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<string | null>(null);

  useEffect(() => {
    setOpenMenus([])
  }, [appsProperties, userProperties[EUsers.language]]);

  const toggleDrawer = useCallback(() => {
      onToggleMenusDrawer();
  }, [onToggleMenusDrawer]);

  return (
    <>
      {/* Overlay for closing the drawer when clicking outside */}
      <Div_DrawerOverlay open={isOpen} onClick={toggleDrawer} />

      {/* Drawer */}
      <Div_DrawerContainer open={isOpen}>
        <Div_DrawerContent>
          <Div_DrawerHeader>
            <Typography variant="body2" align="center" component="a" href="https://nomana-it.fr/" target="_blank" rel="noopener noreferrer">
              Liberty © Nomana-IT {new Date().getFullYear()}.
            </Typography>
            <IconButton_Contrast onClick={toggleDrawer} icon={LYMenuOpenIcon} />
          </Div_DrawerHeader>
          <Div_ContentWrapper>
            <Div_DrawerPanel>
              <DashboardMenu
                selectedIndex={selectedIndex}
                setSelectedIndex={setSelectedIndex}
                onMenuSelect={onMenuSelect}
                onToggleMenusDrawer={onToggleMenusDrawer}
                appsProperties={appsProperties}
                userProperties={userProperties}
                modulesProperties={modulesProperties}
              />
            </Div_DrawerPanel>
            <Div_DrawerPanelDynamic>
              <DynamicMenus
                openMenus={openMenus}
                setOpenMenus={setOpenMenus}
                selectedIndex={selectedIndex}
                setSelectedIndex={setSelectedIndex}
                onMenuSelect={onMenuSelect}
                appsProperties={appsProperties}
                userProperties={userProperties}
                modulesProperties={modulesProperties}
                onToggleMenusDrawer={onToggleMenusDrawer}
              />
            </Div_DrawerPanelDynamic>
            <Div_DrawerPanel>
              <StaticMenus
                openMenus={openMenus}
                setOpenMenus={setOpenMenus}
                selectedIndex={selectedIndex}
                setSelectedIndex={setSelectedIndex}
                onMenuSelect={onMenuSelect}
                appsProperties={appsProperties}
                userProperties={userProperties}
                modulesProperties={modulesProperties}
                onToggleMenusDrawer={onToggleMenusDrawer}
              />
            </Div_DrawerPanel>
          </Div_ContentWrapper>
        </Div_DrawerContent>
      </Div_DrawerContainer>
    </>
  );
}