'use client';
import { useState, useEffect, ChangeEvent } from 'react';
import type { Dayjs } from 'dayjs';
import { useUserStore } from '@/stores/userStore';
import { Typography as AntTypography, Descriptions } from 'antd';
import { Box, Button, ButtonBase, Card, CardActions, CardContent, Avatar, Snackbar, Alert, Skeleton, Grid, Typography } from '@mui/material';
import ProfileUpdateDrawer from '@/app/components/ProfileUpdateDrawer';
import dayjs from 'dayjs';
import ChangePasswordDrawer from '@/app/components/ChangePasswordDrawer';
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
interface PassFormData {
    current_password: string;
    new_password: string;
    confirm_new_password: string;
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
    const [open_, setOpen_] = useState<boolean>(false);
    const [loading_, setLoading_] = useState<boolean>(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
    const handleUpdateProfilePicture = async(profile_image: string) => {
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
  const handleAvatarChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Read the file as a data URL
      const reader = new FileReader();
      reader.onload = () => {
        setAvatarSrc(reader.result as string);
        handleUpdateProfilePicture(reader.result as string);
        if(user)
        setUser({...user, profile_image: reader.result as string})
      };
      reader.readAsDataURL(file);
      
    }
  };
    const fetchData = async (id:string) => {
        try {
            const response = await fetch(`/api/profile/${id}`);
            if (!response.ok) throw new Error('Failed to fetch profile data');
            const data = await response.json()
            console.log('Data: ', data);
            if(!response.ok){
                setSnackbarMessage(data.error);
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
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
            console.error(error);
        }
    }
    const handleUpdate = async(values:ProfileFormData) => {
        try{
            setLoading(true)
            console.log("Values: ", values);
            const response = await fetch(`/api/profile/${userID}`, {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({...values, userID})
            })
            setLoading(false)
            const result = await response.json();
            if(!response.ok){
                setSnackbarMessage(result.error);
                throw new Error("Failed to update profile");
            }
            console.log(result.message);
            setSnackbarSeverity('success')
            setSnackbarMessage(result.message);
            setSnackbarOpen(true);
            setOpenDrawer(false);
            fetchData(userID);
        } catch (error){
            setSnackbarSeverity('error');
            console.log(error);
        } finally {
            setSnackbarOpen(true);
        }
    }
    const handleUpdatePassword = async(values: PassFormData) => {
        try {
            setLoading_(true);
            const response = await fetch(`/api/profile/update-password/${userID}`, {
                method:'POST',
                headers:{ "Content-Type": "application/json" },
                body: JSON.stringify({...values})
            })
            const data = await response.json();
            setLoading_(false);
            if(!response.ok){
                setSnackbarMessage(data.error);
                throw new Error('Failed to Update Password');
            }
            setSnackbarMessage(data.message);
            setSnackbarSeverity('success');
            setOpen_(false);
        } catch(error){
            setSnackbarSeverity('error');
            console.log(error);
        } finally {
            setSnackbarOpen(true);
        }
    };
    
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
                    <>
                        <Skeleton variant='circular' animation={'pulse'} width={202} height={202}/>
                        <Grid size={{ xs: 1, sm: 1, md: 1, lg: 2, xl: 2 }}>
                        <Typography style={{fontSize:'2rem', width:'1200px', paddingTop:'12px'}}><Skeleton/></Typography>
                        <Typography style={{fontSize:'2rem', width:'1200px'}}><Skeleton/></Typography>
                        <Typography style={{fontSize:'2rem', width:'1200px'}}><Skeleton/></Typography>
                        <Typography style={{fontSize:'2rem', width:'420px'}}><Skeleton/></Typography>
                        </Grid>
                    </>
                )}
            </CardContent>
            <CardActions sx={{p:6, pt:0}}>
                <Button variant='outlined' size="large" onClick={()=>setOpenDrawer(true)}>Update</Button>
                <Button variant='contained' size="large" onClick={()=>setOpen_(true)}>Change Password</Button>
            </CardActions>
            </Card>
        </Box>
        <ProfileUpdateDrawer open={openDrawer} loading={loading} onClose={() => setOpenDrawer(false)} onPrimaryClick={handleUpdate} data={drawerFormData}/>
        <ChangePasswordDrawer open={open_} loading={loading_} onClose={()=>setOpen_(false)} onPrimaryClick={handleUpdatePassword}/>
        <Snackbar anchorOrigin={{ vertical: 'top', horizontal:'center' }} open={snackbarOpen} autoHideDuration={6000} onClose={() => setSnackbarOpen(false)}>
            <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity} sx={{ width: '100%' }}>
                {snackbarMessage}
            </Alert>
        </Snackbar>
        </>    
    );
}