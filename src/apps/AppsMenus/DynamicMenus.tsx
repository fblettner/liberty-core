/*
 * Copyright (c) 2022 NOMANA-IT and/or its affiliates.
 * All rights reserved. Use is subject to license terms.
 * *
 */
// React Import
import { List } from "@ly_common/List";
import Logger from "@ly_services/lyLogging";
import { lyGetMenus } from "@ly_services/lyMenus";
import { ComponentProperties } from "@ly_types/lyComponents";
import { EMenus, IMenusItem } from "@ly_types/lyMenus";
import { ResultStatus } from "@ly_types/lyQuery";
import { useCallback, useEffect, useState } from "react";
import { DynamicRecursiveMenus } from "./DynamicRecursiveMenus";
import { useAppContext } from "@ly_context/AppProvider";



// Define the types for the props
interface IDynamicMenusProps {
    openMenus: string[];
    setOpenMenus: React.Dispatch<React.SetStateAction<string[]>>;
    selectedIndex: string | null;
    setSelectedIndex: (index: string | null) => void;
    onMenuSelect: (component: ComponentProperties) => void;
    onToggleMenusDrawer: () => void;
  }
  
  export function DynamicMenus(props: IDynamicMenusProps) {
    const { openMenus, setOpenMenus, selectedIndex, setSelectedIndex, onMenuSelect, onToggleMenusDrawer } = props;
    const { userProperties, appsProperties, modulesProperties, setUserProperties, setAppsProperties, socket } = useAppContext();
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
              onToggleMenusDrawer={onToggleMenusDrawer}
            />
          ))}
      </List>
    );
  }