import { useEffect, useState } from "react";
import {
    Typography,
    useApiUrl,
    useCustom,
    Row,
    Col,
    DatePicker,
    NumberField,
} from "@pankod/refine";
import { Line } from "@ant-design/charts";
import { LineConfig } from "@ant-design/charts/es/line";
import dayjs, { Dayjs } from "dayjs";

import { ISalesChart } from "interfaces";

export const SalesChart: React.FC = () => {
    const [total, setTotal] = useState(0);
    const API_URL = useApiUrl();

    const [dateRange, setDateRange] = useState<[Dayjs, Dayjs]>([
        dayjs().subtract(7, "days").startOf("day"),
        dayjs().startOf("day"),
    ]);
    const [start, end] = dateRange;

    const query = {
        start,
        end,
    };

    const url = `${API_URL}/sales`;
    const { data, isLoading } = useCustom<ISalesChart[]>(url, "get", {
        query,
    });

    useEffect(() => {
        if (data) {
            setTotal(
                data.data.reduce((acc, item) => {
                    if (item.title === "Order Amount") {
                        return acc + item.value;
                    }
                    return acc;
                }, 0),
            );
        }
    }, [data]);

    const config: LineConfig = {
        data: data?.data || [],
        loading: isLoading,
        padding: "auto",
        xField: "date",
        yField: "value",
        seriesField: "title",
        tooltip: {
            title: (date) => dayjs(date).format("LL"),
        },
        xAxis: {
            label: {
                formatter: (value) => {
                    return dayjs(value).format("YYYY-MM-DD");
                },
            },
        },
    };

    const { Title } = Typography;
    const { RangePicker } = DatePicker;

    return (
        <>
            <Row justify="space-between">
                <Col>
                    <Title level={5}>Total Sales</Title>
                </Col>
                <Col>
                    <NumberField
                        style={{ fontSize: 56 }}
                        options={{
                            currency: "USD",
                            style: "currency",
                            notation: "compact",
                        }}
                        value={total}
                    />
                </Col>
            </Row>

            <Line {...config} />

            <RangePicker
                value={dateRange}
                onChange={(values) => {
                    setDateRange(values);
                }}
                style={{ float: "right", marginTop: 20 }}
                ranges={{
                    "This Week": [
                        dayjs().startOf("week"),
                        dayjs().endOf("week"),
                    ],
                    "Last Month": [
                        dayjs().startOf("month").subtract(1, "month"),
                        dayjs().endOf("month").subtract(1, "month"),
                    ],
                    "This Month": [
                        dayjs().startOf("month"),
                        dayjs().endOf("month"),
                    ],
                    "This Year": [
                        dayjs().startOf("year"),
                        dayjs().endOf("year"),
                    ],
                }}
                format="YYYY/MM/DD"
            />
        </>
    );
};