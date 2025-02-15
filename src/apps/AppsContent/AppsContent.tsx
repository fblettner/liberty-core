/*
 * Copyright (c) 2022 NOMANA-IT and/or its affiliates.
 * All rights reserved. Use is subject to license terms.
 * *
 */
import { AppsMenus } from '@ly_apps/AppsMenus/AppsMenus';
import { Main_Content } from '@ly_styles/Main';
import { IAppsProps, EApplications } from '@ly_types/lyApplications';
import { ComponentProperties, LYComponentType, LYComponentMode } from '@ly_types/lyComponents';
import { EDialogTabs } from '@ly_types/lyDialogs';
import { IModulesProps } from '@ly_types/lyModules';
import { IUsersProps, EUsers } from '@ly_types/lyUsers';
import { t } from 'i18next';
import { Fragment, useEffect, useState } from 'react';
import { TabContainer } from './TabContainer';
import { TabPanel } from './TabPanel';
import { useTabs } from './useTabs';


export interface IAppsContentProps {
  isMenuOpen: boolean;
  onToggleMenusDrawer: () => void;
  userProperties: IUsersProps;
  appsProperties: IAppsProps;
  modulesProperties: IModulesProps;
}

export function AppsContent(props: IAppsContentProps) {
  const { isMenuOpen, onToggleMenusDrawer, appsProperties, userProperties, modulesProperties } = props;

  const { tabs, activeTab, addTab, closeTab, setActiveTab, memoizedContent, clearTabs } = useTabs({
    appsProperties,
    userProperties,
    modulesProperties,
  });
  const [tabsCleared, setTabsCleared] = useState(false);

  // Helper function to add the default dashboard tab
  const addDefaultDashboard = () => {
    const defaultDashboardId = userProperties[EUsers.dashboard] || appsProperties[EApplications.dashboard];
    if (defaultDashboardId) {
      const defaultTab: ComponentProperties = {
        id: defaultDashboardId,
        type: LYComponentType.FormsDashboard,
        label: t("dashboard"),
        filters: [],
        showPreviousButton: false,
        componentMode: LYComponentMode.find,
        isChildren: false,
      };
      addTab(defaultTab);
    }
  };

  // Track when tabs are cleared, and add the default dashboard afterward
  useEffect(() => {
    if (tabs.length === 0 && tabsCleared) {
      if (userProperties[EUsers.status]) {
        addDefaultDashboard(); // Re-add the default dashboard
      }
      setTabsCleared(false); // Reset the flag
    }
  }, [tabs, tabsCleared, userProperties[EUsers.status]]);

  // Clear tabs and set the cleared flag when session mode changes
  useEffect(() => {
    clearTabs(); // Clear all tabs when the session mode changes
    setTabsCleared(true); // Set the flag to indicate tabs are being cleared

  }, [appsProperties[EApplications.session], userProperties[EUsers.status]]);


  const handleMenuClick = (component: ComponentProperties) => addTab(component);
  const handleTabChanged = (event: React.SyntheticEvent, newValue: string) => setActiveTab(newValue);

  return (
    <Fragment>
        <Main_Content>
          <AppsMenus 
            onMenuSelect={handleMenuClick} 
            appsProperties={appsProperties}
            userProperties={userProperties}
            modulesProperties={modulesProperties}
            onToggleMenusDrawer={onToggleMenusDrawer}
            isOpen={isMenuOpen}
          />
          {tabs.length > 0 &&
            <TabContainer
              tabs={tabs}
              activeTab={activeTab}
              onTabChange={handleTabChanged}
              onCloseTab={closeTab}
            />
          }
          {memoizedContent.map(tab => (
            <TabPanel key={tab[EDialogTabs.sequence]} value={activeTab} index={tab[EDialogTabs.sequence]}>
              {tab.content}
            </TabPanel>
          ))}

        </Main_Content>
    </Fragment>
  );
}