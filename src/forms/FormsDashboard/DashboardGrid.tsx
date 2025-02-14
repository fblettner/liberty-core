/*
 * Copyright (c) 2022 NOMANA-IT and/or its affiliates.
 * All rights reserved. Use is subject to license terms.
 * *
 */
// React Import

//Custom Import
import { DashboardCard } from '@ly_forms/FormsDashboard/DashboardCard';
import { ComponentProperties } from '@ly_types/lyComponents';
import { IDashboardState } from '@ly_types/lyDashboard';
import { DashboardGridItem } from '@ly_common/Grid';
import { useDeviceDetection, useMediaQuery } from '@ly_common/UseMediaQuery';
import { Fragment } from 'react/jsx-runtime';
import { AdvancedFlexPanels } from '@ly_common/FlexAdvanced';
import { useEffect, useMemo, useState } from 'react';
import { IAppsProps } from '@ly_types/lyApplications';
import { IUsersProps } from '@ly_types/lyUsers';
import { IModulesProps } from '@ly_types/lyModules';

export interface IDashboardGrid {
    rows: number[];
    columns: number[];
    gridSize: number;
    dashboardData: IDashboardState;
    component: ComponentProperties;
    appsProperties: IAppsProps;
    userProperties: IUsersProps;
    modulesProperties: IModulesProps;
}

export const DashboardGrid = (props: IDashboardGrid) => {
    const { rows, columns, dashboardData, appsProperties, userProperties, modulesProperties } = props;

    const isSmallScreen = useMediaQuery("(max-width:600px)");
    const isMobile = useDeviceDetection();
    const [isFullScreen, setIsFullScreen] = useState(() => isSmallScreen || isMobile); // Set fullscreen initially if small screen
    
    useEffect(() => {
        if (isSmallScreen || isMobile) {
            setIsFullScreen(true);
        }
    }, [isSmallScreen, isMobile]);

    const children = useMemo(
        () =>
            rows.map((row) =>
                columns.map((column) => {
                    return (
                        <DashboardGridItem key={`${row}-${column}`}>
                            <DashboardCard 
                                row={row} column={column} 
                                dashboardData={dashboardData} 
                                appsProperties={appsProperties}
                                userProperties={userProperties}
                                modulesProperties={modulesProperties}
                            />
                        </DashboardGridItem>
                    );
                })
            ),
        [rows, columns, dashboardData]
    );

    if (isFullScreen) {
        return (
            <Fragment>
                {rows.map((row: number) => (
                    <DashboardGridItem key={row} >
                        {columns.map((column: number) => (
                            <DashboardGridItem key={column} style={{ padding: "8px" }} >
                                <DashboardCard
                                    row={row}
                                    dashboardData={dashboardData}
                                    column={column}
                                    appsProperties={appsProperties}
                                    userProperties={userProperties}
                                    modulesProperties={modulesProperties}
                                />
                            </DashboardGridItem>
                        ))}
                    </DashboardGridItem>
                ))}
            </Fragment>
        )
    }
    return (
        <AdvancedFlexPanels rows={rows.length} columns={columns.length}>
            {children}
        </AdvancedFlexPanels>
    )
}
