/*
 * Copyright (c) 2022 NOMANA-IT and/or its affiliates.
 * All rights reserved. Use is subject to license terms.
 * *
 */
// React Import
import { useCallback, useEffect, useRef, useState } from "react";
import { useDropzone } from 'react-dropzone';
import { t } from "i18next";
import { functionalUpdate, getCoreRowModel, getSortedRowModel, SortingState, useReactTable, getGroupedRowModel, getExpandedRowModel, getFilteredRowModel, ColumnFiltersState, CellContext } from "@tanstack/react-table";

// Custom Import
import { Button } from "@ly_common/Button";
import { ToolsDictionary } from "@ly_services/lyDictionary";
import { ToolsQuery } from "@ly_services/lyQuery";
import { lyGetTableProperties } from "@ly_services/lyTables";
import { EApplications, } from "@ly_types/lyApplications";
import { ComponentProperties, LYComponentEvent, LYComponentType } from "@ly_types/lyComponents";
import { EDictionaryType, EDictionaryRules } from "@ly_types/lyDictionary";
import { QuerySource, ResultStatus } from "@ly_types/lyQuery";
import { ETableHeader, IColumnsProperties, ITableRow, TablesGridHardCoded } from "@ly_types/lyTables";
import { EUsers } from "@ly_types/lyUsers";
import { EStandardColor, ESeverity, IContentValue, IErrorState, IRestData, ActionsType } from "@ly_utils/commonUtils";
import { AlertMessage } from "@ly_common/AlertMessage";
import { LoadingIndicator } from "@ly_common/LoadingIndicator";
import { ClipboardFeature } from "@ly_forms/FormsTable/features/ClipBoard";
import { DensityFeature } from "@ly_forms/FormsTable/features/Density";
import { RowSelectionFeature } from "@ly_forms/FormsTable/features/RowSelection";
import { TableEditFeature } from "@ly_forms/FormsTable/features/TableEdit";
import { GlobalFilterFeature } from "@ly_forms/FormsTable/features/GlobalFilter";
import { ITableState, LYTableInstance } from "@ly_forms/FormsTable/utils/tanstackUtils";
import { TableGrid, TableGridRef } from "@ly_forms/FormsTable/views/TableGrid";
import { IFiltersProperties } from "@ly_types/lyFilters";
import { importExcelFiles } from "@ly_forms/FormsTable/utils/importUtils";
import { LYCancelIcon, LYCheckIcon, LYCloseIcon, LYCloudUploadIcon, LYReactIcon, LYSaveIcon } from "@ly_styles/icons";
import { LYIconSize } from "@ly_utils/commonUtils";
import { Typography } from "@ly_common/Typography";
import { Div_DialogToolbarButtons } from "@ly_styles/Div";
import { Paper_Dialogs, Paper_DialogToolbar, Paper_UploadFile } from "@ly_styles/Paper";
import { Stack_Dialogs, Stack_Table } from "@ly_styles/Stack";
import { useAppContext } from "@ly_context/AppProvider";
import { lyGetEventsComponent } from "@ly_services/lyEvents";
import { EEventComponent, IEventComponent } from "@ly_types/lyEvents";
import { CDialogContent, IDialogContent } from "@ly_types/lyDialogs";
import { convertRowtoContent } from "@ly_forms/FormsTable/utils/commonUtils";
import { InputAction, InputActionProps } from "@ly_input/InputAction";
import { IOriginalObject } from "@ly_forms/FormsAI/utils/tableUtils";
import { IActionsStatus } from "@ly_types/lyActions";
import { ENextNumber } from "@ly_types/lyNextNum";
import { ESequence } from "@ly_types/lySequence";

type Props = Readonly<{
    componentProperties: ComponentProperties;
    onClose?: (action: { event: LYComponentEvent }) => void;
}>;

export function FormsUpload(props: Props) {
    const { componentProperties, onClose } = props;
    const { userProperties, appsProperties, modulesProperties, addSnackMessage, getTables } = useAppContext();

    const component = useRef<ComponentProperties>(componentProperties);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [errorState, setErrorState] = useState<IErrorState>({ message: '', open: false });
    const importColumns = useRef([]);
    const tableProperties = useRef(null);
    const [tableState, setTableState] = useState<ITableState>({
        sorting: [] as SortingState,
        density: 'sm',
        columnsVisibility: {},
        selectedRowModel: {},
        tableEdit: {
            unsavedRows: {},
            rowsBeforeChange: {},
            isNew: {},
            editMode: false,
            hasUnsavedRows: false
        },
        clipboard: {
            content: "",
            hasClipboardContent: false,
        },
        tableData: {
            table_id: component.current.id,
            rows: [],
            columns: [],
            columnsVisibility: {}
        },
        filteredRows: [],
        globalFilter: ""
    });
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
        [],
    );
    const apiRef = useRef<TableGridRef>(null);
    const rowsFilterRef = useRef<IFiltersProperties[]>([]);
    const [rowCount, setRowCount] = useState(0);
    const [eventState, setEventState] = useState<InputActionProps[] | null>([]);

    // Use Effect
    useEffect(() => {
        setIsLoading(true);
        const init = async () => {
            component.current = props.componentProperties
            setErrorState({ open: false, message: "" })
            await initDialog();
            setIsLoading(false);
        }
        init();

    }, [componentProperties.id]);

    const initDialog = async () => {
        setIsLoading(true);

        const tables = getTables && getTables.getProperties ? await getTables.getProperties(componentProperties.id) : await lyGetTableProperties({
            appsProperties: appsProperties,
            userProperties: userProperties,
            [ETableHeader.id]: component.current.id,
            getAllColumns: true,
            modulesProperties: modulesProperties
        });
        importColumns.current = tables.columns
        tableProperties.current = tables.tableProperties;

        if (tables.status === ResultStatus.error) {
            setErrorState({ open: true, message: tables.items[0].message, severity: ESeverity.error });
        } else {
            let columnsProperties: IColumnsProperties[] = [];

            tables.columns.forEach((item: IColumnsProperties) => {
                switch (item.type) {
                    case EDictionaryType.date:
                        columnsProperties.push({
                            accessorKey: (item.target === null) ? item.field : item.target,
                            header: item.header,
                            type: "date",
                            field: (item.target === null) ? item.field : item.target,
                            target: item.target,
                            visible: item.visible,
                            filter: item.filter,
                            operator: item.operator,
                            rules: item.rules,
                            rulesValues: item.rulesValues,
                            default: item.default,
                            editable: item.editable,
                            disabled: item.disabled,
                            required: item.required,
                            dynamic_params: item.dynamic_params,
                            fixed_params: item.fixed_params,
                            pool_params: item.pool_params,
                            output_params: item.output_params,
                            key: item.key,
                            col_cdn_id: item.col_cdn_id,
                            cell: (cell: CellContext<ITableRow, IContentValue>) => {
                                const value = new Date(cell.getValue() as string);
                                return value.toLocaleDateString(); // Format date
                            },
                        })
                        break;
                    case EDictionaryType.boolean:
                        columnsProperties.push({
                            accessorKey: (item.target === null) ? item.field : item.target,
                            header: item.header,
                            type: "boolean",
                            field: (item.target === null) ? item.field : item.target,
                            target: item.target,
                            visible: item.visible,
                            filter: item.filter,
                            operator: item.operator,
                            rules: item.rules,
                            rulesValues: item.rulesValues,
                            default: item.default,
                            editable: item.editable,
                            disabled: item.disabled,
                            required: item.required,
                            dynamic_params: item.dynamic_params,
                            fixed_params: item.fixed_params,
                            pool_params: item.pool_params,
                            output_params: item.output_params,
                            key: item.key,
                            col_cdn_id: item.col_cdn_id,
                            cell: (cell: CellContext<ITableRow, IContentValue>) => {
                                const isActive = (item.rulesValues.split(";").includes(cell.getValue() as string)) ? true : false;
                                return isActive ? <LYReactIcon icon={LYCheckIcon} color={EStandardColor.primary} size={LYIconSize.small} /> : <LYReactIcon icon={LYCloseIcon} color={EStandardColor.secondary} size={LYIconSize.small} />;
                            },
                        })
                        break;
                    default:
                        let itemDefault = {
                            accessorKey: (item.target === null) ? item.field : item.target,
                            header: item.header,
                            type: item.type,
                            field: (item.target === null) ? item.field : item.target,
                            target: item.target,
                            visible: item.visible,
                            filter: item.filter,
                            operator: item.operator,
                            rules: item.rules,
                            rulesValues: item.rulesValues,
                            default: item.default,
                            editable: item.editable,
                            disabled: item.disabled,
                            required: item.required,
                            dynamic_params: item.dynamic_params,
                            fixed_params: item.fixed_params,
                            pool_params: item.pool_params,
                            output_params: item.output_params,
                            key: item.key,
                            col_cdn_id: item.col_cdn_id,

                        }
                        columnsProperties.push(itemDefault);
                }
            })

            // Update the columns state
            updateTableState('tableData', {
                ...tableState.tableData,
                columns: columnsProperties
            });
        }
    };

    const onDrop = useCallback((acceptedFiles: File[]) => {
        // Handle dropped files here, e.g., upload or process them
        _fileListener(acceptedFiles);
    }, [tableState.tableData.columns]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        multiple: false,
        accept: { 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'] }
    });

    const _fileListener = async (files: File[]) => {
        const params = {
            files: files,
            appsProperties: appsProperties,
            userProperties: userProperties,
            modulesProperties: modulesProperties,
            importColumns: importColumns.current,
            setErrorState: setErrorState,
            setIsLoading: setIsLoading,
            updateTableState: updateTableState,
            tableState: tableState,
            component: component.current
        }
        setIsLoading(true)
        setErrorState({ open: false, message: "" })
        const importData = await importExcelFiles(params);
        // Update the rows state
        setRowCount(importData.length);
        updateTableState('filteredRows', importData);
        updateTableState('tableData', {
            ...tableState.tableData,
            rows: importData
        });

        setIsLoading(false);
    }

    const handleCloseDialog = () => {
        if (onClose)
            onClose({ event: LYComponentEvent.Cancel })
    }

    const handleSaveDialog = async () => {
        let result = await saveDataAPI()
    }

    const onEventEnd = useCallback((event: IActionsStatus & { id?: number }) => {
        if (onClose && eventState?.length === 0)
            onClose({ event: LYComponentEvent.Cancel })
        else {
            if (event.id != null) {
                setEventState(prev =>
                    prev
                        ? prev.filter(action => action.id !== event.id)
                        : prev
                );
            }
        }
    }, []);

    const saveDataAPI = async () => {
        setIsLoading(true)
        setErrorState({ open: false, message: "" })
        let errorMessage: IErrorState[] = [];
        let rowNumber = 1;

        // If audit is enabled, save entire table before uploading file
        if (component.current.tableProperties?.[ETableHeader.audit]) {
            let result;
            result = await ToolsQuery.audit(
                component.current.tableProperties?.[ETableHeader.dbName],
                userProperties[EUsers.id],
                {
                    source: QuerySource.Query,
                    framework_pool: appsProperties[EApplications.pool],
                    query: component.current.tableProperties?.[ETableHeader.queryID],
                    sessionMode: appsProperties[EApplications.session],
                    modulesProperties: modulesProperties,
                    jwt_token: appsProperties[EApplications.jwt_token]
                },
                {}
            )

            if (result.status === ResultStatus.error) {
                setErrorState({ open: true, message: result.items[0].message, severity: ESeverity.error })
                setIsLoading(false)
                return ResultStatus.error
            } else {
                setErrorState({ open: true, message: t("files.success"), severity: ESeverity.success })
                setIsLoading(false)
            }
        }
        let eventComponent: InputActionProps[] = []

        await Promise.all(tableState.tableData.rows.map(async (item) => {
            let restData: IRestData = {}
            await Promise.all(importColumns.current.filter((columns: IColumnsProperties) => columns.target !== null).map(async (column: IColumnsProperties) => {
                switch (column.rules) {
                    case EDictionaryRules.boolean:
                        restData[column.target] = item[(column.target === null) ? column.field : column.target] ?? "N";
                        break;
                    case EDictionaryRules.login:
                        restData[column.target] = userProperties[EUsers.id];
                        break;
                    case EDictionaryRules.sysdate:
                    case EDictionaryRules.current_date:
                        if (column.type === EDictionaryType.jdedate)
                            restData[column.target] = ToolsDictionary.DateToJde(new Date().toISOString());
                        else
                            restData[column.target] = new Date().toISOString();
                        break;
                    case EDictionaryRules.default:
                        restData[column.target] = (item[(column.target === null) ? column.field : column.target] !== null)
                            ? item[(column.target === null) ? column.field : column.target]
                            : column.rulesValues;
                        break;
                    case EDictionaryRules.sequence:
                        restData[column.target] = item[(column.target === null) ? column.field : column.target] ?? await ToolsDictionary.getSequence({
                            appsProperties: appsProperties,
                            [ESequence.id]: parseInt(column.rulesValues),
                            data: {},
                            modulesProperties: modulesProperties
                        })
                        break; 
                    case EDictionaryRules.nextNumber:
                        restData[column.target] = item[(column.target === null) ? column.field : column.target] ?? await ToolsDictionary.getNextNumber({
                            appsProperties: appsProperties,
                            userProperties: userProperties,
                            [ENextNumber.id]: column.rulesValues,
                            overrideQueryPool: component.current.overrideQueryPool,
                            modulesProperties: modulesProperties
                        })
                        break;                        
                    default:
                        switch (column.type) {
                            case EDictionaryType.jdedate:
                                let value = item[(column.target === null) ? column.field : column.target];
                                const jdeDate = value ? ToolsDictionary.DateToJde(value as string) : 0;
                                restData[column.target] = jdeDate
                                break;
                            default:
                                restData[column.target] = item[(column.target === null) ? column.field : column.target];
                        }
                }
            }))
            let result;
            result = await ToolsQuery.put({
                source: QuerySource.Query,
                framework_pool: appsProperties[EApplications.pool],
                query: component.current.tableProperties![ETableHeader.queryID],
                sessionMode: appsProperties[EApplications.session],
                override_target_pool: component.current.overrideQueryPool,
                modulesProperties: modulesProperties,
                jwt_token: appsProperties[EApplications.jwt_token]
            },
                JSON.stringify(restData));
            if (result.status === ResultStatus.error) {
                errorMessage.push(
                    {
                        open: true,
                        severity: ESeverity.error,
                        message: "Row: " + rowNumber + " | " + result.items[0].message,

                    });
            } else {
                // Get Event Component
                const getEvents = await lyGetEventsComponent({
                    appsProperties,
                    userProperties,
                    modulesProperties,
                    [EEventComponent.component]: LYComponentType.FormsTable,
                    [EEventComponent.componentID]: component.current.id,
                    [EEventComponent.eventID]: 2
                });

                if (getEvents.status === ResultStatus.success && getEvents.items.length > 0) {
                    let dialogContent = new CDialogContent()
                    dialogContent.fields = convertRowtoContent(item) as IDialogContent;

                    getEvents.items.forEach((item: IEventComponent) => {
                        eventComponent.push({
                            id: dialogContent.fields.ROW_ID.value as number,
                            actionID: item[EEventComponent.actionID],
                            type: ActionsType.event,
                            dialogContent: dialogContent,
                            dynamic_params: "",
                            fixed_params: "",
                            label: "On save",
                            status: onEventEnd,
                            disabled: false,
                            component: component.current,
                        });
                    });

                }

            }
            rowNumber++;
        }));

        setIsLoading(false)
        if (errorMessage.length > 0) {
            setErrorState(errorMessage[0])
            return ResultStatus.error
        }
        else {
            addSnackMessage(t("files.success"), ESeverity.success)
            setEventState(eventComponent);
            if (eventComponent.length === 0 && onClose) {
                onClose({ event: LYComponentEvent.Cancel })
            }
            return ResultStatus.success
        }
    }

    const table: LYTableInstance<ITableRow> = useReactTable({
        _features: [DensityFeature, RowSelectionFeature, TableEditFeature, ClipboardFeature, GlobalFilterFeature],
        data: tableState.filteredRows,
        columns: tableState.tableData.columns,
        getGroupedRowModel: getGroupedRowModel(),
        getExpandedRowModel: getExpandedRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        filterFns: {
            strictEquals: (row, columnId, filterValue) => {
                const cellValue = row.getValue(columnId);
                return cellValue === filterValue;;
            }
        },
        state: {
            sorting: tableState.sorting,
            density: tableState.density,
            columnVisibility: tableState.tableData.columnsVisibility,
            rowSelection: tableState.selectedRowModel,
            tableEdit: tableState.tableEdit,
            clipboard: tableState.clipboard,
            globalFilter: tableState.globalFilter,
            columnFilters
        },
        onSortingChange: (newSorting) =>
            setTableState((prevState) => ({
                ...prevState,
                sorting: functionalUpdate(newSorting, prevState.sorting),
            })),
        onDensityChange: (updaterOrValue) =>
            setTableState((prevState) => ({
                ...prevState,
                density: typeof updaterOrValue === 'function'
                    ? updaterOrValue(prevState.density)
                    : updaterOrValue,
            })),
        onRowSelectionChange: (updaterOrValue) => {
            setTableState((prevState) => ({
                ...prevState,
                selectedRowModel: typeof updaterOrValue === 'function'
                    ? updaterOrValue(prevState.selectedRowModel)
                    : updaterOrValue,
            }))
        },
        onClipboardChange: (updaterOrValue) =>
            setTableState((prevState) => ({
                ...prevState,
                clipboard: typeof updaterOrValue === 'function'
                    ? updaterOrValue(prevState.clipboard)
                    : updaterOrValue,
            })),
        onTableEditChange: (updaterOrValue) => {
            setTableState((prevState) => ({
                ...prevState,
                tableEdit: typeof updaterOrValue === 'function'
                    ? updaterOrValue(prevState.tableEdit)
                    : updaterOrValue,
            }))
        },
        onColumnVisibilityChange: (updaterOrValue) => {
            setTableState((prevState) => ({
                ...prevState,
                tableData: {
                    ...prevState.tableData,
                    columnsVisibility: typeof updaterOrValue === 'function'
                        ? updaterOrValue(prevState.tableData.columnsVisibility)
                        : updaterOrValue,
                }
            }));
        },
        onGlobalFilterChange: (updaterOrValue) => {
            setTableState((prevState) => {
                const newGlobalFilter = typeof updaterOrValue === 'function'
                    ? updaterOrValue(prevState.globalFilter)
                    : updaterOrValue;

                const filteredRows = table.applyGlobalFilter(newGlobalFilter, tableState.tableData.rows);
                return {
                    ...prevState,
                    globalFilter: newGlobalFilter,  // Update global filter
                    filteredRows,  // Update the filtered rows based on the new global filter
                };
            });
        },
        getRowId: (row) => row[TablesGridHardCoded.row_id],
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        columnResizeMode: "onChange",
        columnResizeDirection: "ltr",

        onTableDataChange: (updaterOrValue) => {
            setTableState((prevState) => ({
                ...prevState,
                tableData: typeof updaterOrValue === 'function'
                    ? updaterOrValue(prevState.tableData)
                    : updaterOrValue,
            }))
        }
    });

    const updateTableState = <K extends keyof ITableState>(key: K, value: ITableState[K]) => {
        setTableState((prevState) => ({
            ...prevState,
            [key]: value, // Dynamically set the state key with the new value
        }));
    };
    const handleMessageClose = useCallback(() => { }, [setErrorState]);

    // Memoized handleCellMouseDown function
    const handleSelect = () => { };
    const handleCellMouseDown = () => { };
    const handleTouchStart = () => { };
    const handleTouchEnd = () => { };
    const handleDoubleClick = () => { };
    const handleCancelQuery = () => { };
    const handleSave = () => { };
    const handleDiscard = () => { };

    if (isLoading) return <LoadingIndicator />
    return (
        <Stack_Dialogs>
            <Paper_Dialogs elevation={0}>
                <AlertMessage severity={errorState.severity} message={errorState.message} open={errorState.open} onClose={handleMessageClose} />

                {!component.current.isChildren &&
                    <Paper_DialogToolbar elevation={0}>
                        <Div_DialogToolbarButtons>
                            <Button disabled={false} variant="outlined" onClick={handleCloseDialog} startIcon={LYCancelIcon}>
                                {t('button.cancel')}
                            </Button>
                            <Button disabled={errorState.open} variant="outlined" onClick={handleSaveDialog} startIcon={LYSaveIcon}>
                                {t('button.save')}
                            </Button>
                        </Div_DialogToolbarButtons>
                    </Paper_DialogToolbar>
                }
                <Paper_UploadFile
                    elevation={0}
                    {...getRootProps()}
                >
                    <input {...getInputProps()} />
                    {isDragActive ? (
                        <Typography variant="subtitle1">Drop the file here</Typography>
                    ) : (
                        <Typography variant="subtitle1">Drag and drop a file here or click to select</Typography>
                    )}
                    <LYReactIcon icon={LYCloudUploadIcon} size={LYIconSize.extra_large} />
                </Paper_UploadFile>
                <Stack_Table>
                    {eventState !== null && eventState.length > 0 &&
                        eventState.map((item: InputActionProps) => (
                            <InputAction
                                key={item.id} // Add a unique key
                                id={item.id}
                                actionID={item.actionID}
                                type={item.type}
                                dialogContent={item.dialogContent}
                                dynamic_params={item.dynamic_params}
                                fixed_params={item.fixed_params}
                                label={item.label}
                                status={item.status}
                                disabled={item.disabled}
                                component={item.component}
                            />
                        ))
                    }
                    <TableGrid
                        ref={apiRef}
                        isLoading={isLoading}
                        table={table}
                        tableState={tableState}
                        updateTableState={updateTableState}
                        filters={rowsFilterRef.current}
                        onSelect={handleSelect}
                        onMouseDown={handleCellMouseDown}
                        onTouchStart={handleTouchStart}
                        onTouchEnd={handleTouchEnd}
                        onDoubleClick={handleDoubleClick}
                        onCancelQuery={handleCancelQuery}
                        onSave={handleSave}
                        onDiscard={handleDiscard}
                        onImport={() => { }}
                        rowCount={rowCount}
                    />
                </Stack_Table>
            </Paper_Dialogs>
        </Stack_Dialogs>

    );
}
