import { Button } from '@/components/ui/button';
import { ExternalLink, Download, Calendar } from 'lucide-react';
import { generateGoogleCalendarUrl, downloadICSFile } from '@/lib/calendarUtils';
import { cn } from '@/lib/utils';

export default function CalendarSync({ appointment, isDoctor = false, className = "", showLabel = true }) {
  const title = isDoctor && appointment.user?.name 
    ? `Patient: ${appointment.user.name}` 
    : (appointment.doctorName || "Doctor Appointment");

  return (
    <div className={cn("mt-4 pt-4 border-t border-dashed", className)}>
      {showLabel && (
        <p className="text-[10px] font-medium text-muted-foreground mb-2 flex items-center gap-1 uppercase tracking-wider">
          <Calendar className="h-3 w-3" />
          Sync to Calendar
        </p>
      )}
      <div className="flex gap-2">
        <Button 
          variant="secondary" 
          size="sm" 
          className="flex-1 h-8 gap-2 text-[11px] font-medium bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-950/40 dark:text-blue-300 border-0"
          onClick={() => window.open(generateGoogleCalendarUrl(appointment, title), '_blank')}
        >
          <ExternalLink className="h-3.5 w-3.5" />
          Google
        </Button>
        <Button 
          variant="secondary" 
          size="sm" 
          className="flex-1 h-8 gap-2 text-[11px] font-medium bg-orange-50 text-orange-700 hover:bg-orange-100 dark:bg-orange-950/40 dark:text-orange-300 border-0"
          onClick={() => downloadICSFile(appointment, title)}
        >
          <Download className="h-3.5 w-3.5" />
          Outlook/iCal
        </Button>
      </div>
    </div>
  );
}