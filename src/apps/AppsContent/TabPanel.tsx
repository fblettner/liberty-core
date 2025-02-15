/*
 * Copyright (c) 2022 NOMANA-IT and/or its affiliates.
 * All rights reserved. Use is subject to license terms.
 * *
 */
import { Div_DialogTabPanel, Div_TabPanelContent } from "@ly_styles/Div";
import { ReactNode } from "react";

interface ITabPanelProps {
    children: ReactNode;
    value: string;
    index: string;
}

export const TabPanel = ({ children, value, index, ...other }: ITabPanelProps) => (
        <Div_DialogTabPanel
            role="tabpanel"
            hidden={value !== index}
            id={`tabpanel-${index}`}
            aria-labelledby={`tab-${index}`}
            {...other}
        >
            <Div_TabPanelContent>
                {children}
            </Div_TabPanelContent>
        </Div_DialogTabPanel>

);

