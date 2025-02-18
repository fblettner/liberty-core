/*
 * Copyright (c) 2025 NOMANA-IT and/or its affiliates.
 * All rights reserved. Use is subject to license terms.
 * *
 */
import { AppsMenus } from '@ly_apps/AppsMenus/AppsMenus';
import { Main_Content, Main_Login } from '@ly_styles/Main';
import { EApplications } from '@ly_types/lyApplications';
import { ComponentProperties, LYComponentType, LYComponentMode } from '@ly_types/lyComponents';
import { EDialogTabs } from '@ly_types/lyDialogs';
import { EUsers } from '@ly_types/lyUsers';
import { t } from 'i18next';
import { useEffect, useState } from 'react';
import { TabContainer } from './TabContainer';
import { TabPanel } from './TabPanel';
import { useTabs } from './useTabs';
import { useAppContext } from '@ly_context/AppProvider';
import { AppsHeader } from '@ly_apps/AppsHeader/AppsHeader';
import { useMediaQuery } from '@ly_common/UseMediaQuery';
import { useTheme } from '@ly_context/ThemeProvider';
import { SnackMessage } from '@ly_common/SnackMessage';
import { FormsChatbot } from '@ly_forms/FormsChatbot/FormsChatbot';
import { AppsUser } from '@ly_apps/AppsUser/AppsUser';
import { AppsLogin } from '@ly_apps/AppsLogin/AppsLogin';
import { Div_AppsLayout } from '@ly_styles/Div';


export function AppsContent() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { userProperties, appsProperties } = useAppContext();
  const { toggleDarkMode } = useTheme();
  const [isUserOpen, setIsUserOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const { tabs, activeTab, addTab, closeTab, setActiveTab, memoizedContent, clearTabs } = useTabs({});
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

  const onToggleDarkMode = () => {toggleDarkMode(); }
  const onToggleMenusDrawer = () => { setIsMenuOpen(!isMenuOpen); }
  const onToggleUserSettings = () => { setIsUserOpen(!isUserOpen); }
  const onToggleChat = () => { setIsChatOpen(!isChatOpen); }
  const onSignout = () => { setIsChatOpen(false) }

  return (
    <Div_AppsLayout>
      <SnackMessage />
      <AppsHeader
        onToggleMenusDrawer={onToggleMenusDrawer}
        onToggleDarkMode={onToggleDarkMode}
        onToggleChat={onToggleChat}
        onToggleUserSettings={onToggleUserSettings}
        onSignout={onSignout}
      />

      {userProperties[EUsers.status] &&
        <Main_Content>
          <FormsChatbot
            isChatOpen={isChatOpen}
            handleCloseChat={onToggleChat}
          />
          <AppsUser
            openDialog={isUserOpen}
            setOpenDialog={onToggleUserSettings}
            onToggleDarkMode={onToggleDarkMode}
          />
          <AppsMenus
            onMenuSelect={handleMenuClick}
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
      }
      {!userProperties[EUsers.status] &&
        <Main_Login>
          <AppsLogin />
        </Main_Login>
      }
    </Div_AppsLayout>
  );
}