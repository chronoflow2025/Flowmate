'use client';

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface TimeOfDayActivityChartProps {
  data: Array<{
    hour: string;
    focus: number;
    completion: number;
    tasks: number;
  }>;
}

export function TimeOfDayActivityChart({ data }: TimeOfDayActivityChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="h-80 flex items-center justify-center text-muted-foreground">
        No hourly activity data available yet
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={320}>
      <AreaChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <defs>
          <linearGradient id="colorFocus" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
          </linearGradient>
          <linearGradient id="colorCompletion" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        <XAxis 
          dataKey="hour"
          className="text-xs text-muted-foreground"
          tick={{ fill: 'currentColor' }}
        />
        <YAxis 
          className="text-xs text-muted-foreground"
          tick={{ fill: 'currentColor' }}
        />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: 'hsl(var(--card))', 
            border: '1px solid hsl(var(--border))',
            borderRadius: '6px'
          }}
          labelStyle={{ color: 'hsl(var(--foreground))' }}
        />
        <Area 
          type="monotone" 
          dataKey="focus" 
          name="Avg Focus"
          stroke="hsl(var(--primary))" 
          fillOpacity={1} 
          fill="url(#colorFocus)" 
        />
        <Area 
          type="monotone" 
          dataKey="completion" 
          name="Avg Completion %"
          stroke="#10b981" 
          fillOpacity={1} 
          fill="url(#colorCompletion)" 
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
