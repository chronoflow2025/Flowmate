'use client';

import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ZAxis, Legend } from 'recharts';

interface FocusVsCompletionChartProps {
  data: Array<{
    focus: number;
    completion: number;
    taskName: string;
  }>;
}

export function FocusVsCompletionChart({ data }: FocusVsCompletionChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="h-80 flex items-center justify-center text-muted-foreground">
        No task data available yet
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={320}>
      <ScatterChart margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        <XAxis 
          type="number" 
          dataKey="focus" 
          name="Focus Rating"
          domain={[0, 10]}
          className="text-xs text-muted-foreground"
          tick={{ fill: 'currentColor' }}
          label={{ value: 'Focus Rating', position: 'insideBottom', offset: -5 }}
        />
        <YAxis 
          type="number" 
          dataKey="completion" 
          name="Completion %"
          domain={[0, 100]}
          className="text-xs text-muted-foreground"
          tick={{ fill: 'currentColor' }}
          label={{ value: 'Completion %', angle: -90, position: 'insideLeft' }}
        />
        <ZAxis range={[60, 400]} />
        <Tooltip 
          cursor={{ strokeDasharray: '3 3' }}
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
                  <p className="font-medium text-sm">{data.taskName}</p>
                  <p className="text-xs text-muted-foreground">
                    Focus: {data.focus}/10
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Completion: {data.completion}%
                  </p>
                </div>
              );
            }
            return null;
          }}
        />
        <Scatter 
          name="Tasks" 
          data={data} 
          fill="hsl(var(--primary))"
          fillOpacity={0.6}
        />
      </ScatterChart>
    </ResponsiveContainer>
  );
}
