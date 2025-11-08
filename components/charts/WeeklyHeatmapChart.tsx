'use client';

interface WeeklyHeatmapChartProps {
  data: Array<{
    day: string;
    hour: number;
    activity: number;
  }>;
}

export function WeeklyHeatmapChart({ data }: WeeklyHeatmapChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="h-80 flex items-center justify-center text-muted-foreground">
        No activity data available yet
      </div>
    );
  }

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const hours = Array.from({ length: 24 }, (_, i) => i);

  const getActivityColor = (activity: number) => {
    if (activity === 0) return 'bg-muted';
    if (activity < 30) return 'bg-blue-200 dark:bg-blue-900';
    if (activity < 60) return 'bg-blue-400 dark:bg-blue-700';
    if (activity < 80) return 'bg-blue-600 dark:bg-blue-500';
    return 'bg-blue-800 dark:bg-blue-300';
  };

  const getActivityValue = (day: string, hour: number) => {
    const item = data.find(d => d.day === day && d.hour === hour);
    return item?.activity || 0;
  };

  return (
    <div className="h-80 overflow-auto p-4">
      <div className="flex gap-2">
        <div className="flex flex-col justify-around text-xs text-muted-foreground w-12">
          {hours.filter(h => h % 3 === 0).map(hour => (
            <div key={hour} className="h-6 flex items-center">
              {hour}:00
            </div>
          ))}
        </div>
        <div className="flex-1">
          <div className="flex gap-1 mb-2">
            {days.map(day => (
              <div key={day} className="flex-1 text-center text-xs font-medium text-muted-foreground">
                {day}
              </div>
            ))}
          </div>
          <div className="space-y-1">
            {hours.map(hour => (
              <div key={hour} className="flex gap-1">
                {days.map(day => {
                  const activity = getActivityValue(day, hour);
                  return (
                    <div
                      key={`${day}-${hour}`}
                      className={`flex-1 h-4 rounded-sm ${getActivityColor(activity)} transition-colors hover:ring-2 hover:ring-primary`}
                      title={`${day} ${hour}:00 - Activity: ${activity}%`}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2 mt-4 text-xs text-muted-foreground">
        <span>Less</span>
        <div className="flex gap-1">
          <div className="w-4 h-4 bg-muted rounded-sm" />
          <div className="w-4 h-4 bg-blue-200 dark:bg-blue-900 rounded-sm" />
          <div className="w-4 h-4 bg-blue-400 dark:bg-blue-700 rounded-sm" />
          <div className="w-4 h-4 bg-blue-600 dark:bg-blue-500 rounded-sm" />
          <div className="w-4 h-4 bg-blue-800 dark:bg-blue-300 rounded-sm" />
        </div>
        <span>More</span>
      </div>
    </div>
  );
}
