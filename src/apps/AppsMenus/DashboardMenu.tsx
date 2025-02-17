/*
 * Copyright (c) 2022 NOMANA-IT and/or its affiliates.
 * All rights reserved. Use is subject to license terms.
 * *
 */
// React Import
import { ListItemButton } from "@ly_common/List";
import { useAppContext } from "@ly_context/AppProvider";
import { LYDashboardIcon } from "@ly_styles/icons";
import { EApplications } from "@ly_types/lyApplications";
import { ComponentProperties, LYComponentMode, LYComponentType } from "@ly_types/lyComponents";
import { EUsers } from "@ly_types/lyUsers";
import { t } from "i18next";
import { useMemo } from "react";


// Define type for the props
interface DashboardMenuProps {
    selectedIndex: string | null;
    setSelectedIndex: (index: string) => void;
    onMenuSelect: (component: ComponentProperties) => void;
    onToggleMenusDrawer: () => void;
}

export function DashboardMenu(props: DashboardMenuProps) {
    const { selectedIndex, setSelectedIndex, onMenuSelect, onToggleMenusDrawer } = props;
    const { userProperties, appsProperties, modulesProperties, setUserProperties, setAppsProperties, socket, setSocket } = useAppContext();


    // Determine the target dashboard ID
    const dashboardTargetId = userProperties[EUsers.dashboard] || appsProperties[EApplications.dashboard];
    // Memoized button props
    const buttonProps = useMemo(
        () => ({
            selected: selectedIndex === "dashboard",
            onClick: () => {
                if (dashboardTargetId != null) {
                    const targetComponent: ComponentProperties = {
                        id: dashboardTargetId,
                        type: LYComponentType.FormsDashboard,
                        label: t("dashboard"),  
                        filters: [],
                        showPreviousButton: false,
                        componentMode: LYComponentMode.find,
                        isChildren: false,
                    };

                    setSelectedIndex("dashboard");
                    onToggleMenusDrawer();
                    onMenuSelect(targetComponent);
                }
            },
            disabled: dashboardTargetId == null,  // Disable the button if no valid dashboard ID
        }),
        [onToggleMenusDrawer, selectedIndex, setSelectedIndex, dashboardTargetId, onMenuSelect]
    );

    return (
        <ListItemButton
            variant="text"
            fullWidth
            {...buttonProps}
            startIcon={LYDashboardIcon}
        >
            {t("dashboard")}
        </ListItemButton>
    );
}