import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Alert, Avatar, Box, Button, CircularProgress, Container, MenuItem, Select, Stack, TextField, Typography } from '@mui/material';
import MetricsBar from '@/components/MetricsBar';
import TaskTable from '@/components/TaskTable';
import UndoSnackbar from '@/components/UndoSnackbar';
import { useCallback, useMemo, useState } from 'react';
import { UserProvider, useUser } from '@/context/UserContext';
import { TasksProvider, useTasksContext } from '@/context/TasksContext';
import ChartsDashboard from '@/components/ChartsDashboard';
import AnalyticsDashboard from '@/components/AnalyticsDashboard';
import ActivityLog from '@/components/ActivityLog';
import { downloadCSV, toCSV } from '@/utils/csv';
import { computeAverageROI, computePerformanceGrade, computeRevenuePerHour, computeTimeEfficiency, computeTotalRevenue, } from '@/utils/logic';
function AppContent() {
    const { loading, error, metrics, derivedSorted, addTask, updateTask, deleteTask, undoDelete, lastDeleted, clearLastDeleted, } = useTasksContext();
    const handleCloseUndo = (event, reason) => {
        if (reason === 'clickaway')
            return;
        clearLastDeleted(); // ✅ Reset deleted task after snackbar closes ---------------------Bug 2
    };
    const [q, setQ] = useState('');
    const [fStatus, setFStatus] = useState('All');
    const [fPriority, setFPriority] = useState('All');
    const { user } = useUser();
    const [activity, setActivity] = useState([]);
    const createActivity = useCallback((type, summary) => ({
        id: (typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`),
        ts: Date.now(),
        type,
        summary,
    }), []);
    const filtered = useMemo(() => {
        return derivedSorted.filter(t => {
            if (q && !t.title.toLowerCase().includes(q.toLowerCase()))
                return false;
            if (fStatus !== 'All' && t.status !== fStatus)
                return false;
            if (fPriority !== 'All' && t.priority !== fPriority)
                return false;
            return true;
        });
    }, [derivedSorted, q, fStatus, fPriority]);
    const handleAdd = useCallback((payload) => {
        addTask(payload);
        setActivity(prev => [createActivity('add', `Added: ${payload.title}`), ...prev].slice(0, 50));
    }, [addTask, createActivity]);
    const handleUpdate = useCallback((id, patch) => {
        updateTask(id, patch);
        setActivity(prev => [createActivity('update', `Updated: ${Object.keys(patch).join(', ')}`), ...prev].slice(0, 50));
    }, [updateTask, createActivity]);
    const handleDelete = useCallback((id) => {
        deleteTask(id);
        setActivity(prev => [createActivity('delete', `Deleted task ${id}`), ...prev].slice(0, 50));
    }, [deleteTask, createActivity]);
    const handleUndo = useCallback(() => {
        undoDelete();
        setActivity(prev => [createActivity('undo', 'Undo delete'), ...prev].slice(0, 50));
    }, [undoDelete, createActivity]);
    return (_jsx(Box, { sx: { minHeight: '100dvh', bgcolor: 'background.default' }, children: _jsx(Container, { maxWidth: "lg", sx: { py: { xs: 3, md: 5 } }, children: _jsxs(Stack, { spacing: 3, children: [_jsxs(Stack, { direction: "row", alignItems: "center", justifyContent: "space-between", children: [_jsxs(Box, { children: [_jsx(Typography, { variant: "h3", fontWeight: 700, gutterBottom: true, children: "TaskGlitch" }), _jsxs(Typography, { variant: "body1", color: "text.secondary", children: ["Welcome back, ", user.name.split(' ')[0], "."] })] }), _jsxs(Stack, { direction: "row", spacing: 2, alignItems: "center", children: [_jsx(Button, { variant: "outlined", onClick: () => {
                                            const csv = toCSV(filtered);
                                            downloadCSV('tasks.csv', csv);
                                        }, children: "Export CSV" }), _jsx(Avatar, { sx: { width: 40, height: 40 }, children: user.name.charAt(0) })] })] }), loading && (_jsx(Stack, { alignItems: "center", py: 6, children: _jsx(CircularProgress, {}) })), error && _jsx(Alert, { severity: "error", children: error }), !loading && !error && (_jsx(MetricsBar, { metricsOverride: {
                            totalRevenue: computeTotalRevenue(filtered),
                            totalTimeTaken: filtered.reduce((s, t) => s + t.timeTaken, 0),
                            timeEfficiencyPct: computeTimeEfficiency(filtered),
                            revenuePerHour: computeRevenuePerHour(filtered),
                            averageROI: computeAverageROI(filtered),
                            performanceGrade: computePerformanceGrade(computeAverageROI(filtered)),
                        } })), !loading && !error && (_jsxs(Stack, { direction: { xs: 'column', sm: 'row' }, spacing: 2, alignItems: { xs: 'stretch', sm: 'center' }, children: [_jsx(TextField, { placeholder: "Search by title", value: q, onChange: e => setQ(e.target.value), fullWidth: true }), _jsxs(Select, { value: fStatus, onChange: e => setFStatus(e.target.value), displayEmpty: true, sx: { minWidth: 180 }, children: [_jsx(MenuItem, { value: "All", children: "All Statuses" }), _jsx(MenuItem, { value: "Todo", children: "Todo" }), _jsx(MenuItem, { value: "In Progress", children: "In Progress" }), _jsx(MenuItem, { value: "Done", children: "Done" })] }), _jsxs(Select, { value: fPriority, onChange: e => setFPriority(e.target.value), displayEmpty: true, sx: { minWidth: 180 }, children: [_jsx(MenuItem, { value: "All", children: "All Priorities" }), _jsx(MenuItem, { value: "High", children: "High" }), _jsx(MenuItem, { value: "Medium", children: "Medium" }), _jsx(MenuItem, { value: "Low", children: "Low" })] })] })), !loading && !error && (_jsx(TaskTable, { tasks: filtered, onAdd: handleAdd, onUpdate: handleUpdate, onDelete: handleDelete })), !loading && !error && _jsx(ChartsDashboard, { tasks: filtered }), !loading && !error && _jsx(AnalyticsDashboard, { tasks: filtered }), !loading && !error && _jsx(ActivityLog, { items: activity }), _jsx(UndoSnackbar, { open: !!lastDeleted, onClose: handleCloseUndo, onUndo: handleUndo })] }) }) }));
}
export default function App() {
    return (_jsx(UserProvider, { children: _jsx(TasksProvider, { children: _jsx(AppContent, {}) }) }));
}
