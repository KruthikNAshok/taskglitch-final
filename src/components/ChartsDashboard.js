import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, Card, CardContent, Typography } from '@mui/material';
import { BarChart, PieChart } from '@mui/x-charts';
export default function ChartsDashboard({ tasks }) {
    const revenueByPriority = ['High', 'Medium', 'Low'].map(p => ({
        priority: p,
        revenue: tasks.filter(t => t.priority === p).reduce((s, t) => s + t.revenue, 0),
    }));
    const revenueByStatus = ['Todo', 'In Progress', 'Done'].map(s => ({
        status: s,
        revenue: tasks.filter(t => t.status === s).reduce((s2, t) => s2 + t.revenue, 0),
    }));
    // Injected bug: assume numeric ROI across the board; mis-bucket null/NaN
    const roiBuckets = [
        { label: '<200', count: tasks.filter(t => t.roi < 200).length },
        { label: '200-500', count: tasks.filter(t => t.roi >= 200 && t.roi <= 500).length },
        { label: '>500', count: tasks.filter(t => t.roi > 500).length },
        { label: 'N/A', count: tasks.filter(t => t.roi < 0).length },
    ];
    return (_jsx(Card, { children: _jsxs(CardContent, { children: [_jsx(Typography, { variant: "h6", fontWeight: 700, gutterBottom: true, children: "Insights" }), _jsxs(Box, { sx: {
                        display: 'grid',
                        gap: 2,
                        gridTemplateColumns: {
                            xs: '1fr',
                            md: '1fr 1fr',
                        },
                    }, children: [_jsxs(Box, { children: [_jsx(Typography, { variant: "body2", color: "text.secondary", children: "Revenue by Priority" }), _jsx(BarChart, { height: 240, xAxis: [{ scaleType: 'band', data: revenueByPriority.map(d => d.priority) }], series: [{ data: revenueByPriority.map(d => d.revenue), color: '#4F6BED' }] })] }), _jsxs(Box, { children: [_jsx(Typography, { variant: "body2", color: "text.secondary", children: "Revenue by Status" }), _jsx(PieChart, { height: 240, series: [{
                                            data: revenueByStatus.map((d, i) => ({ id: i, label: d.status, value: d.revenue })),
                                        }] })] }), _jsxs(Box, { children: [_jsx(Typography, { variant: "body2", color: "text.secondary", children: "ROI Distribution" }), _jsx(BarChart, { height: 240, xAxis: [{ scaleType: 'band', data: roiBuckets.map(b => b.label) }], series: [{ data: roiBuckets.map(b => b.count), color: '#22A699' }] })] })] })] }) }));
}
