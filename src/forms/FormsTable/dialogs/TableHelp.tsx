/*
 * Copyright (c) 2022 NOMANA-IT and/or its affiliates.
 * All rights reserved. Use is subject to license terms.
 * *
 */
// React Import
import { t } from "i18next";
import { useCallback } from "react";

// Custom Import
import { Button } from "@ly_common/Button";
import { ETableHeader, ITableHeader } from "@ly_types/lyTables";
import { LYCancelIcon } from "@ly_styles/icons";
import { Paper_Popup } from "@ly_styles/Paper";
import { Dialog_Actions, Dialog_Content, Dialog_Title } from "@ly_styles/Dialog";
import { Dialog } from "@ly_common/Dialog";
import { List, ListItem, ListItemText } from "@ly_common/List";

export interface ITableHelp {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>,
    tableProperties: ITableHeader;
}

export const TableHelp = (params: ITableHelp) => {
    const { open, setOpen, tableProperties } = params;

    const handleClose = useCallback(() => {
        setOpen(false);
    }, [setOpen]);

    return (
        <Dialog open={open} onClose={handleClose}>
            <Paper_Popup>
                <Dialog_Title>{t("tables.help")}</Dialog_Title>
                <Dialog_Content>
                    <List padding={false}>
                        <ListItem>
                            <ListItemText primary={`${t('tables.id')}${tableProperties[ETableHeader.id]}`} />
                        </ListItem>
                        <ListItem>
                            <ListItemText primary={`${t('tables.description')}${tableProperties[ETableHeader.description]}`} />
                        </ListItem>
                        <ListItem>
                            <ListItemText primary={`${t('tables.query')}${tableProperties[ETableHeader.queryID]}`} />
                        </ListItem>
                    </List>
                </Dialog_Content>
                <Dialog_Actions>
                    <Button variant="outlined" onClick={handleClose} startIcon={LYCancelIcon}>
                        {t('button.close')}
                    </Button>
                </Dialog_Actions>
            </Paper_Popup>
        </Dialog>

    )
}