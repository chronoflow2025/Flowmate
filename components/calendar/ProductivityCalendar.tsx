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
      return <div role="presentation">{children}</div>;
    }

    const badge = getProductivityBadge(score.score);
    const badgeEmoji = {
      excellent: '🟢',
      good: '🟡',
      average: '🟠',
      'needs-work': '🔴',
    }[badge];

    return (
      <div className="relative" role="presentation">
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
          height: 320px !important;
        }
        .productivity-calendar .rbc-header {
          padding: 0.5rem 0;
          font-weight: 600;
          border-bottom: 1px solid hsl(var(--border));
          font-size: 0.875rem;
          background-color: hsl(var(--muted));
          color: hsl(var(--foreground));
        }
        .productivity-calendar .rbc-month-view {
          border: 1px solid hsl(var(--border));
          border-radius: 0.5rem;
          overflow: hidden;
          height: 320px !important;
        }
        .productivity-calendar .rbc-day-bg {
          border: none;
          aspect-ratio: 1;
        }
        .productivity-calendar .rbc-month-row {
          border-top: none;
          min-height: 45px;
          max-height: 45px;
          height: 45px;
          display: flex;
        }
        .productivity-calendar .rbc-row {
          display: flex;
          flex: 1;
          height: 100%;
        }
        .productivity-calendar .rbc-date-cell {
          padding: 0 !important;
          margin: 0;
          text-align: center;
          display: flex !important;
          align-items: center;
          justify-content: center;
          font-size: 0.875rem;
          flex: 1;
        }
        .productivity-calendar .rbc-date-cell a {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 100%;
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
      <div style={{ height: '320px' }}>
        <Calendar
          localizer={localizer}
          date={selectedDate}
          onNavigate={onDateChange}
          onSelectSlot={(slotInfo: any) => onDateChange(slotInfo.start)}
          view="month"
          views={['month']}
          selectable
          toolbar={false}
          dayPropGetter={customDayPropGetter}
          components={{
            dateCellWrapper: customDateCellWrapper,
          }}
          style={{ height: '320px', width: '100%' }}
        />
      </div>
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
