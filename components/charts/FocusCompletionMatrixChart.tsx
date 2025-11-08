'use client';

interface FocusCompletionMatrixChartProps {
  data: {
    highFocusHighCompletion: number;
    highFocusLowCompletion: number;
    lowFocusHighCompletion: number;
    lowFocusLowCompletion: number;
  };
}

export function FocusCompletionMatrixChart({ data }: FocusCompletionMatrixChartProps) {
  const total = data.highFocusHighCompletion + data.highFocusLowCompletion + 
                data.lowFocusHighCompletion + data.lowFocusLowCompletion;

  if (total === 0) {
    return (
      <div className="h-80 flex items-center justify-center text-muted-foreground">
        No task distribution data available yet
      </div>
    );
  }

  const getPercentage = (value: number) => {
    return total > 0 ? Math.round((value / total) * 100) : 0;
  };

  const quadrants = [
    {
      title: 'High Focus, High Completion',
      count: data.highFocusHighCompletion,
      color: 'bg-green-500 dark:bg-green-600',
      textColor: 'text-green-700 dark:text-green-300',
      position: 'top-right',
      description: 'Optimal performance'
    },
    {
      title: 'High Focus, Low Completion',
      count: data.highFocusLowCompletion,
      color: 'bg-yellow-500 dark:bg-yellow-600',
      textColor: 'text-yellow-700 dark:text-yellow-300',
      position: 'top-left',
      description: 'Needs better time management'
    },
    {
      title: 'Low Focus, High Completion',
      count: data.lowFocusHighCompletion,
      color: 'bg-blue-500 dark:bg-blue-600',
      textColor: 'text-blue-700 dark:text-blue-300',
      position: 'bottom-right',
      description: 'Task mastery, maintain momentum'
    },
    {
      title: 'Low Focus, Low Completion',
      count: data.lowFocusLowCompletion,
      color: 'bg-red-500 dark:bg-red-600',
      textColor: 'text-red-700 dark:text-red-300',
      position: 'bottom-left',
      description: 'Needs improvement'
    },
  ];

  return (
    <div className="h-80 p-4">
      <div className="grid grid-cols-2 gap-4 h-full">
        <div className="space-y-4">
          {quadrants.slice(0, 2).map((quadrant, idx) => (
            <div 
              key={idx}
              className="border-2 border-border rounded-lg p-4 h-[calc(50%-0.5rem)] flex flex-col justify-between"
            >
              <div>
                <div className={`inline-block px-2 py-1 rounded-md ${quadrant.color} text-white text-xs font-medium mb-2`}>
                  {quadrant.title.split(',')[0]}
                </div>
                <div className={`inline-block px-2 py-1 rounded-md ${quadrant.color} text-white text-xs font-medium mb-2 ml-1`}>
                  {quadrant.title.split(',')[1]}
                </div>
              </div>
              <div>
                <div className={`text-3xl font-bold ${quadrant.textColor}`}>
                  {quadrant.count}
                </div>
                <div className="text-sm text-muted-foreground">
                  {getPercentage(quadrant.count)}% of tasks
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {quadrant.description}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="space-y-4">
          {quadrants.slice(2, 4).map((quadrant, idx) => (
            <div 
              key={idx}
              className="border-2 border-border rounded-lg p-4 h-[calc(50%-0.5rem)] flex flex-col justify-between"
            >
              <div>
                <div className={`inline-block px-2 py-1 rounded-md ${quadrant.color} text-white text-xs font-medium mb-2`}>
                  {quadrant.title.split(',')[0]}
                </div>
                <div className={`inline-block px-2 py-1 rounded-md ${quadrant.color} text-white text-xs font-medium mb-2 ml-1`}>
                  {quadrant.title.split(',')[1]}
                </div>
              </div>
              <div>
                <div className={`text-3xl font-bold ${quadrant.textColor}`}>
                  {quadrant.count}
                </div>
                <div className="text-sm text-muted-foreground">
                  {getPercentage(quadrant.count)}% of tasks
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {quadrant.description}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-4 text-center text-xs text-muted-foreground">
        Total Tasks Analyzed: {total}
      </div>
    </div>
  );
}
