'use client';
import { useEffect, useState } from 'react';
// import { useUserStore } from '@/stores/userStore';
import { Typography as AntTypography } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { Box, Button, Card, CardActions, CardContent, Grid, Typography, Tabs, Tab } from '@mui/material';
import ProjectDrawerForm from '@/app/components/NewProjectDrawerForm';
import ProjectCalendar from '@/app/components/ProjectCalendar';
const { Title } = AntTypography;

interface ProjectFormValues {
    project_name: string,
    project_details: string
    project_duration: string,
    project_type: string,
}
interface Project {
    project_id: number;
    project_name: string;
    project_details: string;
    project_due: string;
    project_status: string;
    project_config: {
      project_type: string;
    };
  }
export default function UserDashboard() {
    // const user = useUserStore((state)=>state.user)
    const [ openDrawer, setOpenDrawer ] = useState<boolean>(false);
    const [ loading, setLoading ] = useState<boolean>(false);
    const [ projects, setProjects ] = useState<Project[]>([]);
    const [ tabIndex, setTabIndex ] = useState<number>(0);
    const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
        setTabIndex(newValue);
    }
    const fetchData = async () => {
        try {
            const response = await fetch(`/api/projects`);
            if (!response.ok) throw new Error('Failed to fetch projects data');
            const data = await response.json()
            setProjects(data.projectRows);
            console.log('Data: ', data);
        }
        catch (error){
            console.error(error);
        }
    }
    const handleSubmit = async(values:ProjectFormValues) => {
        setLoading(true)
        console.log("Values: ", values);
        const response = await fetch('/api/add/project', {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(values)
        })
        setLoading(false)
        if(!response.ok){
            throw new Error("Failed to add project")
        }
        const result = await response.json();
       
        console.log(result.message);
        setOpenDrawer(false);
        fetchData();
    }
    useEffect(()=>{
        fetchData();
    },[])

    return (
      <>
        {/* <Card
        sx={{
            width: '100%',
            p: 3,
        }}
        > */}
            {/* <CardContent> */}
                <Box sx={{ p:3, mt: 2, display: 'flex', justifyContent: 'space-between' }}>
                    <Title>Projects</Title>
                    <Button
                        variant="contained"
                        color="primary"
                        size='large'
                        onClick={()=>setOpenDrawer(true)}
                        startIcon={<PlusOutlined />}
                    >
                        New Project
                    </Button>
                </Box>
                <Tabs value={tabIndex} onChange={handleTabChange}>
                    <Tab label="Card View" />
                    <Tab label="Calendar View" />
                </Tabs>
                {tabIndex === 0 ? <Grid container spacing={2} sx={{ p: 3 }}>
                    {projects.map((project) => (
                    <Grid container spacing={2} sx={{p:3}} key={project.project_id}>
                        <Card variant="outlined">
                        <CardContent>
                            <Typography variant="h6">{project.project_name}</Typography>
                            <Typography variant="body2" color="text.secondary">
                            {project.project_details}
                            </Typography>
                            <Typography variant="body2" sx={{ mt: 1 }}>
                            Due: {new Date(project.project_due).toLocaleDateString()}
                            </Typography>
                            <Typography variant="body2">
                            Status: {project.project_status}
                            </Typography>
                            {project.project_config && (
                            <Typography variant="body2" sx={{ mt: 1 }}>
                                Type: {project.project_config?.project_type || 'N/A'}
                            </Typography>
                            )}
                        </CardContent>
                        <CardActions>
                            <Button size="small">Edit</Button>
                            <Button size="small">View</Button>
                        </CardActions>
                        </Card>
                    </Grid>
                    ))}
                </Grid>:
                <ProjectCalendar
                projects={projects.map((p) => ({
                  ...p,
                  project_config:
                    typeof p.project_config === 'string'
                      ? JSON.parse(p.project_config)
                      : p.project_config,
                }))}
              />}
                <ProjectDrawerForm open={openDrawer} loading={loading} onClose={() => setOpenDrawer(false)} onPrimaryClick={handleSubmit}/>
                    {/* </CardContent> */}
            
        {/* </Card> */}
      </>
    
    );
}
