'use client';
import * as React from 'react';
import { Layout, Menu } from 'antd'
import type { MenuProps } from 'antd';
import { useUserStore } from "@/stores/userStore";
import { CalendarOutlined, LogoutOutlined, TeamOutlined, UserOutlined } from '@ant-design/icons';
import Nav from '../components/NavBar';
import { usePathname, useRouter } from "next/navigation";
const { Content, Sider, Footer } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

  function getItem(
    label: React.ReactNode,
    key: React.Key,
    disabled:boolean,
    icon?: React.ReactNode,
    type?: 'group' | 'divider',
    children?: MenuItem[],
    
  ): MenuItem {
    return {
      key,
      icon,
      children,
      label,
      disabled
    } as MenuItem;
  }
export default function RootLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
  const items = [
        getItem('Dashboard', '/dashboard', false, <UserOutlined />),
        getItem('Profile', '/dashboard/profile', false, <UserOutlined />),
        getItem('Projects', '/dashboard/projects', false, <TeamOutlined />),
        getItem('Clients', '/dashboard/clients', false, <CalendarOutlined />),
        getItem('Calendar', '/dashboard/calendar', false, <TeamOutlined />),
        getItem('Chats', '/dashboard/chats', false, <TeamOutlined />),
        getItem('Logout', '/logout', false, <LogoutOutlined />),
  ]
//   const [rows, setRows] = React.useState<AttendanceData[]>([]);
  const user = useUserStore((state)=>state.user)
  const clearUser = useUserStore((state) => state.clearUser)
  console.log('User:', user);

    const pathname = usePathname();
    // const [loading, setLoading] = React.useState<boolean>(false);
    // const [snackbarOpen, setSnackbarOpen] = React.useState(false);
    // const [snackbarMessage, setSnackbarMessage] = React.useState('');
    // const [snackbarSeverity, setSnackbarSeverity] = React.useState<'success' | 'error'>('success');
    const router = useRouter();
    // const [formData, setFormData] = React.useState({
    //     hour: 1
    // });
    // const handleSubmit = async() => {
    //     setLoading(true);
    //     console.log('Submitting:', formData);
    //     // Send to backend here
    //     const response = await fetch('/api/login', {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json',
    //         },
    //         body: JSON.stringify(formData),
    //     });
    //     setSnackbarOpen(false);
    //     const data = await response.json()
    //     console.log('Response:', data);
    //     setSnackbarMessage(data.error || 'Unknown response');
    //     setSnackbarSeverity(data.error ? 'error' : 'success');
    //     setSnackbarOpen(true);
    //     setLoading(false);
    //     if(!response.ok){
    //         throw new Error("Error signing up");
    //     }
    //     router.push("/dashboard");
    // };
    // const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     setFormData({ ...formData, [e.target.name]: e.target.value });
    // };

    return (
    
    <Layout style={{ minHeight: '100vh', padding:0 }}>
      <Sider
        breakpoint="lg"
        collapsedWidth="0"
        onBreakpoint={(broken) => {
          console.log(broken);
        }}
        onCollapse={(collapsed, type) => {
          console.log(collapsed, type);
        }}
        // style={{backgroundColor:'#FFFFFE'}}
        theme='dark'
      >
        
        <Menu theme="dark" mode="inline" defaultSelectedKeys={['/dashboard']} items={items}
        style={{paddingTop:'72px'}}
        selectedKeys={[pathname]}
        onSelect={async(e)=>{
            if(e.key==='/logout'){
              console.log('Logging out...')
                const res = await fetch('/api/logout', {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(user?.user_id),
                  });
            
                  const data = await res.json();
                  if (!res.ok) throw new Error(data.error);
                  clearUser();
                  
                  router.replace("/"); // Redirect to login page
                  return
            } else {
              router.push(e.key)
            }
        }}  />
      </Sider>
      <Layout>
        <Nav/>
        <Content style={{ margin: '24px 16px 0', gap:'24px', display:'flex', flexDirection:'column' }}>
            {children}
                {/* <Card sx={{ width: '100%', p:3 }}>
                    <CardContent>
                        <DataGrid
                            rows={rows}
                            columns={columns}
                            initialState={{
                            pagination: {
                                paginationModel: { pageSize: 5, page: 0 },
                            },
                            }}
                            pageSizeOptions={[5, 10, 15]}
                            checkboxSelection
                            disableRowSelectionOnClick
                        />
                    </CardContent>
                </Card>
                    
                    <Card
                    sx={{
                        width: '100%',
                        p: 3,
                    }}
                    >
                        <CardContent>
                            <Box sx={{ mt: 2 }}>
                                <Text>How long would you be on duty today?</Text>
                                <TextField
                                fullWidth
                                label="Enter hours"
                                name="hour"
                                value={formData.hour}
                                onChange={handleChange}
                                margin="normal"
                                />
                            </Box>
                        </CardContent>
                        <CardActions sx={{ justifyContent: 'center', mt: 2 }}>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleSubmit}
                                loading={snackbarOpen}
                                disabled={loading}
                            >
                                Save
                            </Button>
                        </CardActions>
                    </Card> */}
        </Content>
        <Footer className="text-center">Logicbase Command {new Date().getFullYear()} Developed by Raymond Valdepenas</Footer>
      </Layout>
    </Layout>
    );
}
