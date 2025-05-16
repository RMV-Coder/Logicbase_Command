'use client';
import { useEffect, useState } from 'react';
import { Layout, Menu } from 'antd'
import type { MenuProps } from 'antd';
import { useUserStore } from "@/stores/userStore";
import { ProfileOutlined, DashboardOutlined, CalendarOutlined, LogoutOutlined, MessageOutlined, UserOutlined } from '@ant-design/icons';
import Nav from '../components/NavBar';
import { usePathname, useRouter } from "next/navigation";
// import { Account } from '@toolpad/core/Account';
// import { AppProvider } from '@toolpad/core/AppProvider';
// import { UserOrg, CustomSession } from '@/app/components/AccountCustom'
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
        getItem('Dashboard', '/dashboard', false, <DashboardOutlined />),
        getItem('Profile', '/dashboard/profile', false, <UserOutlined />),
        getItem('Projects', '/dashboard/projects', false, <ProfileOutlined />),
        // getItem('Clients', '/dashboard/clients', false, <CalendarOutlined />),
        getItem('Calendar', '/dashboard/calendar', false, <CalendarOutlined />),
        getItem('Chats', '/dashboard/chats', false, <MessageOutlined />),
        getItem('Sign Out', '/logout', false, <LogoutOutlined />),
  ]
//   const [rows, setRows] = React.useState<AttendanceData[]>([]);
  const user = useUserStore((state)=>state.user)
  const clearUser = useUserStore((state) => state.clearUser)
  console.log('User:', user);

    const pathname = usePathname();
    const router = useRouter();
    const [isMounted, setIsMounted] = useState<boolean>(false);
    if(user){
      console.log('User loaded...')
    }
    useEffect(()=>{
        if(isMounted){
          if(user){
              console.log('User loaded...')
          }else{
              console.log('User not loaded...')
              clearUser();
              router.push('/login');
          }
        } else {
          setIsMounted(true);
        }
    },[isMounted])
    return (
    
    <Layout style={{ minHeight: '100vh', padding:0 }}>
      {/* <AppProvider session={customSession} authentication={authentication}> */}
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
                  
                  router.replace("/login"); // Redirect to login page
                  return
            } else {
              router.push(e.key)
            }
        }}  />
        {/* <Account slots={{popoverContent: UserOrg}} slotProps={{preview:{variant:'condensed'}}}  /> */}
      </Sider>
      {/* </AppProvider> */}
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
        <Footer className="text-center">Logicbase Command {new Date().getFullYear()} Developed by Raymond Valdepeñas</Footer>
      </Layout>
    </Layout>
    );
}
