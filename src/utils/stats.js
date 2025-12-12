function isConsecutiveDay(date1, date2) {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const diffTime = d2.getTime() - d1.getTime();
  const diffDays = diffTime / (1000 * 60 * 60 * 24);
  return diffDays === 1;
}

function formatDate(dateString) {
  if (!dateString) return "N/A";
  const options = { year: "numeric", month: "short", day: "numeric" };
  return new Date(dateString).toLocaleDateString("en-US", options);
}

export function formatNumber(num) {
  return num.toLocaleString("en-US");
}

export function calculateTotal(years) {
  if (!years || years.length === 0) return 0;
  return years.reduce((sum, year) => sum + (year.total || 0), 0);
}


export function calculateLongestStreak(contributions) {
  if (!contributions || contributions.length === 0) return 0;

  const sorted = [...contributions].sort((a, b) =>
    a.date.localeCompare(b.date)
  );

  let longestStreak = 0;
  let currentStreak = 0;
  let previousDate = null;

  for (const contrib of sorted) {
    if (contrib.count > 0 || parseInt(contrib.intensity, 10) > 0) {
      if (previousDate && isConsecutiveDay(previousDate, contrib.date)) {
        currentStreak++;
      } else {
        currentStreak = 1;
      }
      longestStreak = Math.max(longestStreak, currentStreak);
      previousDate = contrib.date;
    } else {
      currentStreak = 0;
      previousDate = null;
    }
  }

  return longestStreak;
}

export function calculateCurrentStreak(contributions) {
  if (!contributions || contributions.length === 0) return 0;

  const today = new Date().toISOString().split("T")[0];
  let streak = 0;
  let expectedDate = today;

  for (const contrib of contributions) {
    if (contrib.date > today) continue;

    const hasContribution =
      contrib.count > 0 || parseInt(contrib.intensity, 10) > 0;

    if (contrib.date === expectedDate) {
      if (hasContribution) {
        streak++;
        const d = new Date(expectedDate);
        d.setDate(d.getDate() - 1);
        expectedDate = d.toISOString().split("T")[0];
      } else {
        if (contrib.date === today) {
          const d = new Date(expectedDate);
          d.setDate(d.getDate() - 1);
          expectedDate = d.toISOString().split("T")[0];
          continue;
        }
        break;
      }
    } else if (contrib.date < expectedDate) {
      break;
    }
  }

  return streak;
}

export function findBestDay(contributions) {
  if (!contributions || contributions.length === 0) {
    return { count: 0, date: "N/A" };
  }

  // Need to look at intensity since count is only populated on first day
  // Group by date and find max intensity, but we want actual contribution count
  // Since we don't have individual day counts, we'll use intensity as a proxy
  const best = contributions.reduce(
    (max, contrib) => {
      const intensity = parseInt(contrib.intensity, 10) || 0;
      if (intensity > max.intensity) {
        return { intensity, date: contrib.date };
      }
      return max;
    },
    { intensity: 0, date: null }
  );

  return {
    intensity: best.intensity,
    date: formatDate(best.date)
  };
}

export function calculateDailyAverage(years, contributions) {
  if (!contributions || contributions.length === 0) return "0.0";
  if (!years || years.length === 0) return "0.0";

  const total = calculateTotal(years);
  const totalDays = contributions.length;

  if (totalDays === 0) return "0.0";
  return (total / totalDays).toFixed(1);
}

export function findBusiestDayOfWeek(contributions) {
  if (!contributions || contributions.length === 0) return "N/A";

  const dayNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
  ];
  const dayCounts = [0, 0, 0, 0, 0, 0, 0];

  for (const contrib of contributions) {
    const dayIndex = new Date(contrib.date).getDay();
    const intensity = parseInt(contrib.intensity, 10) || 0;
    dayCounts[dayIndex] += intensity;
  }

  const maxCount = Math.max(...dayCounts);
  if (maxCount === 0) return "N/A";

  const busiestIndex = dayCounts.indexOf(maxCount);
  return dayNames[busiestIndex];
}

export function findBusiestMonth(contributions) {
  if (!contributions || contributions.length === 0) return "N/A";

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ];
  const monthCounts = Array(12).fill(0);

  for (const contrib of contributions) {
    const monthIndex = new Date(contrib.date).getMonth();
    const intensity = parseInt(contrib.intensity, 10) || 0;
    monthCounts[monthIndex] += intensity;
  }

  const maxCount = Math.max(...monthCounts);
  if (maxCount === 0) return "N/A";

  const busiestIndex = monthCounts.indexOf(maxCount);
  return monthNames[busiestIndex];
}


export function calculateYearOverYear(years) {
  if (!years || years.length < 2) return null;

  const currentYear = years[0];
  const previousYear = years[1];

  if (!previousYear.total || previousYear.total === 0) return null;

  const change =
    ((currentYear.total - previousYear.total) / previousYear.total) * 100;
  const sign = change >= 0 ? "+" : "";

  return `${sign}${change.toFixed(0)}%`;
}


function getEmptyStats() {
  return {
    total: 0,
    longestStreak: 0,
    currentStreak: 0,
    bestDay: { intensity: 0, date: "N/A" },
    dailyAverage: "0.0",
    busiestDayOfWeek: "N/A",
    busiestMonth: "N/A",
    yearOverYear: null
  };
}


export function calculateStats(data) {
  if (!data || !data.contributions || data.contributions.length === 0) {
    return getEmptyStats();
  }

  const { years, contributions } = data;

  return {
    total: calculateTotal(years),
    longestStreak: calculateLongestStreak(contributions),
    currentStreak: calculateCurrentStreak(contributions),
    bestDay: findBestDay(contributions),
    dailyAverage: calculateDailyAverage(years, contributions),
    busiestDayOfWeek: findBusiestDayOfWeek(contributions),
    busiestMonth: findBusiestMonth(contributions),
    yearOverYear: calculateYearOverYear(years)
  };
}
