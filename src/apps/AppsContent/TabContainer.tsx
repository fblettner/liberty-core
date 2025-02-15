/*
 * Copyright (c) 2022 NOMANA-IT and/or its affiliates.
 * All rights reserved. Use is subject to license terms.
 * *
 */
import { Div_AppsTabsHeader } from '@ly_styles/Div';
import { IconButton_TabClose } from '@ly_styles/IconButton';
import { LYCloseIcon } from '@ly_styles/icons';
import { Tabs_Dialogs, Tab_Dialogs } from '@ly_styles/Tabs';
import { EDialogTabs } from '@ly_types/lyDialogs';
import { LYIconSize } from '@ly_utils/commonUtils';
import React from 'react';

// Import Custom
interface ITabContainerProps {
  tabs: Array<{ [EDialogTabs.sequence]: string; [EDialogTabs.component]: { label: string } }>;
  activeTab: string;
  onTabChange: (event: React.SyntheticEvent, newValue: string) => void;
  onCloseTab: (tabId: string) => void;
}

export const TabContainer = ({ tabs, activeTab, onTabChange, onCloseTab }: ITabContainerProps) => {
  
    // Function to handle the close button click
    const handleCloseTab = (tabId: string, event: React.MouseEvent) => {
      event.stopPropagation(); // Prevent the tab from being selected when clicking the close button
      onCloseTab(tabId);
    };

  return (
  <Tabs_Dialogs
    variant="scrollable"
    scrollButtons
    value={activeTab}
    onChange={onTabChange}
  >
    {tabs.map((tab) => (
      <Tab_Dialogs
        key={tab[EDialogTabs.sequence]}
        label={
          <Div_AppsTabsHeader>
            {tab[EDialogTabs.component].label}
            <IconButton_TabClose 
              onClick={(e) => handleCloseTab(tab[EDialogTabs.sequence], e)}
              icon={LYCloseIcon} 
              size={LYIconSize.small}
            />
          </Div_AppsTabsHeader>
        }
        value={tab[EDialogTabs.sequence]}
        id={`tab-${tab[EDialogTabs.sequence]}`}
      />
    ))}
  </Tabs_Dialogs>
);
}


