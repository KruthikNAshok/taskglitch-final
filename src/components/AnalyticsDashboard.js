import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, Card, CardContent, Stack, Typography } from '@mui/material';
import { BarChart, LineChart, PieChart } from '@mui/x-charts';
import { computeFunnel, computeThroughputByWeek, computeWeightedPipeline, computeForecast, computeVelocityByPriority, } from '@/utils/logic';
export default function AnalyticsDashboard({ tasks }) {
    const baseTasks = tasks;
    const funnel = computeFunnel(baseTasks);
    const weekly = computeThroughputByWeek(baseTasks);
    const weightedPipeline = computeWeightedPipeline(baseTasks);
    const forecast = computeForecast(weekly.map(w => ({ week: w.week, revenue: w.revenue })), 4);
    const velocity = computeVelocityByPriority(baseTasks);
    return (_jsx(Card, { children: _jsxs(CardContent, { children: [_jsx(Typography, { variant: "h6", fontWeight: 700, gutterBottom: true, children: "Analytics" }), _jsxs(Stack, { spacing: 3, children: [_jsxs(Box, { children: [_jsx(Typography, { variant: "body2", color: "text.secondary", children: "Funnel" }), _jsx(BarChart, { height: 240, xAxis: [{ scaleType: 'band', data: ['Todo', 'In Progress', 'Done'] }], series: [{ data: [funnel.todo, funnel.inProgress, funnel.done], color: '#4F6BED' }] })] }), _jsxs(Box, { children: [_jsx(Typography, { variant: "body2", color: "text.secondary", children: "Throughput (weekly completed)" }), _jsx(LineChart, { height: 240, xAxis: [{ scaleType: 'band', data: weekly.map(w => w.week) }], series: [{ data: weekly.map(w => w.count), color: '#22A699' }] })] }), _jsxs(Box, { children: [_jsx(Typography, { variant: "body2", color: "text.secondary", children: "Weighted Pipeline" }), _jsx(PieChart, { height: 240, series: [{ data: [
                                                { id: 0, label: 'Weighted Revenue', value: weightedPipeline },
                                            ] }] })] }), _jsxs(Box, { children: [_jsx(Typography, { variant: "body2", color: "text.secondary", children: "Forecast (next 4 weeks)" }), _jsx(LineChart, { height: 240, xAxis: [{ scaleType: 'band', data: forecast.map(f => f.week) }], series: [{ data: forecast.map(f => f.revenue), color: '#F59E0B' }] })] }), _jsxs(Box, { children: [_jsx(Typography, { variant: "body2", color: "text.secondary", children: "Velocity by Priority (avg days)" }), _jsx(BarChart, { height: 240, xAxis: [{ scaleType: 'band', data: ['High', 'Medium', 'Low'] }], series: [{ data: [velocity.High.avgDays, velocity.Medium.avgDays, velocity.Low.avgDays], color: '#8B5CF6' }] })] })] })] }) }));
}
