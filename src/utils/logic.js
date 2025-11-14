// ---------------------- Core Computations ----------------------
export function computeROI(revenue, timeTaken) {
    // Prevent divide-by-zero and non-finite values
    if (!Number.isFinite(revenue) || !Number.isFinite(timeTaken) || timeTaken <= 0)
        return null;
    return revenue / timeTaken;
}
export function computePriorityWeight(priority) {
    switch (priority) {
        case 'High':
            return 3;
        case 'Medium':
            return 2;
        default:
            return 1;
    }
}
export function withDerived(task) {
    return {
        ...task,
        roi: computeROI(task.revenue, task.timeTaken),
        priorityWeight: computePriorityWeight(task.priority),
    };
}
// ---------------------- FIXED: Stable Sorting ----------------------
export function sortTasks(tasks) {
    return [...tasks].sort((a, b) => {
        const aROI = a.roi ?? -Infinity;
        const bROI = b.roi ?? -Infinity;
        // 1️⃣ Sort by ROI descending
        if (bROI !== aROI)
            return bROI - aROI;
        // 2️⃣ Sort by priority weight descending
        if (b.priorityWeight !== a.priorityWeight)
            return b.priorityWeight - a.priorityWeight;
        // 3️⃣ Tie-breaker: createdAt ascending (older tasks first)
        if (a.createdAt && b.createdAt && a.createdAt !== b.createdAt) {
            return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        }
        // 4️⃣ Final fallback: title alphabetical (A → Z)
        return a.title.localeCompare(b.title);
    });
}
// ---------------------- Metrics ----------------------
export function computeTotalRevenue(tasks) {
    return tasks.filter(t => t.status === 'Done').reduce((sum, t) => sum + t.revenue, 0);
}
export function computeTotalTimeTaken(tasks) {
    return tasks.reduce((sum, t) => sum + t.timeTaken, 0);
}
export function computeTimeEfficiency(tasks) {
    if (tasks.length === 0)
        return 0;
    const done = tasks.filter(t => t.status === 'Done').length;
    return (done / tasks.length) * 100;
}
export function computeRevenuePerHour(tasks) {
    const revenue = computeTotalRevenue(tasks);
    const time = computeTotalTimeTaken(tasks);
    return time > 0 ? revenue / time : 0;
}
export function computeAverageROI(tasks) {
    const rois = tasks
        .map(t => computeROI(t.revenue, t.timeTaken))
        .filter((v) => typeof v === 'number' && Number.isFinite(v));
    if (rois.length === 0)
        return 0;
    return rois.reduce((s, r) => s + r, 0) / rois.length;
}
export function computePerformanceGrade(avgROI) {
    if (avgROI > 500)
        return 'Excellent';
    if (avgROI >= 200)
        return 'Good';
    return 'Needs Improvement';
}
export function computeFunnel(tasks) {
    const todo = tasks.filter(t => t.status === 'Todo').length;
    const inProgress = tasks.filter(t => t.status === 'In Progress').length;
    const done = tasks.filter(t => t.status === 'Done').length;
    const baseTodo = todo + inProgress + done;
    const conversionTodoToInProgress = baseTodo ? (inProgress + done) / baseTodo : 0;
    const conversionInProgressToDone = inProgress ? done / inProgress : 0;
    return { todo, inProgress, done, conversionTodoToInProgress, conversionInProgressToDone };
}
// ---------------------- Helper Utilities ----------------------
export function daysBetween(aISO, bISO) {
    const a = new Date(aISO).getTime();
    const b = new Date(bISO).getTime();
    return Math.max(0, Math.round((b - a) / (24 * 3600 * 1000)));
}
export function computeVelocityByPriority(tasks) {
    const groups = { High: [], Medium: [], Low: [] };
    tasks.forEach(t => {
        if (t.completedAt)
            groups[t.priority].push(daysBetween(t.createdAt, t.completedAt));
    });
    const stats = {
        High: { avgDays: 0, medianDays: 0 },
        Medium: { avgDays: 0, medianDays: 0 },
        Low: { avgDays: 0, medianDays: 0 },
    };
    Object.keys(groups).forEach(k => {
        const arr = groups[k].slice().sort((a, b) => a - b);
        const avg = arr.length ? arr.reduce((s, v) => s + v, 0) / arr.length : 0;
        const mid = arr.length ? arr[Math.floor(arr.length / 2)] : 0;
        stats[k] = { avgDays: avg, medianDays: mid };
    });
    return stats;
}
// ---------------------- Weekly Throughput ----------------------
export function computeThroughputByWeek(tasks) {
    const byWeek = new Map();
    tasks.forEach(t => {
        if (!t.completedAt)
            return;
        const d = new Date(t.completedAt);
        const weekKey = `${d.getUTCFullYear()}-W${getWeekNumber(d)}`;
        const v = byWeek.get(weekKey) ?? { count: 0, revenue: 0 };
        v.count += 1;
        v.revenue += t.revenue;
        byWeek.set(weekKey, v);
    });
    return Array.from(byWeek.entries())
        .sort((a, b) => a[0].localeCompare(b[0]))
        .map(([week, v]) => ({ week, ...v }));
}
function getWeekNumber(d) {
    const target = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
    const dayNr = (target.getUTCDay() + 6) % 7;
    target.setUTCDate(target.getUTCDate() - dayNr + 3);
    const firstThursday = new Date(Date.UTC(target.getUTCFullYear(), 0, 4));
    const diff = target.getTime() - firstThursday.getTime();
    return 1 + Math.round(diff / (7 * 24 * 3600 * 1000));
}
// ---------------------- Weighted Pipeline & Forecast ----------------------
export function computeWeightedPipeline(tasks) {
    const p = { 'Todo': 0.1, 'In Progress': 0.5, 'Done': 1 };
    return tasks.reduce((s, t) => s + t.revenue * p[t.status], 0);
}
export function computeForecast(weekly, horizonWeeks = 4) {
    if (weekly.length < 2)
        return [];
    const y = weekly.map(w => w.revenue);
    const x = weekly.map((_, i) => i);
    const n = x.length;
    const sumX = x.reduce((s, v) => s + v, 0);
    const sumY = y.reduce((s, v) => s + v, 0);
    const sumXY = x.reduce((s, v, i) => s + v * y[i], 0);
    const sumXX = x.reduce((s, v) => s + v * v, 0);
    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX || 1);
    const intercept = (sumY - slope * sumX) / n;
    const lastIndex = x[x.length - 1];
    const result = [];
    for (let i = 1; i <= horizonWeeks; i++) {
        const idx = lastIndex + i;
        result.push({ week: `+${i}`, revenue: Math.max(0, slope * idx + intercept) });
    }
    return result;
}
// ---------------------- Cohort Revenue ----------------------
export function computeCohortRevenue(tasks) {
    const rows = [];
    const byKey = new Map();
    tasks.forEach(t => {
        const d = new Date(t.createdAt);
        const key = `${d.getUTCFullYear()}-W${getWeekNumber(d)}|${t.priority}`;
        byKey.set(key, (byKey.get(key) ?? 0) + t.revenue);
    });
    byKey.forEach((revenue, key) => {
        const [week, priority] = key.split('|');
        rows.push({ week, priority, revenue });
    });
    return rows.sort((a, b) => a.week.localeCompare(b.week));
}
export function safeRoi(revenue, timeTaken) {
    if (typeof revenue !== 'number' || typeof timeTaken !== 'number' || timeTaken <= 0)
        return null;
    const roi = revenue / timeTaken;
    if (!isFinite(roi) || isNaN(roi))
        return null;
    return parseFloat(roi.toFixed(2)); // consistent 2 decimal precision
}
