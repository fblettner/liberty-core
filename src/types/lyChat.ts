/*
 * Copyright (c) 2025 NOMANA-IT and/or its affiliates.
 * All rights reserved. Use is subject to license terms.
 * *
 */

import { ComponentProperties } from "./lyComponents";
import { CDialogContent } from "./lyDialogs";

export interface IChatAction {
        id: number;
        componentID: number;
        label: string;
        type: string;
        dynamic_params: string;
        fixed_params: string;
        pool_params: string;
        dialogContent : CDialogContent;
        component: ComponentProperties;
}

export interface IChatMessage {
    sender: string;
    message: string;
    fileName?: string;
    type: 'text' | 'image' | 'file' | 'action';
    imageUrl?: string;
    action?: IChatAction[];
  }

