/*
 * Copyright (c) 2022 NOMANA-IT and/or its affiliates.
 * All rights reserved. Use is subject to license terms.
 * *
 */
// React Import
import { useEffect, useRef, useState } from 'react';

// Custom Import
import { lyGetCharts } from '@ly_services/lyCharts';
import { AxisData, EChartHeader, EChartType, IChartHeader, LYChartPalette, PieData } from '@ly_types/lyCharts';
import { ComponentProperties } from '@ly_types/lyComponents';
import { IColumnsProperties, TablesGridHardCoded } from '@ly_types/lyTables';
import { Paper_FormsChart } from '@ly_styles/Paper';
import { Stack_FormsChart } from '@ly_styles/Stack';
import { BarChart } from '@ly_charts/BarChart';
import { PieChart } from '@ly_charts/PieChart';
import { LineChart } from '@ly_charts/LineChart';
import { useTheme } from '@emotion/react';
import { useAppContext } from '@ly_context/AppProvider';

type Props = Readonly<{
    componentProperties: ComponentProperties;
}>;

const useChartPalette = () => {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";
    return isDark ? LYChartPalette.dark : LYChartPalette.light;
  };
  
export function FormsChart(props: Props) {
    const { componentProperties } = props;
    const { userProperties, appsProperties, modulesProperties, setUserProperties, setAppsProperties, socket, setSocket } = useAppContext();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const component = useRef(componentProperties);
    const [chartHeader, setChartHeader] = useState<IChartHeader>({
        [EChartHeader.id]: 0,
        [EChartHeader.label]: '',
        [EChartHeader.type]: '',
        [EChartHeader.grid_hz]: '',
        [EChartHeader.grid_vt]: '',
        [EChartHeader.axis_x]: '',
        [EChartHeader.axis_y1]: '',
        [EChartHeader.axis_y2]: '',
        [EChartHeader.queryID]: 0,
        [EChartHeader.series]: ''
    });
    const [data, setData] = useState([]);
    const [series, setSeries] = useState([]);
    const [axis, setAxis] = useState<AxisData>([]);
    const [pieData, setPieData] = useState<PieData>([])
    const chartPalette = useChartPalette();

    useEffect(() => {
        component.current = componentProperties

        const fetchData = async () => {
            setIsLoading(true);
            const chartData = await lyGetCharts({
                appsProperties: appsProperties,
                userProperties: userProperties,
                modulesProperties: modulesProperties,
                [EChartHeader.id]: component.current.id
            });

            setChartHeader(chartData.header)
            setData(chartData.data)

            let seriesData
            if (chartData.header[EChartHeader.type] === EChartType.line) {
                seriesData = await chartData.columns.filter((column: IColumnsProperties) => column.field !== TablesGridHardCoded.row_id && column.field !== EChartHeader.series).map((column: IColumnsProperties) => ({ dataKey: column.field, label: column.header,yAxisKey: column.field}));
            } else {
                seriesData = await chartData.columns.filter((column: IColumnsProperties) => column.field !== TablesGridHardCoded.row_id && column.field !== EChartHeader.series).map((column: IColumnsProperties) => ({ dataKey: column.field, label: column.header }));
            }
            setSeries(seriesData);

            const axisData = [...new Set<string>(chartData.data.map((data: Record<string, string>) => data[EChartHeader.series]))];
            setAxis(axisData);

            if (chartData.header[EChartHeader.type] === EChartType.pie) {
                let tmpData: { value: number; label: string; }[] = [];
                seriesData.map((serie: { dataKey: string | number; label: string; }) => {
                    for (const item of chartData.data) {
                        tmpData.push({
                            value: item[serie.dataKey],
                            label: serie.label
                        })
                    }
                })
                setPieData(tmpData);
            }
            setIsLoading(false);
        };

        fetchData();
    }, [componentProperties.id]);


    if (isLoading) {
        return
    } else
        return (
            <Stack_FormsChart>
                <Paper_FormsChart elevation={0}>
                    {chartHeader[EChartHeader.type] === EChartType.bar &&
                        <BarChart
                            dataset={data}
                            colors={chartPalette}
                            grid={{
                                horizontal: chartHeader[EChartHeader.grid_hz] === "Y" ? true : false,
                                vertical: chartHeader[EChartHeader.grid_vt] === "Y" ? true : false
                            }}
                            xAxis={[{
                                scaleType: 'band',
                                data: axis,
                                label: chartHeader[EChartHeader.axis_x]

                            },
                            ]}
                            yAxis={[{ label: chartHeader[EChartHeader.axis_y1] }]}
                            series={series}
                        />
                    }
                    {chartHeader[EChartHeader.type] === EChartType.pie &&
                        <PieChart
                            colors={chartPalette}
                            data={pieData}
                        />
                    }
                    {chartHeader[EChartHeader.type] === EChartType.line &&
                        <LineChart
                            dataset={data}
                            colors={chartPalette}
                            grid={{
                                horizontal: chartHeader[EChartHeader.grid_hz] === "Y" ? true : false,
                                vertical: chartHeader[EChartHeader.grid_vt] === "Y" ? true : false
                            }}
                            xAxis={[{
                                scaleType: 'point',
                                data: axis,
                                label: chartHeader[EChartHeader.axis_x]

                            },
                            ]}
                            yAxis={[{ id: chartHeader[EChartHeader.axis_y1], label: chartHeader[EChartHeader.axis_y1] }, { id: chartHeader[EChartHeader.axis_y2], label: chartHeader[EChartHeader.axis_y2] }]}
                            series={series}
                        />
                    }
                </Paper_FormsChart>
            </Stack_FormsChart>
        )
}