/*
 * Copyright (c) 2022 NOMANA-IT and/or its affiliates.
 * All rights reserved. Use is subject to license terms.
 * *
 */
import { useAppContext } from "@ly_context/AppProvider";
import { InputEnum } from "@ly_input/InputEnum/InputEnum";
import { InputLookup } from "@ly_input/InputLookup/InputLookup";
import { OnChangeFunction } from "@ly_input/InputLookup/utils/commonUtils";
import { Button_UISettings } from "@ly_styles/Button";
import { Div_UISettings } from "@ly_styles/Div";
import { LYDarkModeIcon, LYLightModeIcon } from "@ly_styles/icons";
import { UIDisplayMode } from "@ly_types/common";
import { IAppsProps, ESessionMode } from "@ly_types/lyApplications";
import { IModulesProps } from "@ly_types/lyModules";
import { IUsersProps, EUsers } from "@ly_types/lyUsers";
import { GlobalSettings } from "@ly_utils/GlobalSettings";
import { Fragment, useMemo } from "react";

interface IUISettings {
    onAutocompleteChanged: OnChangeFunction;
    darkMode?: boolean;
    inputLanguage: string | null;
    inputDashboard: string | null;
    inputTheme: string | null;
    handleButtonClick: (value: UIDisplayMode) => void;
}

export const UISettings = (props: IUISettings) => {
    const { onAutocompleteChanged, darkMode, inputLanguage, inputDashboard, inputTheme, handleButtonClick } = props;
    const { userProperties, appsProperties, modulesProperties, setUserProperties, setAppsProperties, socket, setSocket } = useAppContext();

    const generalData = useMemo(() => [
        { id: UIDisplayMode.dark, name: darkMode ? "Mode: Dark" : "Mode: Light", icon: darkMode ? LYDarkModeIcon : LYLightModeIcon }], [darkMode]);

    return (
        <Fragment>
            {generalData.map((item) => (
                <Div_UISettings key={item.id}>
                    <Button_UISettings
                        key={item.id}
                        variant="contained"
                        endIcon={item.icon}
                        onClick={() => { handleButtonClick(item.id) }}
                    >
                        {item.name}
                    </Button_UISettings>
                </Div_UISettings>

            ))}
            <Div_UISettings>
                <InputLookup
                    id={EUsers.language}
                    key={EUsers.language}
                    lookupID={GlobalSettings.getQuery.lookupLanguage}
                    label="Language"
                    defaultValue={inputLanguage ?? ''}
                    disabled={false}
                    onChange={onAutocompleteChanged}
                    displayWhite={true}
                    sessionMode={ESessionMode.framework}
                />
            </Div_UISettings>
            <Div_UISettings>
                <InputLookup
                    id={EUsers.dashboard}
                    key={EUsers.dashboard}
                    lookupID={GlobalSettings.getQuery.lookupDashboard}
                    label="Dashboard"
                    defaultValue={inputDashboard ?? ''}
                    disabled={false}
                    onChange={onAutocompleteChanged}
                    displayWhite={true}
                    fixed_params='COL_COMPONENT=FormsDashboard'
                    sessionMode={ESessionMode.framework}
                />
            </Div_UISettings>
            <Div_UISettings>
                <InputEnum
                    id={EUsers.theme}
                    key={EUsers.theme}
                    enumID={GlobalSettings.getQuery.enumTheme}
                    label="Theme"
                    defaultValue={inputTheme ?? ''}
                    disabled={false}
                    onChange={onAutocompleteChanged}
                    variant="standard"
                    freeSolo={true}
                    searchByLabel={false}
                    sessionMode={ESessionMode.framework}
                    overrideQueryPool={GlobalSettings.getDefaultPool}
                />
            </Div_UISettings>
        </Fragment>
    )
}

