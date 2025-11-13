import { useState, useMemo, useCallback, useEffect } from 'react';
import { Task, DerivedTask, Metrics } from '@/types';
import { loadTasks, saveTasks } from '@/utils/storage';
import { deriveTasks, computeMetrics } from '@/utils/derive';


export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastDeleted, setLastDeleted] = useState<Task | null>(null);

  // ✅ Load tasks once on mount
  useEffect(() => {
    try {
      const loaded = loadTasks();
      setTasks(loaded);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // ✅ Persist to localStorage whenever tasks change
  useEffect(() => {
    if (!loading) saveTasks(tasks);
  }, [tasks, loading]);

  // ✅ Derived data (sorted list + metrics)
  const derivedSorted: DerivedTask[] = useMemo(() => deriveTasks(tasks), [tasks]);
  const metrics: Metrics = useMemo(() => computeMetrics(tasks), [tasks]);

  // ✅ Add new task
  const addTask = useCallback((task: Omit<Task, 'id'> & { id?: string }) => {
    setTasks(prev => [...prev, { ...task, id: task.id ?? crypto.randomUUID() }]);
  }, []);

  // ✅ Update existing task
  const updateTask = useCallback((id: string, patch: Partial<Task>) => {
    setTasks(prev => prev.map(t => (t.id === id ? { ...t, ...patch } : t)));
  }, []);

  // ✅ Delete task
  const deleteTask = useCallback((id: string) => {
    setTasks(prev => {
      const toDelete = prev.find(t => t.id === id) || null;
      if (toDelete) setLastDeleted(toDelete);
      return prev.filter(t => t.id !== id);
    });
  }, []);

  // ✅ Undo delete (restore last deleted task)
  const undoDelete = useCallback(() => {
    if (lastDeleted) {
      setTasks(prev => [...prev, lastDeleted]);
      setLastDeleted(null);
    }
  }, [lastDeleted]);

  // ✅ FIX for Bug #2 → Clear deleted task state when snackbar closes
  const clearLastDeleted = useCallback(() => {
    setLastDeleted(null);
  }, []);

  return {
    tasks,
    loading,
    error,
    derivedSorted,
    metrics,
    lastDeleted,
    addTask,
    updateTask,
    deleteTask,
    undoDelete,
    clearLastDeleted, // ✅ new function added here
  };
}
