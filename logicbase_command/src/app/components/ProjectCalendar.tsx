import { useMemo, useRef, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Card, Typography, Box, Tab, Tabs } from '@mui/material';

interface Project {
  project_id: number;
  project_name: string;
  project_due: string;
  project_config: {
    start_date: string;
    color?: string;
  };
}

interface ProjectCalendarProps {
  projects: Project[];
}

const ProjectCalendar: React.FC<ProjectCalendarProps> = ({ projects }) => {
  const calendarRef = useRef<FullCalendar | null>(null);
  const [tabIndex, setTabIndex] = useState<number>(0);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
    const calendarApi = calendarRef.current?.getApi();
    if (calendarApi) {
      if (newValue === 0) calendarApi.changeView('dayGridMonth');
      if (newValue === 1) calendarApi.changeView('timeGridWeek');
      if (newValue === 2) calendarApi.changeView('timeGridDay');
    }
  };

  const events = useMemo(() => {
    return projects
      .filter((p) => p.project_config?.start_date)
      .map((project) => ({
        id: String(project.project_id),
        title: project.project_name,
        start: project.project_config.start_date,
        end: project.project_due,
        color: project.project_config.color || getRandomColor(project.project_id),
      }));
  }, [projects]);

  return (
    <Card sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Project Calendar</Typography>
        <Tabs value={tabIndex} onChange={handleTabChange}>
          <Tab label="Month" />
          <Tab label="Week" />
          <Tab label="Day" />
        </Tabs>
      </Box>

      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        views={{
          dayGridMonth: { type: 'dayGridMonth', buttonText: 'month' },
          timeGridWeek: { type: 'timeGridWeek', buttonText: 'week' },
          timeGridDay: { type: 'timeGridDay', buttonText: 'day' },
        }}
        events={events}
        height="auto"
        headerToolbar={false}
      />
    </Card>
  );
};

function getRandomColor(seed: number) {
  const colors = ['#00B8D9', '#36B37E', '#FFAB00', '#FF5630', '#6554C0'];
  return colors[seed % colors.length];
}

export default ProjectCalendar;
