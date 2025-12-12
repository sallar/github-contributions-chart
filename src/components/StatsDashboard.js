import { useMemo, useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  TbSum,
  TbFlame,
  TbTrendingUp,
  TbStar,
  TbChartLine,
  TbCalendarEvent,
  TbCalendar,
  TbArrowUpRight,
  TbChartBar
} from "react-icons/tb";
import StatCard from "./StatCard";
import { calculateStats, formatNumber } from "../utils/stats";

const StatsDashboard = ({ data }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const stats = useMemo(() => calculateStats(data), [data]);

  if (!mounted) {
    return null;
  }

  return (
    <div className="StatsDashboard">
      <h3 className="StatsDashboard-title">
        <TbChartBar /> Contribution Statistics
      </h3>
      <div className="StatsDashboard-grid">
        <StatCard
          icon={<TbSum />}
          label="Total Contributions"
          value={formatNumber(stats.total)}
        />
        <StatCard
          icon={<TbFlame />}
          label="Longest Streak"
          value={`${stats.longestStreak} days`}
        />
        <StatCard
          icon={<TbTrendingUp />}
          label="Current Streak"
          value={`${stats.currentStreak} days`}
        />
        <StatCard
          icon={<TbStar />}
          label="Best Day"
          value={`Level ${stats.bestDay.intensity}`}
          subtext={stats.bestDay.date}
        />
        <StatCard
          icon={<TbChartLine />}
          label="Daily Average"
          value={stats.dailyAverage}
        />
        <StatCard
          icon={<TbCalendarEvent />}
          label="Busiest Day"
          value={stats.busiestDayOfWeek}
        />
        <StatCard
          icon={<TbCalendar />}
          label="Busiest Month"
          value={stats.busiestMonth}
        />
        {stats.yearOverYear && (
          <StatCard
            icon={<TbArrowUpRight />}
            label="Year-over-Year"
            value={stats.yearOverYear}
          />
        )}
      </div>
    </div>
  );
};

StatsDashboard.propTypes = {
  data: PropTypes.shape({
    years: PropTypes.array.isRequired,
    contributions: PropTypes.array.isRequired
  }).isRequired
};

export default StatsDashboard;
