/*
 * Copyright (c) 2022 NOMANA-IT and/or its affiliates.
 * All rights reserved. Use is subject to license terms.
 * *
 */
// React Import
import { Fragment, useState } from 'react';

// MUI Import

// Custom Import
import { ESessionMode, IAppsProps } from '@ly_types/lyApplications';
import { EnumInput } from '@ly_input/InputEnum/EnumInput';
import { AlertMessage } from '@ly_common/AlertMessage';
import { OnChangeFunction } from '@ly_input/InputEnum/utils/commonUtils';
import { IErrorState } from "@ly_utils/commonUtils";
import { IColumnsFilter } from "@ly_types/lyFilters";
import { ITransformedObject, TextFieldVariants } from '@ly_types/common';
import { IUsersProps } from '@ly_types/lyUsers';
import { IModulesProps } from '@ly_types/lyModules';


export interface IInputEnumProps {
    id: string;
    enumID: number;
    label: string;
    defaultValue: string;
    disabled: boolean;
    variant: TextFieldVariants | undefined;
    freeSolo: boolean;
    searchByLabel: boolean
    data?: IColumnsFilter | ITransformedObject;
    dynamic_params?: string;
    fixed_params?: string;
    sessionMode?: ESessionMode;
    overrideQueryPool?: string;
    callFromTable?: boolean;
    hideButton?: boolean;
    onChange: OnChangeFunction;
    appsProperties: IAppsProps;
    userProperties: IUsersProps;
    modulesProperties: IModulesProps;
}

export const InputEnum = (props: IInputEnumProps) => {
    const { id, enumID, label, defaultValue, onChange, disabled, variant, freeSolo, searchByLabel,data, dynamic_params, fixed_params, sessionMode, overrideQueryPool, 
        callFromTable, hideButton, appsProperties, userProperties,modulesProperties} = props;
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
                enumID={enumID}
                defaultValue={defaultValue}
                onChange={onChange}
                disabled={disabled}
                variant={variant}
                freeSolo={freeSolo}
                data={data}
                searchByLabel={searchByLabel}
                dynamic_params={dynamic_params}
                fixed_params={fixed_params}
                sessionMode={sessionMode}
                overrideQueryPool={overrideQueryPool}
                callFromTable={callFromTable}
                hideButton={hideButton}
                setErrorState={setErrorState}
                appsProperties={appsProperties}
                userProperties={userProperties}
                modulesProperties={modulesProperties}
            />
        </Fragment>
    );
};



