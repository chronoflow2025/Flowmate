'use client';

import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { useProductivityScores } from '@/stores/feedback';
import { getProductivityBadge, getBadgeColor } from '@/types/shared';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { cn } from '@/lib/utils';

const locales = {
  'en-US': require('date-fns/locale/en-US'),
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

interface ProductivityCalendarProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  className?: string;
}

export function ProductivityCalendar({
  selectedDate,
  onDateChange,
  className,
}: ProductivityCalendarProps) {
  const productivityScores = useProductivityScores((state: { scores: Record<string, any> }) => state.scores);

  const customDayPropGetter = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const score = productivityScores[dateStr];

    if (!score) {
      return {};
    }

    const badge = getProductivityBadge(score.score);
    const color = getBadgeColor(badge);

    return {
      style: {
        backgroundColor: color + '20',
        border: `2px solid ${color}`,
      },
    };
  };

  const customDateCellWrapper = ({ children, value }: any) => {
    const dateStr = format(value, 'yyyy-MM-dd');
    const score = productivityScores[dateStr];

    if (!score) {
      return children;
    }

    const badge = getProductivityBadge(score.score);
    const badgeEmoji = {
      excellent: '🟢',
      good: '🟡',
      average: '🟠',
      'needs-work': '🔴',
    }[badge];

    return (
      <div className="relative">
        {children}
        <div className="absolute top-1 right-1 text-xs">
          {badgeEmoji}
        </div>
      </div>
    );
  };

  return (
    <div className={cn('productivity-calendar', className)}>
      <style jsx global>{`
        .productivity-calendar .rbc-calendar {
          font-family: inherit;
        }
        .productivity-calendar .rbc-header {
          padding: 0.75rem 0;
          font-weight: 600;
          border-bottom: 1px solid hsl(var(--border));
        }
        .productivity-calendar .rbc-month-view {
          border: 1px solid hsl(var(--border));
          border-radius: 0.5rem;
          overflow: hidden;
        }
        .productivity-calendar .rbc-day-bg {
          border-left: 1px solid hsl(var(--border));
        }
        .productivity-calendar .rbc-month-row {
          border-top: 1px solid hsl(var(--border));
        }
        .productivity-calendar .rbc-date-cell {
          padding: 0.5rem;
          text-align: right;
        }
        .productivity-calendar .rbc-now {
          background-color: hsl(var(--primary) / 0.1);
        }
        .productivity-calendar .rbc-off-range-bg {
          background-color: hsl(var(--muted) / 0.3);
        }
        .productivity-calendar .rbc-today {
          background-color: hsl(var(--primary) / 0.15);
        }
        .productivity-calendar .rbc-selected {
          background-color: hsl(var(--primary) / 0.3) !important;
        }
      `}</style>
      <Calendar
        localizer={localizer}
        date={selectedDate}
        onNavigate={onDateChange}
        onSelectSlot={(slotInfo: any) => onDateChange(slotInfo.start)}
        view="month"
        views={['month']}
        selectable
        toolbar={true}
        dayPropGetter={customDayPropGetter}
        components={{
          dateCellWrapper: customDateCellWrapper,
        }}
        style={{ height: '100%', width: '100%' }}
      />
      <div className="mt-4 flex flex-wrap gap-3 text-xs">
        <div className="flex items-center gap-1">
          <span>🟢</span>
          <span className="text-muted-foreground">90-100% Excellent</span>
        </div>
        <div className="flex items-center gap-1">
          <span>🟡</span>
          <span className="text-muted-foreground">70-89% Good</span>
        </div>
        <div className="flex items-center gap-1">
          <span>🟠</span>
          <span className="text-muted-foreground">50-69% Average</span>
        </div>
        <div className="flex items-center gap-1">
          <span>🔴</span>
          <span className="text-muted-foreground">&lt;50% Needs work</span>
        </div>
      </div>
    </div>
  );
}
