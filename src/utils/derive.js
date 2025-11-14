import { computeROI, computePriorityWeight, computeTotalRevenue, computeTotalTimeTaken, computeTimeEfficiency, computeRevenuePerHour, computeAverageROI, computePerformanceGrade, } from './logic';
/**
 * ✅ Adds derived ROI and priorityWeight to each task
 */
export function deriveTasks(tasks) {
    return tasks.map(task => ({
        ...task,
        roi: computeROI(task.revenue, task.timeTaken),
        priorityWeight: computePriorityWeight(task.priority),
    }));
}
/**
 * ✅ Stable sort with deterministic tie-breakers (fixes BUG 3)
 */
export function sortTasks(tasks) {
    return [...tasks].sort((a, b) => {
        const aROI = a.roi ?? -Infinity;
        const bROI = b.roi ?? -Infinity;
        if (bROI !== aROI)
            return bROI - aROI;
        if (b.priorityWeight !== a.priorityWeight)
            return b.priorityWeight - a.priorityWeight;
        // Tie-breaker by title (alphabetically)
        return a.title.localeCompare(b.title);
    });
}
/**
 * ✅ Compute dashboard metrics
 * Handles all totals and derived performance values safely.
 */
export function computeMetrics(tasks) {
    const totalRevenue = computeTotalRevenue(tasks);
    const totalTime = computeTotalTimeTaken(tasks);
    const timeEfficiencyPct = computeTimeEfficiency(tasks);
    const revenuePerHour = computeRevenuePerHour(tasks);
    const avgROI = computeAverageROI(tasks);
    const grade = computePerformanceGrade(avgROI);
    return {
        totalRevenue,
        totalTime,
        totalTimeTaken: totalTime,
        timeEfficiencyPct,
        revenuePerHour,
        averageROI: avgROI, // ✅ match the Metrics interface
        performanceGrade: grade,
    };
}
