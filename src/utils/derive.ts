import { DerivedTask, Task, Metrics } from '@/types';
import {
  computeROI,
  computePriorityWeight,
  computeTotalRevenue,
  computeTotalTimeTaken,
  computeTimeEfficiency,
  computeRevenuePerHour,
  computeAverageROI,
  computePerformanceGrade,
} from './logic';

// ✅ Adds derived ROI and priorityWeight to each task
export function deriveTasks(tasks: ReadonlyArray<Task>): DerivedTask[] {
  return tasks.map(task => ({
    ...task,
    roi: computeROI(task.revenue, task.timeTaken),
    priorityWeight: computePriorityWeight(task.priority),
  }));
}

// ✅ Stable sort with deterministic tie-breakers (fixes BUG 3)
export function sortTasks(tasks: ReadonlyArray<DerivedTask>): DerivedTask[] {
  return [...tasks].sort((a, b) => {
    const aROI = a.roi ?? -Infinity;
    const bROI = b.roi ?? -Infinity;
    if (bROI !== aROI) return bROI - aROI;

    if (b.priorityWeight !== a.priorityWeight)
      return b.priorityWeight - a.priorityWeight;

    // tie-breaker by title (alphabetically)
    return a.title.localeCompare(b.title);
  });
}

// ✅ Compute dashboard metrics
export function computeMetrics(tasks: ReadonlyArray<Task>): Metrics {
  const totalRevenue = computeTotalRevenue(tasks);
  const totalTime = computeTotalTimeTaken(tasks);
  const timeEfficiency = computeTimeEfficiency(tasks);
  const revenuePerHour = computeRevenuePerHour(tasks);
  const avgROI = computeAverageROI(tasks);
  const grade = computePerformanceGrade(avgROI);

  return {
    totalRevenue,
    totalTime,
    timeEfficiency,
    revenuePerHour,
    avgROI,
    performanceGrade: grade,
  };
}
