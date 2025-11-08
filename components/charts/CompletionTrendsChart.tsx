'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface CompletionTrendsChartProps {
  data: Array<{
    week: string;
    completed: number;
    total: number;
    rate: number;
  }>;
}

export function CompletionTrendsChart({ data }: CompletionTrendsChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="h-80 flex items-center justify-center text-muted-foreground">
        No completion data available yet
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={320}>
      <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        <XAxis 
          dataKey="week"
          className="text-xs text-muted-foreground"
          tick={{ fill: 'currentColor' }}
        />
        <YAxis 
          className="text-xs text-muted-foreground"
          tick={{ fill: 'currentColor' }}
          label={{ value: 'Tasks', angle: -90, position: 'insideLeft' }}
        />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: 'hsl(var(--card))', 
            border: '1px solid hsl(var(--border))',
            borderRadius: '6px'
          }}
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              const data = payload[0].payload;
              return (
                <div className="bg-card border border-border rounded-md p-3 shadow-lg">
                  <p className="font-medium text-sm">{data.week}</p>
                  <p className="text-xs text-green-600 dark:text-green-400">
                    Completed: {data.completed} ({data.rate}%)
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Total: {data.total}
                  </p>
                </div>
              );
            }
            return null;
          }}
        />
        <Legend />
        <Bar dataKey="completed" name="Completed Tasks" fill="#10b981" radius={[8, 8, 0, 0]} />
        <Bar dataKey="total" name="Total Tasks" fill="hsl(var(--muted))" radius={[8, 8, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
