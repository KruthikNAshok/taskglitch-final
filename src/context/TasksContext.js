import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext } from 'react';
import { useTasks } from '@/hooks/useTasks';
const TasksContext = createContext(undefined);
export function TasksProvider({ children }) {
    const value = useTasks();
    return _jsx(TasksContext.Provider, { value: value, children: children });
}
export function useTasksContext() {
    const ctx = useContext(TasksContext);
    if (!ctx)
        throw new Error('useTasksContext must be used within TasksProvider');
    return ctx;
}
