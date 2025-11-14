import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Card, CardContent, List, ListItem, ListItemText, Typography } from '@mui/material';
export default function ActivityLog({ items }) {
    return (_jsx(Card, { children: _jsxs(CardContent, { children: [_jsx(Typography, { variant: "h6", fontWeight: 700, gutterBottom: true, children: "Activity" }), _jsxs(List, { dense: true, children: [items.length === 0 && (_jsx(ListItem, { children: _jsx(ListItemText, { primary: "No recent activity" }) })), items.map(a => (_jsx(ListItem, { divider: true, children: _jsx(ListItemText, { primary: a.summary, secondary: new Date(a.ts).toLocaleString() }) }, a.id)))] })] }) }));
}
