import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Stack, TextField, Typography } from '@mui/material';
import { daysBetween } from '@/utils/logic';
import { useEffect, useState } from 'react';
export default function TaskDetailsDialog({ open, task, onClose, onSave }) {
    const [revenue, setRevenue] = useState('');
    const [timeTaken, setTimeTaken] = useState('');
    const [notes, setNotes] = useState('');
    useEffect(() => {
        if (!open || !task)
            return;
        setRevenue(task.revenue);
        setTimeTaken(task.timeTaken);
        setNotes(task.notes ?? '');
    }, [open, task]);
    if (!task)
        return null;
    const handleSave = () => {
        onSave(task.id, {
            revenue: typeof revenue === 'number' ? revenue : task.revenue,
            timeTaken: typeof timeTaken === 'number' && timeTaken > 0 ? timeTaken : task.timeTaken,
            notes: notes.trim() || undefined,
        });
        onClose();
    };
    return (_jsxs(Dialog, { open: open, onClose: onClose, fullWidth: true, maxWidth: "sm", children: [_jsx(DialogTitle, { children: "Task Details" }), _jsx(DialogContent, { children: _jsxs(Stack, { spacing: 2, mt: 1, children: [_jsx(Typography, { variant: "h6", fontWeight: 700, children: task.title }), _jsx(Divider, {}), _jsxs(Typography, { variant: "body2", color: "text.secondary", children: ["Created: ", new Date(task.createdAt).toLocaleString(), " ", task.completedAt ? `• Completed: ${new Date(task.completedAt).toLocaleString()} • Cycle: ${daysBetween(task.createdAt, task.completedAt)}d` : ''] }), _jsxs(Stack, { direction: { xs: 'column', sm: 'row' }, spacing: 2, children: [_jsx(TextField, { label: "Revenue", type: "number", value: revenue, onChange: e => setRevenue(e.target.value === '' ? '' : Number(e.target.value)), fullWidth: true }), _jsx(TextField, { label: "Time Taken (h)", type: "number", value: timeTaken, onChange: e => setTimeTaken(e.target.value === '' ? '' : Number(e.target.value)), fullWidth: true })] }), _jsx(TextField, { label: "Notes", value: notes, onChange: e => setNotes(e.target.value), multiline: true, minRows: 3 }), _jsxs(Typography, { variant: "body2", color: "text.secondary", children: ["Priority: ", task.priority, " \u2022 Status: ", task.status] })] }) }), _jsxs(DialogActions, { children: [_jsx(Button, { onClick: onClose, children: "Close" }), _jsx(Button, { variant: "contained", onClick: handleSave, children: "Save" })] })] }));
}
