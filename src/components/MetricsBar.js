import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, Card, CardContent, Stack, Tooltip, Typography } from '@mui/material';
import { useTasksContext } from '@/context/TasksContext';
function Stat({ label, value, hint }) {
    const content = (_jsxs(Stack, { spacing: 0.5, children: [_jsx(Typography, { variant: "overline", color: "text.secondary", children: label }), _jsx(Typography, { variant: "h5", fontWeight: 700, children: value })] }));
    return hint ? _jsx(Tooltip, { title: hint, children: content }) : content;
}
export default function MetricsBar({ metricsOverride }) {
    const { metrics } = useTasksContext();
    const m = metricsOverride ?? metrics;
    const { totalRevenue, timeEfficiencyPct, revenuePerHour, averageROI, performanceGrade, totalTimeTaken } = m;
    return (_jsx(Card, { children: _jsx(CardContent, { children: _jsxs(Box, { sx: {
                    display: 'grid',
                    gap: 2,
                    gridTemplateColumns: {
                        xs: '1fr',
                        sm: 'repeat(2, 1fr)',
                        md: 'repeat(5, 1fr)',
                    },
                }, children: [_jsx(Stat, { label: "Total Revenue", value: `$${totalRevenue.toLocaleString()}`, hint: "Sum of revenue for Done tasks" }), _jsx(Stat, { label: "Time Efficiency", value: `${timeEfficiencyPct.toFixed(0)}%`, hint: "(Done / All) * 100" }), _jsx(Stat, { label: "Revenue / Hour", value: `$${(Number.isFinite(revenuePerHour) ? revenuePerHour : 0).toFixed(1)}`, hint: "Total revenue divided by total time" }), _jsx(Stat, { label: "Average ROI", value: `${averageROI.toFixed(1)}`, hint: "Mean of valid ROI values" }), _jsx(Stat, { label: "Grade", value: `${performanceGrade}`, hint: `Based on Avg ROI (${averageROI.toFixed(1)}) • Total time ${totalTimeTaken}h` })] }) }) }));
}
