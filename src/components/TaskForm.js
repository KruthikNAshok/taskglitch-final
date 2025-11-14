import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useMemo, useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputLabel, MenuItem, Select, Stack, TextField, } from '@mui/material';
const priorities = ['High', 'Medium', 'Low'];
const statuses = ['Todo', 'In Progress', 'Done'];
export default function TaskForm({ open, onClose, onSubmit, existingTitles, initial }) {
    const [title, setTitle] = useState('');
    const [revenue, setRevenue] = useState('');
    const [timeTaken, setTimeTaken] = useState('');
    const [priority, setPriority] = useState('');
    const [status, setStatus] = useState('');
    const [notes, setNotes] = useState('');
    useEffect(() => {
        if (!open)
            return;
        if (initial) {
            setTitle(initial.title);
            setRevenue(initial.revenue);
            setTimeTaken(initial.timeTaken);
            setPriority(initial.priority);
            setStatus(initial.status);
            setNotes(initial.notes ?? '');
        }
        else {
            setTitle('');
            setRevenue('');
            setTimeTaken('');
            setPriority('');
            setStatus('');
            setNotes('');
        }
    }, [open, initial]);
    const duplicateTitle = useMemo(() => {
        const current = title.trim().toLowerCase();
        if (!current)
            return false;
        const others = initial ? existingTitles.filter(t => t.toLowerCase() !== initial.title.toLowerCase()) : existingTitles;
        return others.map(t => t.toLowerCase()).includes(current);
    }, [title, existingTitles, initial]);
    const canSubmit = !!title.trim() &&
        !duplicateTitle &&
        typeof revenue === 'number' && revenue >= 0 &&
        typeof timeTaken === 'number' && timeTaken > 0 &&
        !!priority &&
        !!status;
    const handleSubmit = () => {
        const safeTime = typeof timeTaken === 'number' && timeTaken > 0 ? timeTaken : 1; // auto-correct
        const payload = {
            title: title.trim(),
            revenue: typeof revenue === 'number' ? revenue : 0,
            timeTaken: safeTime,
            priority: (priority || 'Medium'),
            status: (status || 'Todo'),
            notes: notes.trim() || undefined,
            createdAt: initial?.createdAt || new Date().toISOString(),
            ...(initial ? { id: initial.id } : {}),
        };
        onSubmit(payload);
        onClose();
    };
    return (_jsxs(Dialog, { open: open, onClose: onClose, fullWidth: true, maxWidth: "sm", children: [_jsx(DialogTitle, { children: initial ? 'Edit Task' : 'Add Task' }), _jsx(DialogContent, { children: _jsxs(Stack, { spacing: 2, mt: 1, children: [_jsx(TextField, { label: "Title", value: title, onChange: e => setTitle(e.target.value), error: !!title && duplicateTitle, helperText: duplicateTitle ? 'Duplicate title not allowed' : ' ', required: true, autoFocus: true }), _jsxs(Stack, { direction: { xs: 'column', sm: 'row' }, spacing: 2, children: [_jsx(TextField, { label: "Revenue", type: "number", value: revenue, onChange: e => setRevenue(e.target.value === '' ? '' : Number(e.target.value)), inputProps: { min: 0, step: 1 }, required: true, fullWidth: true }), _jsx(TextField, { label: "Time Taken (h)", type: "number", value: timeTaken, onChange: e => setTimeTaken(e.target.value === '' ? '' : Number(e.target.value)), inputProps: { min: 1, step: 1 }, required: true, fullWidth: true })] }), _jsxs(Stack, { direction: { xs: 'column', sm: 'row' }, spacing: 2, children: [_jsxs(FormControl, { fullWidth: true, required: true, children: [_jsx(InputLabel, { id: "priority-label", children: "Priority" }), _jsx(Select, { labelId: "priority-label", label: "Priority", value: priority, onChange: e => setPriority(e.target.value), children: priorities.map(p => (_jsx(MenuItem, { value: p, children: p }, p))) })] }), _jsxs(FormControl, { fullWidth: true, required: true, children: [_jsx(InputLabel, { id: "status-label", children: "Status" }), _jsx(Select, { labelId: "status-label", label: "Status", value: status, onChange: e => setStatus(e.target.value), children: statuses.map(s => (_jsx(MenuItem, { value: s, children: s }, s))) })] })] }), _jsx(TextField, { label: "Notes", value: notes, onChange: e => setNotes(e.target.value), multiline: true, minRows: 2 })] }) }), _jsxs(DialogActions, { children: [_jsx(Button, { onClick: onClose, children: "Cancel" }), _jsx(Button, { onClick: handleSubmit, variant: "contained", disabled: !canSubmit, children: initial ? 'Save Changes' : 'Add Task' })] })] }));
}
