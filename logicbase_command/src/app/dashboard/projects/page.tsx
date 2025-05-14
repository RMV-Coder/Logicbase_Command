'use client';
import { useEffect, useState } from 'react';
import { Typography as AntTypography, Descriptions } from 'antd';
import type { DescriptionsProps } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import type { Dayjs } from 'dayjs';
import { Box, Button, Card, CardActions, CardContent, Grid, Typography, Tabs, Tab, Chip } from '@mui/material';
import ProjectDrawerForm from '@/app/components/NewProjectDrawerForm';
import ProjectCalendar from '@/app/components/ProjectCalendar';
import KanbanBoard from '@/app/components/Kanban';
import dayjs from 'dayjs';
const { Title } = AntTypography;

interface ProjectFormValues {
    project_name: string,
    project_details: string
    project_link: string
    project_duration: [Dayjs, Dayjs],
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
      start_date: string;
    };
  }
export default function UserDashboard() {
    // const user = useUserStore((state)=>state.user)
    const [ openDrawer, setOpenDrawer ] = useState<boolean>(false);
    const [ loading, setLoading ] = useState<boolean>(false);
    const [ projects, setProjects ] = useState<Project[]>([]);
    const [ tabIndex, setTabIndex ] = useState<number>(0);
    const [ status, setStatus ] = useState<string>('');
    const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
    const [ selectedProject, setSelectedProject ] = useState<DescriptionsProps['items']>([{key:'0', label:'', children:''}]);
    const handleStatusChange = (status: string) => {
        setStatus(status);
    }
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
    useEffect(()=>{
        if(selectedProjectId !== null){
            setSelectedProject([{
                key:'0',
                label:'Project Name',
                children: projects.find((project) => project.project_id === selectedProjectId)?.project_name
            },{
                key:'1',
                label:'Project Details',
                children: projects.find((project) => project.project_id === selectedProjectId)?.project_details
            },{
                key:'2',
                label:'Project Type',
                children: projects.find((project) => project.project_id === selectedProjectId)?.project_config.project_type
            }, {
                key:'3',
                label:'Project Start Date',
                children: dayjs(projects.find((project) => project.project_id === selectedProjectId)?.project_config.start_date).format('MMMM D, YYYY')
            }, {
                key:'4',
                label:'Project Due Date',
                children: dayjs(projects.find((project) => project.project_id === selectedProjectId)?.project_due).format('MMMM D, YYYY')
            }, {
                key:'5',
                label:'Project Status',
                children: status || projects.find((project) => project.project_id === selectedProjectId)?.project_status
            }
        ])
        }
    },[selectedProjectId, status])

    return (
      <>
        {/* <Card
        sx={{
            width: '100%',
            p: 3,
        }}
        > */}
            {/* <CardContent> */}
            
                <Box sx={{ p:2, mt: 2, display: 'flex', justifyContent: 'space-between' }}>
                    <Title>Projects</Title>
                    {selectedProjectId === null || tabIndex === 0 || tabIndex === 1 ? <Button
                        variant="contained"
                        color="primary"
                        size='large'
                        onClick={()=>setOpenDrawer(true)}
                        startIcon={<PlusOutlined />}
                    >
                        New Project
                    </Button>:
                    <Card sx={{p:2, mx:1}}>
                    <Descriptions title="Project Information" items={selectedProject} style={{ minWidth: '50vw', maxWidth:'60vw'}}/>
                    </Card>}
                </Box>
                <Tabs value={tabIndex} onChange={handleTabChange}>
                    <Tab label="Card View" />
                    <Tab label="Calendar View" />
                    {selectedProjectId !== null && <Tab label="BOARD VIEW" />}
                </Tabs>
                {tabIndex === 0 ? <Grid container spacing={2} sx={{ p: 3 }}>
                    {projects.map((project) => (
                    <Grid container spacing={2} sx={{p:3}} key={project.project_id}>
                        <Card variant="outlined" sx={{ minWidth: '250px', maxWidth: '400px' }}>
                        <CardContent>
                            <Typography variant="h6">{project.project_name}</Typography>
                            <Typography variant="body2" color="text.secondary">
                            {project.project_details}
                            </Typography>
                            <Typography variant="body2" sx={{ mt: 1 }}>
                            Due: {new Date(project.project_due).toLocaleDateString()}
                            </Typography>
                            <Typography variant="body2">
                            Status: <Chip variant={'filled'} size={'small'} color={project.project_status === 'Completed' ? 'success' : project.project_status === 'Planned' ? 'info':project.project_status === 'On going' ? 'primary':project.project_status === 'Planning' ? 'secondary':project.project_status === 'Past Due' ? 'error':'warning'} label={status||project.project_status}/>
                            </Typography>
                            {project.project_config && (
                            <Typography variant="body2" sx={{ mt: 1 }}>
                                Type: {project.project_config?.project_type || 'N/A'}
                            </Typography>
                            )}
                        </CardContent>
                        <CardActions>
                            {/* <Button size="small">Edit</Button> */}
                            <Button size="small" onClick={()=>{
                                setSelectedProjectId(project.project_id);
                                setTabIndex(2);
                            }}>View</Button> 
                        </CardActions>
                        </Card>
                    </Grid>
                    ))}
                </Grid>:
                tabIndex === 1 ?
                <ProjectCalendar
                projects={projects.map((p) => ({
                  ...p,
                  project_config:
                    typeof p.project_config === 'string'
                      ? JSON.parse(p.project_config)
                      : p.project_config,
                }))}
              />:
              tabIndex === 2 && selectedProjectId !== null && (
                <KanbanBoard
                  key={selectedProjectId}
                  projectId={selectedProjectId}
                  statusChange={handleStatusChange}
                  project={projects.find((p) => p.project_id === selectedProjectId)!}
                />
              )}
              
                <ProjectDrawerForm open={openDrawer} loading={loading} onClose={() => setOpenDrawer(false)} onPrimaryClick={handleSubmit}/>
                    {/* </CardContent> */}
            
        {/* </Card> */}
      </>
    
    );
}
