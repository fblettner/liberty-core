/*
 * Copyright (c) 2022 NOMANA-IT and/or its affiliates.
 * All rights reserved. Use is subject to license terms.
 * *
 */

import { Collapse } from "@ly_common/Collapse";
import { ListItem, ListItemButton, List } from "@ly_common/List";
import { useAppContext } from "@ly_context/AppProvider";
import { handleMenuAction } from "@ly_services/lyMenus";
import { LYMenusExpandLessIcon, LYMenusExpandMoreIcon } from "@ly_styles/icons";
import { Typo_ListItemText } from "@ly_styles/Typography";
import { ComponentProperties } from "@ly_types/lyComponents";
import { EMenus } from "@ly_types/lyMenus";
import { Fragment, useCallback, useMemo, useState } from "react";
import { IconType } from "react-icons/lib";

// Define type for menu items
interface IStaticMenuItem {
  [EMenus.key]: string;
  [EMenus.label]: string;
  menuIcon?: IconType;
  children?: IStaticMenuItem[];
}

interface IStaticRecursiveMenus {
  item: IStaticMenuItem;
  openMenus: string[];
  setOpenMenus: React.Dispatch<React.SetStateAction<string[]>>;
  selectedIndex: string | null;
  setSelectedIndex: (index: string | null) => void;
  onMenuSelect: (component: ComponentProperties) => void;
}

export function StaticRecursiveMenus(props: IStaticRecursiveMenus) {
  const { item, openMenus, setOpenMenus, selectedIndex, setSelectedIndex, onMenuSelect } = props;
  const { userProperties, appsProperties, session} = useAppContext();

  const [openChildren, setOpenChildren] = useState(openMenus.includes(item[EMenus.key]));


  const toggleMenu = useCallback(
    (value: string) => {
      setOpenMenus((prevOpenMenus) =>
        openChildren ? prevOpenMenus.filter((menu) => menu !== value) : [...prevOpenMenus, value]
      );
      setOpenChildren(!openChildren);
    },
    [openChildren, setOpenMenus]
  );

  const handleMenu = useCallback(
    (value: string) => {
      handleMenuAction(value, setSelectedIndex, onMenuSelect, session);
      if (!["admin", "lyAI", "lyTools"].includes(value)) {
        toggleMenu(value);
      }
    },
    [setSelectedIndex, onMenuSelect, toggleMenu, appsProperties, userProperties]
  );

  const buttonProps = useMemo(
    () => ({
      selected: selectedIndex === item[EMenus.key],
      onClick: () => handleMenu(item[EMenus.key]),
    }),
    [selectedIndex, item[EMenus.key], handleMenu]
  );

  const hasChildren = useMemo(() => Array.isArray(item.children) && item.children.length > 0, [item.children]);

  return (
    <Fragment>
      <ListItem key={item[EMenus.key]}>
        {!hasChildren &&
          <ListItemButton
            variant="text"
            fullWidth
            {...buttonProps}
            startIcon={item.menuIcon}
          >
            <Typo_ListItemText>
              {item[EMenus.label]}
            </Typo_ListItemText>
          </ListItemButton>
        }
        {hasChildren &&
          <ListItemButton
            variant="text"
            fullWidth
            {...buttonProps}
            startIcon={item.menuIcon}
            endIcon={openChildren ? LYMenusExpandLessIcon : LYMenusExpandMoreIcon}
          >
            <Typo_ListItemText>
              {item[EMenus.label]}
            </Typo_ListItemText>
          </ListItemButton>
        }
      </ListItem>

      {hasChildren && (
        <Collapse in={openChildren}>
          <List padding={false}>
            {item.children?.map((child) => (
              <StaticRecursiveMenus
                key={child[EMenus.key]}
                item={child}
                openMenus={openMenus}
                setOpenMenus={setOpenMenus}
                selectedIndex={selectedIndex}
                setSelectedIndex={setSelectedIndex}
                onMenuSelect={onMenuSelect}
              />
            ))}
          </List>
        </Collapse>
      )}
    </Fragment>
  );
}