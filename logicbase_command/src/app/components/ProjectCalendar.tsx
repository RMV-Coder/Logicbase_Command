'use client';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction'; // Optional: for clicking events
import { useMemo, useState } from 'react';
import {
  Card,
//   ToggleButton,
//   ToggleButtonGroup,
  Typography,
  Box,
  Tab,
  Tabs
} from '@mui/material';

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
  const [viewMode, setViewMode] = useState<'dayGridMonth' | 'timeGridWeek' | 'timeGridDay'>('timeGridWeek');
  const [ tabIndex, setTabIndex ] = useState<number>(0);
  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
      setTabIndex(newValue);
      if (newValue === 0) setViewMode('dayGridMonth');
      if (newValue === 1) setViewMode('timeGridWeek');
      if (newValue === 2) setViewMode('timeGridDay');
  }
//   const handleViewModeChange = (
//     event: React.MouseEvent<HTMLElement>,
//     newView: 'dayGridMonth' | 'timeGridWeek' | 'timeGridDay' | null
//   ) => {
//     if (newView) setViewMode(newView);
//   };

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
        {/* <ToggleButtonGroup
          value={viewMode}
          exclusive
          onChange={handleViewModeChange}
          aria-label="calendar view mode"
          size="small"
        >
          <ToggleButton value="dayGridMonth" aria-label="Month view">
            Month
          </ToggleButton>
          <ToggleButton value="timeGridWeek" aria-label="Week view">
            Week
          </ToggleButton>
          <ToggleButton value="timeGridDay" aria-label="Day view">
            Day
          </ToggleButton>
        </ToggleButtonGroup> */}
      </Box>

      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView={viewMode}
        views={{
          dayGridMonth: { type:'dayGridMonth',  buttonText: 'month' },
          timeGridWeek: { type:'timeGridWeek', buttonText: 'week' },
          timeGridDay: { type:'timeGridDay', buttonText: 'day' },
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
