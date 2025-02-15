/*
 * Copyright (c) 2022 NOMANA-IT and/or its affiliates.
 * All rights reserved. Use is subject to license terms.
 * *
 */
// React Import
import { List } from "@ly_common/List";
import Logger from "@ly_services/lyLogging";
import { lyGetMenus } from "@ly_services/lyMenus";
import { IAppsProps } from "@ly_types/lyApplications";
import { ComponentProperties } from "@ly_types/lyComponents";
import { EMenus, IMenusItem } from "@ly_types/lyMenus";
import { IModulesProps } from "@ly_types/lyModules";
import { ResultStatus } from "@ly_types/lyQuery";
import { IUsersProps } from "@ly_types/lyUsers";
import { useCallback, useEffect, useState } from "react";
import { DynamicRecursiveMenus } from "./DynamicRecursiveMenus";



// Define the types for the props
interface IDynamicMenusProps {
    openMenus: string[];
    setOpenMenus: React.Dispatch<React.SetStateAction<string[]>>;
    selectedIndex: string | null;
    setSelectedIndex: (index: string | null) => void;
    onMenuSelect: (component: ComponentProperties) => void;
    appsProperties: IAppsProps;
    userProperties: IUsersProps;
    modulesProperties: IModulesProps;
    onToggleMenusDrawer: () => void;
  }
  
  export function DynamicMenus(props: IDynamicMenusProps) {
    const { openMenus, setOpenMenus, selectedIndex, setSelectedIndex, onMenuSelect, appsProperties, userProperties, modulesProperties, onToggleMenusDrawer } = props;
    const [fetchedMenus, setFetchedMenus] = useState<IMenusItem[]>([]);

  
    // Fetch Menus with REST API
    const getMenus = useCallback(async () => {
      try {
        const menusParams = {
          appsProperties: appsProperties,
          userProperties: userProperties,
          modulesProperties: modulesProperties,
        }
        const menus = await lyGetMenus(menusParams);

        if (menus.results.status === ResultStatus.error) {
          const logger = new Logger({
            transactionName: "DynamicMenus.getMenus",
            modulesProperties: modulesProperties,
            data: menus
          });
          logger.logException("Menus: Error fetching menus");
        }
        setFetchedMenus(menus.tree);
      } catch (error) {
        const logger = new Logger({
          transactionName: "DynamicMenus.getMenus",
          modulesProperties: modulesProperties,
          data: error
        });
        logger.logException("Menus: Error fetching menus");

      }
    }, [appsProperties, userProperties]);
  
    useEffect(() => {
      getMenus();
    }, [getMenus]);
  
    return (
      <List padding={false}>
        {fetchedMenus
          .filter((menu: IMenusItem) => menu[EMenus.visible] === "Y")
          .map((item: IMenusItem) => (
            <DynamicRecursiveMenus
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
              onToggleMenusDrawer={onToggleMenusDrawer}
            />
          ))}
      </List>
    );
  }