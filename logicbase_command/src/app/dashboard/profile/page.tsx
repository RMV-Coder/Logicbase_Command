'use client';
import { useState, useEffect, ChangeEvent } from 'react';
import type { Dayjs } from 'dayjs';
import { useUserStore } from '@/stores/userStore';
import { Typography as AntTypography, Descriptions } from 'antd';
import { Box, Button, ButtonBase, Card, CardActions, CardContent, Avatar } from '@mui/material';
import ProfileUpdateDrawer from '@/app/components/ProfileUpdateDrawer';
import dayjs from 'dayjs';
const { Title } = AntTypography;
interface ProfileData {
    name: string;
    email: string;
    birthdate: Dayjs;
    company_name: string;
    designation: string;
    registered_at: Dayjs;
    // profile_image: string;
    gender: string;
    contact_number: string;
    first_name?:string;
    last_name?:string;
}
interface ProfileFormData {
    email: string;
    birthdate: Dayjs;
    company_name: string;
    designation: string;
    gender: string;
    contact_number: string;
    first_name?:string;
    last_name?:string;
}
export default function UserDashboard() {
    const user = useUserStore((state)=>state.user)
    const setUser = useUserStore((state) => state.setUser);
    const [userID, setUserID] = useState<string>('');
    const [profile, setProfile] = useState<ProfileData | null>(null)
    const [avatarSrc, setAvatarSrc] = useState<string | undefined>(undefined);
    const [profileImage, setProfileImage] = useState<string | undefined>(undefined);
    const [drawerFormData, setDrawerFormData] = useState<ProfileData | null>(null);
    const [openDrawer, setOpenDrawer] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
  const handleAvatarChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Read the file as a data URL
      const reader = new FileReader();
      reader.onload = () => {
        setAvatarSrc(reader.result as string);
        handleUpdateProfile(reader.result as string);
        if(user)
        setUser({...user, profile_image: reader.result as string})
      };
      reader.readAsDataURL(file);
      
    }
  };
//   const fetchProfileImage = async (id:string) => {
//     try {
//         const response = await fetch(`/api/profile/${id}/image`);
//         if (!response.ok) throw new Error('Failed to fetch profile image');
//         const data = await response.json()
//         console.log('Data: ', data);
//         if(!response.ok){
//             throw new Error(data.error);
//         }
//         setProfileImage(data.profile.profile_image);
//     }
//     catch (error){
//         console.error(error);
//     }
// }
    const fetchData = async (id:string) => {
        try {
            const response = await fetch(`/api/profile/${id}`);
            if (!response.ok) throw new Error('Failed to fetch profile data');
            const data = await response.json()
            console.log('Data: ', data);
            if(!response.ok){
                throw new Error(data.error);
            }
            const prof = data.profile;
            const formattedData: ProfileData = {
                ...prof,
                Birthdate: dayjs(prof.Birthdate).format('MMMM D, YYYY')
            }
            setProfile(formattedData);
            const fullName = prof.name || '';
            const nameParts = fullName.split(' ');
            const firstName = nameParts[0] || '';
            const lastName = nameParts.slice(1).join(' ') || '';

            const formattedDrawerFormData = {
                ...prof,
                Birthdate: dayjs(prof.Birthdate).format('MMMM D, YYYY'),
                first_name: firstName,
                last_name: lastName,
            };
            setDrawerFormData(formattedDrawerFormData);
            // fetchProfileImage(id);
        }
        catch (error){
            console.error(error);
        }
    }
    const handleUpdate = async(values:ProfileFormData) => {
        setLoading(true)
        console.log("Values: ", values);
        const response = await fetch(`/api/profile/${userID}`, {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({...values, userID})
        })
        setLoading(false)
        if(!response.ok){
            throw new Error("Failed to update profile")
        }
        const result = await response.json();
       
        console.log(result.message);
        setOpenDrawer(false);
        fetchData(userID);
    }
    const handleUpdateProfile = async(profile_image: string) => {
        const response = await fetch(`/api/profile/${userID}`, {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({profile_image})
        })
        setLoading(false)
        if(!response.ok){
            throw new Error("Failed to update profile picture")
        }
        const result = await response.json();
       
        console.log(result.message);
        setOpenDrawer(false);
        // fetchData(userID);
    }
    useEffect(()=>{
        if(user){
            if(user.user_id){
                setUserID(user.user_id);
                fetchData(user.user_id);
                setProfileImage(user.profile_image);
            }
        }
    },[user])

    return (
        <>
        <Box sx={{ p:2, mt: 2, display: 'flex', justifyContent: 'space-between', flexDirection:'column' }}>
            <Title>Profile</Title>
            <Card sx={{minWidth:'fit-content', minHeight:'fit-content', maxWidth:'100%'}}>
                <CardContent sx={{p:6}}>
                   {user ? ( 
            <Descriptions 
            labelStyle={{fontSize:'1rem'}}
            contentStyle={{fontSize:'1rem'}}
            title={
                <ButtonBase
                component="label"
                role={undefined}
                tabIndex={-1} 
                aria-label="Avatar image"
                sx={{
                  borderRadius: '50%',
                  '&:has(:focus-visible)': {
                    outline: '2px solid',
                    outlineOffset: '2px',
                  },
                }}
              >
                <Avatar alt={profile?.name} src={profileImage||avatarSrc} sx={{width:200, height:200, borderWidth:'1px', borderColor:'ThreeDLightShadow'}}/>
                    <input
                    type="file"
                    accept="image/jpeg, image/png, image/jpg"
                    style={{
                    border: 0,
                    clip: 'rect(0 0 0 0)',
                    height: '1px',
                    margin: '-1px',
                    overflow: 'hidden',
                    padding: 0,
                    position: 'absolute',
                    whiteSpace: 'nowrap',
                    width: '1px',
                    }}
                    onChange={handleAvatarChange}
                />
    </ButtonBase>
                } column={{ xs: 1, sm: 1, md: 1, lg: 2, xl: 2, xxl: 2 }} items={profile ? Object.entries(profile).map(([key, value]) => ({ key, label:key.replace(/_/g, ' ').normalize(), children:value })) : Object.entries(user as unknown as ProfileData).map(([key, value]) => ({ key, label:key!=='profile_image'?key.replace(/_/g, ' ').toLowerCase().split(' ').map(word=>word.charAt(0).toUpperCase()+word.slice(1)).join('').normalize():'', children:key === 'birthdate' && value ? dayjs(value).format('MMMM D, YYYY') :(key!=='profile_image'?value:'') }))} style={{ minWidth: '45vw', maxWidth:'60vw'}}/>):(
                    <Card>Loading profile information...</Card>
                )}
            </CardContent>
            <CardActions sx={{p:6, pt:0}}>
                <Button variant='outlined' size="large" onClick={()=>setOpenDrawer(true)}>Update</Button>
            </CardActions>
            </Card>
        </Box>
        <ProfileUpdateDrawer open={openDrawer} loading={loading} onClose={() => setOpenDrawer(false)} onPrimaryClick={handleUpdate} data={drawerFormData}/>
        </>
                        
    );
}
