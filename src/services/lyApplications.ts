/*
 * Copyright (c) 2022 NOMANA-IT and/or its affiliates.
 * All rights reserved. Use is subject to license terms.
 * *
 */
/* LY_APPLICATIONS */

import { ToolsQuery } from "@ly_services/lyQuery";
import { IConnectApplicationsProps, IGetApplicationsProps } from "@ly_types/lyApplications";

export const lyGetApplications = async (props: IGetApplicationsProps) => {
    const { modulesProperties } = props
    const results = await ToolsQuery.applications(modulesProperties)
    return results
  }
  
export const lyConnectApplications = async (props: IConnectApplicationsProps)  => {
    const { pool, modulesProperties, jwt_token } = props
    
    const results = await ToolsQuery.open({
      target_pool: pool,
      modulesProperties: modulesProperties,
      jwt_token: jwt_token
    });
    return results
}