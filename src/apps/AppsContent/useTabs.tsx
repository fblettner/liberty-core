/*
 * Copyright (c) 2022 NOMANA-IT and/or its affiliates.
 * All rights reserved. Use is subject to license terms.
 * *
 */
import { FormsAI } from '@ly_forms/FormsAI/FormsAI';
import { FormsChart } from '@ly_forms/FormsChart/FormsChart';
import { FormsDashboard } from '@ly_forms/FormsDashboard/FormsDashboard';
import { FormsDialog } from '@ly_forms/FormsDialog/FormsDialog';
import { FormsTable } from '@ly_forms/FormsTable/FormsTable';
import { FormsTools } from '@ly_forms/FormsTools/FormsTools';
import { FormsUpload } from '@ly_forms/FormsUpload/FormsUpload';
import { Paper_Table } from '@ly_styles/Paper';
import { IAppsProps } from '@ly_types/lyApplications';
import { ComponentProperties, LYComponentViewMode, LYComponentDisplayMode, LYComponentType } from '@ly_types/lyComponents';
import { EDialogTabs } from '@ly_types/lyDialogs';
import { IModulesProps } from '@ly_types/lyModules';
import { IUsersProps } from '@ly_types/lyUsers';
import { IDialogAction } from '@ly_utils/commonUtils';
import { useState, useMemo } from 'react';

const TAB_PREFIX = 'tab-id-';
const TAB_TABLE_SUFFIX = '-table';
const TAB_COMPONENT_SUFFIX = '-component';

export interface IUseTabsProps {
  appsProperties: IAppsProps;
  userProperties: IUsersProps;
  modulesProperties: IModulesProps;
  initialTab?: ComponentProperties
}

export const useTabs = (props: IUseTabsProps) => {
  const { appsProperties, userProperties, modulesProperties, initialTab } = props
  const [tabs, setTabs] = useState<{ [EDialogTabs.sequence]: string;[EDialogTabs.component]: ComponentProperties }[]>([]);
  const [activeTab, setActiveTab] = useState<string>(initialTab ? `${TAB_PREFIX}${initialTab.type}-${initialTab.id}` : '');

  const addTab = (component: ComponentProperties) => {
    const tabSeq = `${TAB_PREFIX}${component.type}-${component.id}`;

    // Check if the tab is already open
    const existingTab = tabs.find(tab => tab[EDialogTabs.component].id === component.id && tab[EDialogTabs.component].type === component.type);
    if (existingTab) {
      // If the tab exists, make it the active tab
      setActiveTab(existingTab[EDialogTabs.sequence]);
    } else {
      // If the tab doesn't exist, add a new tab
      const newTab = {
        [EDialogTabs.sequence]: tabSeq,
        [EDialogTabs.component]: component,
      };

      setTabs(prevTabs => [...prevTabs, newTab]);
      setActiveTab(tabSeq); // Set the new tab as the active one
    }
  };

  const closeTab = (tabId: string) => {
    setTabs((prevTabs) => {
      const newTabs = prevTabs.filter((tab) => tab[EDialogTabs.sequence] !== tabId);

      // If the closed tab was the active one, set the next available tab as active
      if (tabId === activeTab && newTabs.length > 0) {
        const nextTab = newTabs[0][EDialogTabs.sequence] || '';
        setActiveTab(nextTab);
      }

      return newTabs;
    });
  };

  // New function to clear all tabs
  const clearTabs = () => {
    setTabs([]);
    setActiveTab('');
  };


  const memoizedContent = useMemo(() => {
    return tabs.map(tab => ({
      ...tab,
      content: getPageContent({component : tab[EDialogTabs.component], appsProperties: appsProperties, userProperties: userProperties, modulesProperties: modulesProperties})
    }));
  }, [tabs]);

  return {
    tabs,
    activeTab,
    addTab,
    closeTab,
    clearTabs,
    setActiveTab,
    memoizedContent,
  };
};

// Helper function to render FormsTable
interface IRenderFormsTableProps {
  component: ComponentProperties;
  viewMode: LYComponentViewMode
  appsProperties: IAppsProps;
  userProperties: IUsersProps;
  modulesProperties: IModulesProps;
}

const renderFormsTable = (props: IRenderFormsTableProps) => {
  const { component, viewMode, appsProperties, userProperties, modulesProperties } = props;
  return (
    <Paper_Table elevation={0} key={component.id + TAB_TABLE_SUFFIX}>
      <FormsTable
        key={component.id + TAB_COMPONENT_SUFFIX}
        viewMode={viewMode}
        displayMode={LYComponentDisplayMode.component}
        viewGrid={viewMode === LYComponentViewMode.list ? false : true}
        componentProperties={component}
        readonly={false}
        appsProperties={appsProperties}
        userProperties={userProperties}
        modulesProperties={modulesProperties}
      />
    </Paper_Table>
  )
};

const onDialogClose = (action: IDialogAction) => {
};

interface IGetPageContentProps {
  component: ComponentProperties;
  appsProperties: IAppsProps;
  userProperties: IUsersProps;
  modulesProperties: IModulesProps;

}

// Utility function for content rendering based on the component type
const getPageContent = (props: IGetPageContentProps) => {
  const { component, appsProperties, userProperties, modulesProperties } = props;

  

  switch (component.type) {
    case LYComponentType.FormsTable:
      const paramsTable = {
        component,
        viewMode: LYComponentViewMode.table,
        appsProperties,
        userProperties,
        modulesProperties,
      }
      return renderFormsTable(paramsTable);
    case LYComponentType.FormsTree:
      const paramsTree = {
        component,
        viewMode: LYComponentViewMode.tree,
        appsProperties,
        userProperties,
        modulesProperties,
      }
      return renderFormsTable(paramsTree);
    case LYComponentType.FormsList:
      const paramsList = {
        component,
        viewMode: LYComponentViewMode.list,
        appsProperties,
        userProperties,
        modulesProperties,
      }
      return renderFormsTable(paramsList);
    case LYComponentType.FormsDialog:
      return <FormsDialog 
        componentProperties={component} 
        onClose={onDialogClose} 
        appsProperties={appsProperties}
        userProperties={userProperties}
        modulesProperties={modulesProperties}
        reserveStatus={
          {
              record: "",
              user: "",
              status: false
          }
      }
      onReserveRecord={() => { }}
        />;
    case LYComponentType.FormsUpload:
      return <FormsUpload 
        componentProperties={component} 
        appsProperties={appsProperties}
        userProperties={userProperties}
        modulesProperties={modulesProperties}        
      />;
    case LYComponentType.FormsChart:
      return <FormsChart 
        componentProperties={component} 
        appsProperties={appsProperties}
        userProperties={userProperties}
        modulesProperties={modulesProperties}        
      />;
    case LYComponentType.FormsDashboard:
      return <FormsDashboard 
        componentProperties={component} 
        appsProperties={appsProperties}
        userProperties={userProperties}
        modulesProperties={modulesProperties}       
    />;
    case LYComponentType.FormsAI:
      return <FormsAI
        componentProperties={component}
        appsProperties={appsProperties}
        userProperties={userProperties}
        modulesProperties={modulesProperties}
        snackMessage={() => { }}
      />;
    case LYComponentType.FormsTools:
      return <FormsTools 
        modulesProperties={modulesProperties}
      />;
    default:
      return null;
  }
};