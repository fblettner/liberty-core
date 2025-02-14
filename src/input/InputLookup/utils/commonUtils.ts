/*
 * Copyright (c) 2022 NOMANA-IT and/or its affiliates.
 * All rights reserved. Use is subject to license terms.
 * *
 */
import { ISelectedRow } from "@ly_types/lyTables";
import { IDialogAction, OnChangeParams } from "@ly_utils/commonUtils";


export type OnChangeFunction = (event: OnChangeParams) => void;
export type OnCloseFunction = (event: KeyboardEvent | React.MouseEvent<HTMLTableRowElement>) => void;
export type onCloseDialogFunction = (action: IDialogAction) => void;
export type onSelectRowFunction = (action: ISelectedRow) => void;
export type onButtonCloseFunction = (event:KeyboardEvent | React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;