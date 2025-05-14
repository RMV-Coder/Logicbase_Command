'use client'
import { useMemo, useState, useEffect } from 'react';
import { Layout, Space, Typography } from 'antd';
import { useUserStore } from "@/stores/userStore";
import { Logout } from '@mui/icons-material';
import { Account } from '@toolpad/core/Account';
import { AppProvider, Session } from '@toolpad/core/AppProvider';
// import { UserOrg, CustomSession } from '@/app/components/AccountCustom'
// import Icon from '@ant-design/icons'
import Image from 'next/image'
// import LogoutButton from './LogoutButton';
// import MoneyCacheLogo from "./../../../public/file.svg"
import { useRouter } from 'next/navigation';
const { Text } = Typography;

const { Header }  = Layout

const Nav: React.FC = () =>
{
    const user = useUserStore((state)=>state.user)
    const clearUser = useUserStore((state) => state.clearUser)
    const router = useRouter()
    const [session, setSession] = useState<Session | null>(null);
    const signIn = () => {
        if (user) {
            setSession({
                user: {
                    name: `${user.first_name} ${user.last_name}`,
                    email: user.email,
                    image: user.profile_image || 'https://avatars.githubusercontent.com/u/19550456',
                },
            });
        } else {
            router.replace('/login');
            return;
        }
    };
    const signOut = () => {
        setSession(null);
        clearUser();
        router.replace("/login");
    };
    const authentication = useMemo(() => ({
        signIn,
        signOut,
    }), [user]);

    // Automatically call signIn when user becomes available
    useEffect(() => {
        if (user && !session) {
            signIn();
        }
    }, [user, session]);
    return (
    <>
    <AppProvider authentication={authentication} session={session}>
        <Header style={{ display: "flex", alignItems: "center", justifyContent:'space-between', background: "#1669B2", height:'72px' }}>
            <Space>
                {/* <Card
                    hoverable
                    onClick={()=>router.push("/")}
                    style={{ width: 196, color: 'white', height: '3.5em', overflow: 'hidden', position: 'relative', padding:'6px' }}
                > */}
                    {/* <Icon
                        component={ */}
                            {<><Image
                                src="/LBI---logo-white-icon.png"
                                alt="Logicbase Logo"
                                width={60}
                                height={60}
                                priority={true}/>
                                <Text style={{ color: 'white', fontSize: '1.15rem', fontWeight: 'bold' }}>Logicbase Command</Text></>
                                
                                }

                            {/* // MoneyCacheLogo as React.FC<React.SVGProps<SVGSVGElement>> 
                        } 
                        style={{
                            fontSize: '10rem',
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                        }}
                    /> */}
                {/* </Card> */}
                
            </Space>
            {/* <LogoutButton /> */}
            <div>
                <Account
                slotProps={{
                    signInButton: {
                    // children: 'Login',
                    // color: 'success',
                    },
                    signOutButton: {
                    // color: 'success',
                    startIcon: <Logout />,
                    },
                    preview: {
                    // variant: 'expanded',
                    slotProps: {
                        avatarIconButton: {
                        sx: {
                            width: 'fit-content',
                            margin: 'auto',
                            color: '#FFFFFE'
                        },
                        },
                        avatar: {
                        variant: 'rounded',
                        },
                    },
                    },
                }}
                />
            </div>
        </Header>
        </AppProvider>
    </>
)}

export default Nav