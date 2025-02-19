import { ThemeColorItem, ThemeColors } from "@ly_types/lyThemes";

// Function to map query results to theme colors
export const mapThemeColors = (queryResult: ThemeColorItem[], darkMode: boolean) => {
    const colors: ThemeColors = {};

    queryResult.forEach(({ TCL_KEY, TCL_LIGHT, TCL_DARK }) => {
        const value = darkMode ? TCL_DARK : TCL_LIGHT;
        const keys = TCL_KEY.split(".");

        if (keys.length > 1) {
            if (!colors[keys[0]]) colors[keys[0]] = {};
            (colors[keys[0]] as Record<string, string>)[keys[1]] = value;
        } else {
            colors[TCL_KEY] = value;
        }
    });

    return colors;
};