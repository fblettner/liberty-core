/*
 * Copyright (c) 2022 NOMANA-IT and/or its affiliates.
 * All rights reserved. Use is subject to license terms.
 * *
 */
// React Import
import { Fragment, useCallback, useEffect, useRef, useState } from 'react';

// Custom Import
import { ESessionMode } from '@ly_types/lyApplications';
import { LookupInput } from '@ly_input/InputLookup/LookupInput';
import { AlertMessage } from '@ly_common/AlertMessage';
import { OnChangeFunction } from '@ly_input/InputLookup/utils/commonUtils';
import { IColumnsFilter } from "@ly_types/lyFilters";
import { IContentValue, IErrorState } from "@ly_utils/commonUtils";
import { ITransformedObject, TextFieldVariants } from '@ly_types/common';

export interface IInputLookupProps {
    id: string;
    lookupID: number;
    label?: string;
    defaultValue?: IContentValue ;
    disabled?: boolean;
    displayWhite?: boolean;
    variant?: TextFieldVariants | undefined;
    data?: IColumnsFilter | ITransformedObject;
    dynamic_params?: string;
    fixed_params?: string;
    sessionMode?: ESessionMode;
    overrideQueryPool?: string;
    searchByLabel?: boolean;
    callFromTable?: boolean;
    onChange: OnChangeFunction;
}

export const InputLookup = (props: IInputLookupProps) => {
    const { id, lookupID, label, defaultValue, disabled, displayWhite, variant, data, dynamic_params, fixed_params, sessionMode, overrideQueryPool, searchByLabel, onChange, 
        callFromTable } = props;
    const [errorState, setErrorState] = useState<IErrorState>({ message: '', open: false });
    const inputRef = useRef<HTMLInputElement>(null);
 
    const onCloseError = useCallback(() => {
        setErrorState({ open: false, message: '' });
    }, []);

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, [id]);

    return (
        <Fragment>
            {errorState.open &&
                <AlertMessage
                    open={errorState.open}
                    severity={errorState.severity}
                    message={errorState.message}
                    onClose={onCloseError}
                />}

            <LookupInput
                id={id}
                label={label}
                lookupID={lookupID}
                lookupLabel={label}
                onChange={onChange}
                disabled={disabled}
                data={data}
                displayWhite={displayWhite}
                searchByLabel={searchByLabel}
                defaultValue={defaultValue}
                dynamic_params={dynamic_params}
                fixed_params={fixed_params}
                sessionMode={sessionMode}
                overrideQueryPool={overrideQueryPool}
                callFromTable={callFromTable}
                setErrorState={setErrorState}
                variant={variant ?? "standard"}
            />
        </Fragment>
    );
}