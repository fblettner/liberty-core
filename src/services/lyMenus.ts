/*
 * Copyright (c) 2022 NOMANA-IT and/or its affiliates.
 * All rights reserved. Use is subject to license terms.
 * *
 */
// React Import
import { Dispatch } from "react";
import { AuthContextProps } from "react-oidc-context";

// Custom Import
import { IAppsProps, ESessionMode, EApplications } from "@ly_types/lyApplications";
import { EUsers, IUsersProps } from "@ly_types/lyUsers";
import { IGetMenusFromApiProps, IGetMenusProps, EMenus, IMenusItem } from "@ly_types/lyMenus"
import { IFiltersProperties } from "@ly_types/lyFilters";
import { QuerySource } from "@ly_types/lyQuery";
import { GlobalSettings } from "@ly_utils/GlobalSettings";
import { ToolsQuery } from "@ly_services/lyQuery";
import { ComponentProperties, LYComponentType, LYComponentMode } from "@ly_types/lyComponents";


/* Create a tree array for application navigation, columns are hard coded */
function getMenusTree(
  arr: IMenusItem[],  
  parent: string = "0", 
  key: string = "0" 
): IMenusItem[] {  
  let output: IMenusItem[] = [];
  for (const obj of arr) {
    if (obj[EMenus.parent] === parent && obj[EMenus.child].includes(key)) {
      const children = getMenusTree(arr, obj[EMenus.child], obj[EMenus.key]);

      if (children.length) {
        obj.children = children;
      }
      output.push(obj);
    }
  }
  return output;
}

export const lyGetMenus = async (props: IGetMenusProps) => {
  const { appsProperties, userProperties, modulesProperties } = props;
  let filters: IFiltersProperties[] = []

  filters.push({
    header: "",
    field: EUsers.id,
    value: userProperties[EUsers.id],
    type: "string",
    operator: "=",
    defined: true,
    rules: null,
    disabled: false,
    values: "",
  });

  const results = await ToolsQuery.get({
    source: QuerySource.Framework,
    framework_pool: (appsProperties[EApplications.session] === ESessionMode.framework) ? GlobalSettings.getDefaultPool : appsProperties[EApplications.pool],
    query: GlobalSettings.getFramework.menus,
    sessionMode: appsProperties[EApplications.session],
    filters: filters,
    language: userProperties[EUsers.language],
    modulesProperties: modulesProperties,
    jwt_token: appsProperties[EApplications.jwt_token]
  })
  let menus = getMenusTree(results.items)

  return {results: results, tree: menus};
}

export const getMenusFromApi = async (props: IGetMenusFromApiProps) => {
  return await lyGetMenus(props);
};

export const openInNewTab = (url: string) => window.open(url, "_blank", "noreferrer");

export const handleMenuAction = (
  value: string,
  setSelectedIndex: Dispatch<string | null>,
  updateActiveComponent: (component: ComponentProperties) => void,
  application: IAppsProps,
  userProperties: IUsersProps
) => {

  switch (value) {
    case "admin":
      break;
    case "pgadmin":
      openInNewTab(GlobalSettings.getBackendURL + "pgadmin");
      break;
    case "rundeck":
      openInNewTab(GlobalSettings.getBackendURL + "rundeck");
      break;
    case "documentation":
      openInNewTab("https://docs.nomana-it.fr/liberty/getting-started/");
      break;
    case "lyAI":


      break;
    case "lyTools":
      const toolsComponent: ComponentProperties = {
        id: 9999,
        type: LYComponentType.FormsTools,
        label: "Liberty Tools",
        filters: [],
        showPreviousButton: false,
        componentMode: LYComponentMode.standard,
        isChildren: false,
      };
      setSelectedIndex(value);

      updateActiveComponent(toolsComponent);
      break;      
    default:
      break;
  }
};