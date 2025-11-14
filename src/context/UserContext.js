import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useMemo, useState } from 'react';
const UserContext = createContext(undefined);
export function UserProvider({ children }) {
    const [user, setUser] = useState({
        id: 'u-001',
        name: 'Avery (Sales Manager)',
        avatarUrl: undefined,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
        quota: { monthlyRevenueGoal: 50000 },
        preferences: { showOnboarding: true },
    });
    const value = useMemo(() => ({
        user,
        setShowOnboarding: (show) => setUser(prev => ({ ...prev, preferences: { ...prev.preferences, showOnboarding: show } })),
    }), [user]);
    return _jsx(UserContext.Provider, { value: value, children: children });
}
export function useUser() {
    const ctx = useContext(UserContext);
    if (!ctx)
        throw new Error('useUser must be used within UserProvider');
    return ctx;
}
