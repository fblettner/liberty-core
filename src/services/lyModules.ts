/*
 * Copyright (c) 2022 NOMANA-IT and/or its affiliates.
 * All rights reserved. Use is subject to license terms.
 * *
 */

import { ToolsQuery } from "@ly_services/lyQuery";

export type LyGetModulesFunction = () => Promise<any>;

export const lyGetModules = async () => {
  const results = await ToolsQuery.modules({
      sentry: {enabled: false, params: null}, 
      debug: {enabled: false, params: null},
      menus: {enabled: false, params: null},
      login: {enabled: false, params: null},
      grafana: {enabled: false, params: null},
      dev: {enabled: false, params: null}
  })
  return results.items;
}
