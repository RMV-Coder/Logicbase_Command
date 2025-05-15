'use client';
import { useState, useEffect } from 'react';
import { useUserStore } from '@/stores/userStore';
import { Box, Button } from '@mui/material';
import { Space, Typography } from 'antd';
import CalendarOverviewCard from '../components/CalendarOverviewCard';
import PendingConcernsCard from '../components/PendingConcerns';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
const { Title } = Typography;

interface ConcernsData {
  concern_id: number;
  full_name: string;
  subject: string;
  message: string;
  contact_number: string;
  email: string;
  created_at: Dayjs;
  preferred_start: Dayjs;
  preferred_end: Dayjs;
  status: string;
  user_id: string;
}
// import EmployeeProfileCard from '@/components/EmployeeProfileCard';

export default function UserDashboard() {
    const user = useUserStore((state)=>state.user)
    const [concernsData, setConcernsData] = useState<ConcernsData[]>([]);
    
    async function fetchConcernsData(company_name: string){
        try {
          const response = await fetch(`/api/concerns`, {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ company_name, status:'Open' }),
          });
          if (!response.ok) throw new Error('Failed to fetch concerns data');
          const data = await response.json()
          console.log('Data: ', data);
          const mappedData = data.rows.map((item: ConcernsData) => ({
            ...item,
            created_at: dayjs(item.created_at),
            preferred_start: dayjs(item.preferred_start),
            preferred_end: dayjs(item.preferred_end),
          }));
      
          setConcernsData(mappedData);
          setConcernsData(data.rows);
        }
        catch (error){
            console.error(error);
        }
      }
    // const fetchData = async (id:string) => {
    //     try {
    //         const response = await fetch(`dashboard/api/profile/${id}`);
    //         if (!response.ok) throw new Error('Failed to fetch attendance data');
    //         const data = await response.json()
    //         console.log('Data: ', data);
    //         if(!response.ok){
    //             throw new Error(data.error);
    //         }
    //         // setConcernsData(data);
    //     }
    //     catch (error){
    //         console.error(error);
    //     }
    // }
    const refetch = () => {
        if(user)
        fetchConcernsData(user.company_name);
      };
    useEffect(()=>{
        if(user){
            if(user.user_id)
            // fetchData(user.user_id);
            if(user.company_name)
            fetchConcernsData(user.company_name);
        }
    },[user])

    return (
        <>
        <Box sx={{ p:2, mt: 2, display: 'flex', justifyContent: 'space-between' }}>
            <Title>Dashboard</Title>
            <Button
                variant="contained"
                color="primary"
                // size=''
                // onClick={()=>setOpenDrawer(true)}
                // startIcon={<PlusOutlined />}
            >
                New Project
            </Button>
        </Box>
        <Space style={{alignItems:'flex-start'}}>
        <CalendarOverviewCard/>
        <PendingConcernsCard data={concernsData} user_id={user?.user_id} refetch={refetch}/>
        </Space>
        
        </>
    );
}
