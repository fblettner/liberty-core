/*
 * Copyright (c) 2022 NOMANA-IT and/or its affiliates.
 * All rights reserved. Use is subject to license terms.
 * *
 */
// Custom Import
import { GlobalSettings } from "@ly_utils/GlobalSettings";
import { IModulesProps } from "@ly_types/lyModules";
import { LYAirflowIcon, LYBugIcon, LYChartIcon, LYDatabaseIcon, LYGitIcon, LYIdentityIcon, LYLogsIcon, LYPortainerIcon, LYSocketIcon, LYReactIcon } from "@ly_styles/icons";
import { LYIconSize } from "@ly_utils/commonUtils";
import { Typography } from "@ly_common/Typography";
import { Div_FormsToolsCard } from "@ly_styles/Div";
import { GridContainer, GridItem } from "@ly_common/Grid";
import { Card, CardContent } from "@ly_common/Card";
import { CardActionArea_FormsTools } from "@ly_styles/Card";
import { useAppContext } from "@ly_context/AppProvider";


export function FormsTools() {
    const { userProperties, appsProperties, modulesProperties, setUserProperties, setAppsProperties, socket } = useAppContext();

    const tools = [
        {
            name: 'PgAdmin',
            description: 'Database management',
            link: GlobalSettings.getBackendURL + "pgadmin",
            icon: LYDatabaseIcon,
            disabled: false
        },
        {
            name: 'Airflow',
            description: 'Workflow orchestration platform',
            link: GlobalSettings.getBackendURL + "airflow/home",
            icon: LYAirflowIcon,
            disabled: false
        },
        {
            name: 'Gitea',
            description: 'Self-hosted Git service',
            link: GlobalSettings.getBackendURL + "gitea",
            icon: LYGitIcon,
            disabled: false
        },
        {
            name: 'Portainer',
            description: 'Container management tool',
            link: GlobalSettings.getBackendURL + "portainer",
            icon: LYPortainerIcon,
            disabled: false
        },
        {
            name: 'Keycloak',
            description: 'Identity and access management',
            link: GlobalSettings.getBackendURL + "oidc",
            icon: LYIdentityIcon,
            disabled: modulesProperties.login.enabled
        },
        {
            name: 'Log Viewer',
            description: 'View and analyze application logs',
            link: GlobalSettings.getBackendURL + "api/logs?format=html&page=1",
            icon: LYLogsIcon,
            disabled: false
        },
        {
            name: 'Socket Information',
            description: 'View socket connections',
            link: GlobalSettings.getBackendURL + "socket/applications?format=html",
            icon: LYSocketIcon,
            disabled: false
        },
        {
            name: 'Sentry',
            description: 'Error and performance monitoring',
            link: 'https://nomana-it.sentry.io/issues/',
            icon: LYBugIcon,
            disabled: modulesProperties.sentry && !modulesProperties.sentry.enabled
        },
        {
            name: 'Grafana',
            description: 'Monitoring and observability platform',
            link: 'https://nomanait.grafana.net/dashboards',
            icon: LYChartIcon,
            disabled: modulesProperties.grafana && !modulesProperties.grafana.enabled
        }

    ];

    return (
        <GridContainer spacing={4} columns={{ xs: 1, md: 5 }} py={2} >
            {tools.map((tool) => (
                <GridItem key={tool.name}>
                    <Card>
                        <CardActionArea_FormsTools
                            disabled={tool.disabled}
                            href={tool.link}
                            target="_blank"
                            rel="noopener noreferrer" >
                            <CardContent>
                                <Div_FormsToolsCard>
                                    <LYReactIcon icon={tool.icon} size={LYIconSize.extra_large} />
                                </Div_FormsToolsCard>
                                <Typography variant="h5" align="center" gutterBottom>
                                    {tool.name}
                                </Typography>
                                <Typography variant="body1" align="center" color="textSecondary">
                                    {tool.description}
                                </Typography>
                            </CardContent>
                        </CardActionArea_FormsTools>
                    </Card>
                </GridItem>
            ))}
        </GridContainer>

    )
}