/*
 * Copyright (c) 2025 NOMANA-IT and/or its affiliates.
 * All rights reserved. Use is subject to license terms.
 * *
 */

import { ResultStatus } from "@ly_types/lyQuery";
import { ESessionMode, IAppsProps } from "@ly_types/lyApplications";
import { IUsersProps } from "@ly_types/lyUsers";
import { IModulesProps } from "@ly_types/lyModules";

export enum EEnumHeader {
  id = "ENUM_ID",
  label = "ENUM_LABEL",
  display_add = "ENUM_DISPLAY_ADD"
}

export enum EEnumValues {
  id = "ENUM_ID",
  value = "VAL_ENUM",
  label = "VAL_LABEL",
  display_add = "ENUM_DISPLAY_ADD"
}

export interface IEnumColumn {
  header: string;
  field: string;
}

export interface IEnumOption {
  [EEnumValues.value]: string;
  [EEnumValues.label]: string;
}

export interface IEnumsResult {
  columns: IEnumColumn[];
  data: IEnumOption[];
  header: {
    [key in EEnumHeader]?: string;
  };
  status?: ResultStatus;
}

export interface IEnumProps {
  appsProperties: IAppsProps;
  userProperties: IUsersProps;
  modulesProperties: IModulesProps;
  [EEnumHeader.id]: number;
  sessionMode?: ESessionMode;
}
