/*
 * Copyright (c) 2022 NOMANA-IT and/or its affiliates.
 * All rights reserved. Use is subject to license terms.
 * *
 */
// React Import
import React from "react";

//Custom Import
import { EnumGrid } from "@ly_input/InputEnum/EnumGrid";
import { getBoundingClientRectSafe } from "@ly_utils/commonUtils";
import { OnChangeFunction, OnCloseFunction } from "@ly_input/InputEnum/utils/commonUtils";
import { IEnumColumn, IEnumOption } from "@ly_types/lyEnums";
import { Popper, PopperProps } from "@ly_common/Popper";

export interface IEnumPopper {
    id: string;
    popperProps: PopperProps;
    isLoading: boolean;
    columns: IEnumColumn[];
    data: IEnumOption[];
    inputRef: React.RefObject<HTMLInputElement | null>;
    open: boolean;
    setSelectedOption:  React.Dispatch<React.SetStateAction<IEnumOption | null>>;
    onChange: OnChangeFunction;
    onClose: OnCloseFunction;
}

export const EnumPopper = (props: IEnumPopper) => {
    const { popperProps, isLoading, id, onChange, open, setSelectedOption, columns, data, inputRef, onClose } = props;
    const anchorEl = popperProps.anchorEl;
    const boundingRect = getBoundingClientRectSafe(anchorEl);
    const columnWidth = boundingRect ? boundingRect.width : 0;
    
    if (!isLoading && open) {
        return (
            <Popper {...popperProps}
                style={{
                    width: Math.max(420, columnWidth + 18),
                }}
                placement="bottom-start"
                open={open}
                >
                <EnumGrid
                    isLoading={isLoading}
                    columns={columns}
                    data={data}
                    id={id}
                    onChange={onChange}
                    setSelectedOption={setSelectedOption}
                    inputRef={inputRef}
                    onClose={onClose}
                />
            </Popper>
        );
    }
    return null;
};