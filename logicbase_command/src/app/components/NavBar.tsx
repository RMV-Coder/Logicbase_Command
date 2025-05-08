'use client'

import React from 'react';
import { Layout, Space, Typography } from 'antd';
// import Icon from '@ant-design/icons'
import Image from 'next/image'
// import LogoutButton from './LogoutButton';
// import MoneyCacheLogo from "./../../../public/file.svg"
// import { useRouter } from 'next/navigation';
const { Text } = Typography;

const { Header }  = Layout

const Nav: React.FC = () =>
{
    // const router = useRouter()

    return (
    <>
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
        </Header>
    </>
)}

export default Nav