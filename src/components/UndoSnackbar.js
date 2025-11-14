import { jsx as _jsx } from "react/jsx-runtime";
import { Snackbar, Button } from '@mui/material';
export default function UndoSnackbar({ open, onClose, onUndo }) {
    return (_jsx(Snackbar, { open: open, onClose: onClose, autoHideDuration: 4000, message: "Task deleted", action: _jsx(Button, { color: "secondary", size: "small", onClick: onUndo, children: "Undo" }), anchorOrigin: { vertical: 'bottom', horizontal: 'center' } }));
}
