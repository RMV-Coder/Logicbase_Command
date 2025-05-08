'use client';
import * as React from 'react';
import { useUserStore } from '@/stores/userStore';
import CalendarOverviewCard from '../../components/CalendarOverviewCard';
// import EmployeeProfileCard from '@/components/EmployeeProfileCard';

export default function UserDashboard() {
    const user = useUserStore((state)=>state.user)
    const fetchData = async (id:string) => {
        try {
            const response = await fetch(`dashboard/api/profile/${id}`);
            if (!response.ok) throw new Error('Failed to fetch attendance data');
            const data = await response.json()
            console.log('Data: ', data);
        }
        catch (error){
            console.error(error);
        }
    }
    React.useEffect(()=>{
        if(user){
            if(user.user_id)
            fetchData(user.user_id);
        }
    },[user])

    return (
        <CalendarOverviewCard/>
    );
}
