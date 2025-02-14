/*
 * Copyright (c) 2025 NOMANA-IT and/or its affiliates.
 * All rights reserved. Use is subject to license terms.
 * *
 */

import { IColumnMetadata, ResultStatus } from "@ly_types/lyQuery";

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

export interface IEnumOption {
  [EEnumValues.value]: string;
  [EEnumValues.label]: string;
}

export interface IEnumsResult {
  columns: IColumnMetadata[];
  data: IEnumOption[];
  header: {
    [key in EEnumHeader]?: string;
  };
  status?: ResultStatus.success;
}


