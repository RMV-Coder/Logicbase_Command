'use client';
import { useEffect, useState } from 'react';
import type { BadgeProps, CalendarProps } from 'antd';
import { Badge, Calendar } from 'antd';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import { Box, Card, CardContent, Typography, 
  //Alert, Snackbar 
} from '@mui/material';
import { useUserStore } from "@/stores/userStore";
export const dynamic = 'force-dynamic';
type ActivityLog = {
  log_id: number;
  user_id: number;
  entity: 'project' | 'client' | 'message' | 'profile';
  action: string;
  created_at: string;
  start?: string;
  end?: string;
};
export default function CalendarOverviewCard() {
    const user = useUserStore((state) => state.user);
    const [logs, setLogs] = useState<ActivityLog[]>([]);
    if(user){
      console.log('loaded user');
    }
    useEffect(() => {
      const fetchData = async (user_id: string) => {
        try {
          const response = await fetch(`/api/activity-log`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ user_id }),
          });
  
          if (!response.ok) throw new Error('Failed to fetch activity logs');
          const data = await response.json();
          setLogs(data.rows);
        } catch (error) {
          console.error(error);
        }
      };
  
      if (user?.user_id) {
        fetchData(user.user_id);
      }
    }, [user]);
    const getListData = (value: Dayjs) => {
      const dateStr = value.format('YYYY-MM-DD');
      const filteredLogs = logs.filter((log) => dayjs(log.created_at).format('YYYY-MM-DD') === dateStr);
  
      return filteredLogs.map((log) => ({
        type: 'success' as BadgeProps['status'],
        content: `${log.action} ${log.entity}`,
      }));
    };
  
    const dateCellRender = (value: Dayjs) => {
      const listData = getListData(value);
      return (
        <ul className="events">
          {listData.map((item, index) => (
            <li key={index}>
              <Badge status={item.type} text={item.content} />
            </li>
          ))}
        </ul>
      );
    };
  
    const cellRender: CalendarProps<Dayjs>['cellRender'] = (current, info) => {
      if (info.type === 'date') return dateCellRender(current);
      return info.originNode;
    };
  
      // const monthCellRender = (value: Dayjs) => {
      //   const num = getMonthData(value);
      //   return num ? (
      //     <div className="notes-month">
      //       <section>{num}</section>
      //       <span>Backlog number</span>
      //     </div>
      //   ) : null;
      // };
    
      // const dateCellRender = (value: Dayjs) => {
      //   const listData = getListData(value);
      //   return (
      //     <ul className="events">
      //       {listData.map((item) => (
      //         <li key={item.content}>
      //           <Badge status={item.type as BadgeProps['status']} text={item.content} />
      //         </li>
      //       ))}
      //     </ul>
      //   );
      // };
    
    const fetchData = async (user_id:string) => {
            try {
                const response = await fetch(`/api/activity-log`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ user_id }),
                });
                if (!response.ok) throw new Error('Failed to fetch attendance data');
                const data = await response.json()
                console.log('Data: ', data);
            }
            catch (error){
                console.error(error);
            }
        }
        useEffect(()=>{
            if(user){
              if(user.user_id)
                fetchData(user.user_id);
            }
        },[user])

    return(
        <>
        <Box
            sx={{
            display: 'flex',
            // justifyContent: 'center',
            alignItems: 'flex-start',
            width: '60vw',
            maxWidth: '900px',
            minWidth: '500px',
            height: '72vh',
            minHeight:'756px',
            maxHeight:'1080px',
            }}
        >   
            <Card
            sx={{
                width: '60vw',
                maxWidth: '900px',
                minWidth: '500px',
                height: '72vh',
                minHeight:'756px',
                maxHeight:'1080px',
                p: 3,
                // borderRadius: 3,
                // boxShadow: 3,
                display: 'flex',

                flexDirection: 'column',
            }}
            >
                <CardContent>
                    <Typography variant="h5" sx={{ mb: 2 }}>
                        Activity Calendar
                    </Typography>
                    <Calendar cellRender={cellRender} />
                </CardContent>
            </Card>
        </Box>
        {/* <Snackbar anchorOrigin={{ vertical: 'top', horizontal:'center' }} open={snackbarOpen} autoHideDuration={6000} onClose={() => setSnackbarOpen(false)}>
            <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity} sx={{ width: '100%' }}>
                {snackbarMessage}
            </Alert>
        </Snackbar> */}
    </>
    )
}