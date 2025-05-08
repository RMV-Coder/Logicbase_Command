'use client';
import {useEffect} from 'react';
import type { BadgeProps, CalendarProps } from 'antd';
import { Badge, Calendar } from 'antd';
import type { Dayjs } from 'dayjs';
import { Box, Card, CardContent, Typography, 
  // Alert, Snackbar 
} from '@mui/material';
import { useUserStore } from "@/stores/userStore";
// import { useRouter } from "next/navigation";
// import { CalendarOutlined } from '@ant-design/icons';
// import { Typography as AntTypography } from 'antd';
// const { Text } = AntTypography;
export const dynamic = 'force-dynamic';

const getListData = (value: Dayjs) => {
    let listData: { type: string; content: string }[] = []; // Specify the type of listData
    switch (value.date()) {
      case 8:
        listData = [
          { type: 'warning', content: 'This is warning event.' },
          { type: 'success', content: 'This is usual event.' },
        ];
        break;
      case 10:
        listData = [
          { type: 'warning', content: 'This is warning event.' },
          { type: 'success', content: 'This is usual event.' },
          { type: 'error', content: 'This is error event.' },
        ];
        break;
      case 15:
        listData = [
          { type: 'warning', content: 'This is warning event' },
          { type: 'success', content: 'This is very long usual event......' },
          { type: 'error', content: 'This is error event 1.' },
          { type: 'error', content: 'This is error event 2.' },
          { type: 'error', content: 'This is error event 3.' },
          { type: 'error', content: 'This is error event 4.' },
        ];
        break;
      default:
    }
    return listData || [];
  };
  
  const getMonthData = (value: Dayjs) => {
    if (value.month() === 8) {
      return 1394;
    }
  };
export default function CalendarOverviewCard() {
    // const [loading, setLoading] = React.useState<boolean>(false);
    // const [isEditing, setIsEditing] = React.useState<boolean>(false);
    // const setUser = useUserStore((state) => state.setUser);
    const user = useUserStore((state) => state.user);
    // const [snackbarOpen, setSnackbarOpen] = useState(false);
    // const [snackbarMessage, setSnackbarMessage] = useState('');
    // const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
    // const router = useRouter();
    // const [formData, setFormData] = React.useState({
    //     email: '',
    //     password: '',
    // });
    if(user){
        console.log('loaded');
    }
    
      const monthCellRender = (value: Dayjs) => {
        const num = getMonthData(value);
        return num ? (
          <div className="notes-month">
            <section>{num}</section>
            <span>Backlog number</span>
          </div>
        ) : null;
      };
    
      const dateCellRender = (value: Dayjs) => {
        const listData = getListData(value);
        return (
          <ul className="events">
            {listData.map((item) => (
              <li key={item.content}>
                <Badge status={item.type as BadgeProps['status']} text={item.content} />
              </li>
            ))}
          </ul>
        );
      };
      const cellRender: CalendarProps<Dayjs>['cellRender'] = (current, info) => {
        if (info.type === 'date') return dateCellRender(current);
        if (info.type === 'month') return monthCellRender(current);
        return info.originNode;
      };
    const fetchData = async (id:string) => {
            try {
                const response = await fetch(`dashboard/api/profile-attendance/${id}`);
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