import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo, useState } from 'react';
import { Box, Button, Card, CardContent, IconButton, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip, Typography, Dialog, DialogActions, DialogContent, DialogTitle, } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import TaskForm from '@/components/TaskForm';
import TaskDetailsDialog from '@/components/TaskDetailsDialog';
import { safeRoi } from '@/utils/logic';
// Confirmation dialog for delete
function ConfirmDialog({ open, title, message, onCancel, onConfirm, }) {
    return (_jsxs(Dialog, { open: open, onClose: onCancel, children: [_jsx(DialogTitle, { children: title }), _jsx(DialogContent, { children: _jsx(Typography, { children: message }) }), _jsxs(DialogActions, { children: [_jsx(Button, { onClick: onCancel, children: "Cancel" }), _jsx(Button, { onClick: onConfirm, color: "error", variant: "contained", children: "Delete" })] })] }));
}
export default function TaskTable({ tasks, onAdd, onUpdate, onDelete }) {
    const [openForm, setOpenForm] = useState(false);
    const [editing, setEditing] = useState(null);
    const [details, setDetails] = useState(null);
    const [confirmId, setConfirmId] = useState(null);
    const existingTitles = useMemo(() => tasks.map((t) => t.title), [tasks]);
    // Add Task
    const handleAddClick = () => {
        setEditing(null);
        setOpenForm(true);
    };
    // Edit Task
    const handleEditClick = (e, task) => {
        e.stopPropagation(); // prevent view dialog from opening
        setEditing(task);
        setOpenForm(true);
    };
    // Delete Task (confirmation first)
    const handleDeleteClick = (e, id) => {
        e.stopPropagation();
        setConfirmId(id);
    };
    const confirmDelete = () => {
        if (confirmId) {
            onDelete(confirmId);
            setConfirmId(null);
        }
    };
    // Submit handler (Add or Update)
    const handleSubmit = (value) => {
        if (value.id) {
            const { id, ...rest } = value;
            onUpdate(id, rest);
        }
        else {
            onAdd(value);
        }
    };
    // Precompute safe ROI for each task
    const safeTasks = tasks.map((t) => ({
        ...t,
        safeRoi: safeRoi(t.revenue, t.timeTaken),
    }));
    return (_jsxs(Card, { children: [_jsxs(CardContent, { children: [_jsxs(Stack, { direction: "row", alignItems: "center", justifyContent: "space-between", mb: 2, children: [_jsx(Typography, { variant: "h6", fontWeight: 700, children: "Tasks" }), _jsx(Button, { startIcon: _jsx(AddIcon, {}), variant: "contained", onClick: handleAddClick, children: "Add Task" })] }), _jsx(TableContainer, { sx: { maxHeight: 520 }, children: _jsxs(Table, { stickyHeader: true, children: [_jsx(TableHead, { children: _jsxs(TableRow, { children: [_jsx(TableCell, { children: "Title" }), _jsx(TableCell, { align: "right", children: "Revenue" }), _jsx(TableCell, { align: "right", children: "Time (h)" }), _jsx(TableCell, { align: "right", children: "ROI" }), _jsx(TableCell, { children: "Priority" }), _jsx(TableCell, { children: "Status" }), _jsx(TableCell, { align: "right", children: "Actions" })] }) }), _jsxs(TableBody, { children: [safeTasks.map((t) => (_jsxs(TableRow, { hover: true, onClick: () => setDetails(t), sx: { cursor: 'pointer' }, children: [_jsx(TableCell, { children: _jsxs(Stack, { spacing: 0.5, children: [_jsx(Typography, { fontWeight: 600, children: t.title }), t.notes && (
                                                            // (BUG 6 - XSS risk will be handled later)
                                                            _jsx(Typography, { variant: "caption", color: "text.secondary", noWrap: true, title: t.notes, dangerouslySetInnerHTML: {
                                                                    __html: String(t.notes).replace(/</g, '&lt;').replace(/>/g, '&gt;'),
                                                                } }))] }) }), _jsxs(TableCell, { align: "right", children: ["$", t.revenue.toLocaleString()] }), _jsx(TableCell, { align: "right", children: t.timeTaken }), _jsx(TableCell, { align: "right", children: t.safeRoi === null ? '—' : t.safeRoi.toFixed(2) }), _jsx(TableCell, { children: t.priority }), _jsx(TableCell, { children: t.status }), _jsx(TableCell, { align: "right", children: _jsxs(Stack, { direction: "row", spacing: 1, justifyContent: "flex-end", children: [_jsx(Tooltip, { title: "Edit", children: _jsx(IconButton, { onClick: (e) => handleEditClick(e, t), size: "small", children: _jsx(EditIcon, { fontSize: "small" }) }) }), _jsx(Tooltip, { title: "Delete", children: _jsx(IconButton, { onClick: (e) => handleDeleteClick(e, t.id), size: "small", color: "error", children: _jsx(DeleteIcon, { fontSize: "small" }) }) })] }) })] }, t.id))), tasks.length === 0 && (_jsx(TableRow, { children: _jsx(TableCell, { colSpan: 7, children: _jsx(Box, { py: 6, textAlign: "center", color: "text.secondary", children: "No tasks yet. Click \"Add Task\" to get started." }) }) }))] })] }) })] }), _jsx(TaskForm, { open: openForm, onClose: () => setOpenForm(false), onSubmit: handleSubmit, existingTitles: existingTitles, initial: editing }), _jsx(TaskDetailsDialog, { open: !!details, task: details, onClose: () => setDetails(null), onSave: onUpdate }), _jsx(ConfirmDialog, { open: !!confirmId, title: "Delete Task", message: "Are you sure you want to delete this task? This action cannot be undone.", onCancel: () => setConfirmId(null), onConfirm: confirmDelete })] }));
}
