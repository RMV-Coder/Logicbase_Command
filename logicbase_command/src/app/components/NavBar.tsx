'use client'
import { useMemo, useState, useEffect } from 'react';
import { Layout, Space, Typography } from 'antd';
import { useUserStore } from "@/stores/userStore";
import { Logout } from '@mui/icons-material';
import { Account } from '@toolpad/core/Account';
import { AppProvider, Session } from '@toolpad/core/AppProvider';
import { useMediaQuery } from "@mui/material";
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
    

    const isMobile = useMediaQuery("(max-width:768px)");
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
        <Header style={{ display: "flex", alignItems: "center", justifyContent:'space-between', background: "#1669B2", height: isMobile?'56px':'72px' }}>
            <Space>
                {<><Image
                    src="/LBI---logo-white-icon.png"
                    alt="Logicbase Logo"
                    width={isMobile ? 40 : 60}
                    height={isMobile ? 40 : 60}
                    priority={true}/>
                    <Text style={{ color: 'white', fontSize: isMobile?'1rem':'1.15rem', fontWeight: 'bold' }}>Logicbase Command</Text></>
                }
            </Space>
            <div>
                <Account
                slotProps={{
                    signInButton: {
                    },
                    signOutButton: {
                    startIcon: <Logout />,
                    },
                    preview: {
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