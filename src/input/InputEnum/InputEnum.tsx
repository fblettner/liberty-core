/*
 * Copyright (c) 2025 NOMANA-IT and/or its affiliates.
 * All rights reserved. Use is subject to license terms.
 * *
 */
// React Import
import { Fragment, useState } from 'react';

// MUI Import

// Custom Import
import { EnumInput } from '@ly_input/InputEnum/EnumInput';
import { AlertMessage } from '@ly_common/AlertMessage';
import { OnChangeFunction } from '@ly_input/InputEnum/utils/commonUtils';
import { IErrorState } from "@ly_utils/commonUtils";
import { TextFieldVariants } from '@ly_types/common';
import { IEnumsResult } from '@ly_types/lyEnums';
import { ComponentProperties } from '@ly_types/lyComponents';
import { IModulesProps } from '@ly_types/lyModules';

export interface IInputEnumProps {
    id: string;
    label: string;
    defaultValue: string;
    disabled: boolean;
    variant: TextFieldVariants | undefined;
    freeSolo: boolean;
    searchByLabel: boolean
    dynamic_params?: string;
    fixed_params?: string;
    overrideQueryPool?: string;
    callFromTable?: boolean;
    hideButton?: boolean;
    onChange: OnChangeFunction;
    getData: () => Promise<IEnumsResult>;
    loggerAPI: string;
    dialogRef: React.RefObject<ComponentProperties | null>;
    modulesProperties: IModulesProps;
}

export const InputEnum = (props: IInputEnumProps) => {
    const { id, label, defaultValue, onChange, disabled, variant, freeSolo, searchByLabel, dynamic_params, fixed_params, overrideQueryPool,
        callFromTable, hideButton, getData, loggerAPI, dialogRef, modulesProperties } = props;
    const [errorState, setErrorState] = useState<IErrorState>({ message: '', open: false });

    const onCloseError = () => {
        setErrorState({ open: false, message: '' });
    }

    return (
        <Fragment>
            {errorState.open &&
                <AlertMessage
                    open={errorState.open}
                    severity={errorState.severity}
                    message={errorState.message}
                    onClose={onCloseError}
                />
            }
            <EnumInput
                id={id}
                label={label}
                defaultValue={defaultValue}
                onChange={onChange}
                disabled={disabled}
                variant={variant}
                freeSolo={freeSolo}
                searchByLabel={searchByLabel}
                dynamic_params={dynamic_params}
                fixed_params={fixed_params}
                overrideQueryPool={overrideQueryPool}
                callFromTable={callFromTable}
                hideButton={hideButton}
                setErrorState={setErrorState}
                getData={getData}
                loggerAPI={loggerAPI}
                dialogRef={dialogRef}
                modulesProperties={modulesProperties}
            />
        </Fragment>
    );
};



