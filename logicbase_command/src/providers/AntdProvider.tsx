'use client';
import { ConfigProvider } from 'antd';

export default function AntdProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#233570', // Logicbase dark blue (default)
          colorPrimaryHover: '#2E4B8D', // Logicbase blue (hover)
          colorPrimaryActive: '#1A2D6D', // Logicbase dark blue (active)
          colorTextBase: '#222222', // Default text color
          colorTextLightSolid: '#FFFFFE', // Light text color for solid backgrounds
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
}