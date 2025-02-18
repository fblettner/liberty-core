/*
 * Copyright (c) 2022 NOMANA-IT and/or its affiliates.
 * All rights reserved. Use is subject to license terms.
 * *
 */

import { Collapse } from "@ly_common/Collapse";
import { List, ListItem, ListItemButton } from "@ly_common/List";
import { LYMenusExpandLessIcon, LYMenusExpandMoreIcon } from "@ly_styles/icons";
import { ListItemButton_DynamicMenus } from "@ly_styles/List";
import { Typo_ListItemText } from "@ly_styles/Typography";
import { ComponentProperties, LYComponentMode } from "@ly_types/lyComponents";
import { IFiltersProperties } from "@ly_types/lyFilters";
import { EMenus, IMenusItem } from "@ly_types/lyMenus";
import { Fragment, useCallback, useMemo, useState } from "react";

// Define type for menu items
interface IDynamicRecursiveMenus {
  item: IMenusItem;
  openMenus: string[];
  setOpenMenus: React.Dispatch<React.SetStateAction<string[]>>;
  selectedIndex: string | null;
  setSelectedIndex: (index: string | null) => void;
  onMenuSelect: (component: ComponentProperties) => void;
  onToggleMenusDrawer: () => void;
}

export function DynamicRecursiveMenus(props: IDynamicRecursiveMenus) {
  const { item, openMenus, setOpenMenus, selectedIndex, setSelectedIndex, onMenuSelect, onToggleMenusDrawer } = props;

  // Destructure item properties for cleaner code 
  const {
    [EMenus.key]: menuKey,
    [EMenus.componentID]: componentID,
    [EMenus.component]: componentType,
    [EMenus.label]: label,
    [EMenus.fixed_params]: fixedParams,
    [EMenus.content]: content,
    menuIcon,
  } = item;
  const [openChildren, setOpenChildren] = useState(openMenus.includes(menuKey));

  // Memoize filtersMENUS calculation
  const filtersMENUS = useMemo(() => {
    if (!fixedParams) return [];

    return fixedParams.split(";").map((filters: string) => {
      const filter = filters.split("=");
      return {
        header: "",
        field: filter[0],
        value: filter[1],
        type: "string",
        operator: "=",
        defined: true,
        rules: "",
        disabled: true,
        values: "",
      } as IFiltersProperties;
    });
  }, [fixedParams]);

  const toggleMenu = useCallback(
    (value: string) => {
      setOpenMenus((prevOpenMenus) =>
        openChildren ? prevOpenMenus.filter((menu) => menu !== value) : [...prevOpenMenus, value]
      );
      setOpenChildren(!openChildren);
    },
    [openChildren, setOpenMenus]
  );

  const pageChangeHandler = useCallback(
    (value: string) => {
      if (componentID != null) {
        const targetComponent: ComponentProperties = {
          id: componentID,
          type: componentType,
          label,
          filters: filtersMENUS,  // Using memoized filtersMENUS
          showPreviousButton: false,
          componentMode: LYComponentMode.find,
          isChildren: false,
          content: content
        };

        setSelectedIndex(value);
        onToggleMenusDrawer();
        onMenuSelect(targetComponent);
      }
    },
    [onToggleMenusDrawer, setSelectedIndex, onMenuSelect, componentID, filtersMENUS, componentType, label]
  );

  const buttonProps = useMemo(
    () => ({
      selected: selectedIndex === item[EMenus.key],
      onClick: () => {
        pageChangeHandler(menuKey);
        toggleMenu(menuKey);
      },
    }),
    [selectedIndex, pageChangeHandler, toggleMenu, item]
  );

  const hasChildren = useMemo(
    () => Array.isArray(item.children) && item.children.length > 0, // Accessing `children` directly
    [item.children]
  );
  return (
    <Fragment>
      <ListItem key={menuKey}>
        {!hasChildren &&
          <ListItemButton
            variant="text"
            fullWidth
            {...buttonProps}
            startIcon={item.menuIcon}
          >
            <Typo_ListItemText selected={buttonProps.selected}>
              {item[EMenus.label]}
            </Typo_ListItemText>
          </ListItemButton>
        }
        {hasChildren &&
          <ListItemButton_DynamicMenus
            variant="text"
            fullWidth
            {...buttonProps}
            startIcon={item.menuIcon}
            endIcon={openChildren ? LYMenusExpandLessIcon : LYMenusExpandMoreIcon}
            open={openChildren}
          >
            <Typo_ListItemText selected={buttonProps.selected}>
              {item[EMenus.label]}
            </Typo_ListItemText>
          </ListItemButton_DynamicMenus>
        }

      </ListItem>

      {hasChildren && (
        <Collapse in={openChildren}>
          <List padding={true}>
            {item.children?.filter((child: IMenusItem) => child[EMenus.visible] === "Y").map((child: IMenusItem) => (
              <DynamicRecursiveMenus
                key={child[EMenus.key]}
                item={child}
                openMenus={openMenus}
                setOpenMenus={setOpenMenus}
                selectedIndex={selectedIndex}
                setSelectedIndex={setSelectedIndex}
                onMenuSelect={onMenuSelect}
                onToggleMenusDrawer={onToggleMenusDrawer}
              />
            ))}
          </List>
        </Collapse>
      )}
    </Fragment>
  );
}