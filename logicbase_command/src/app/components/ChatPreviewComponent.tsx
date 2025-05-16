// components/ChatPreviewComponent.tsx
import * as React from 'react';
import { styled } from '@mui/material/styles';
import { Badge, Avatar, Typography, Box } from '@mui/material';

interface ChatPreviewProps {
  name: string;
  avatarUrl: string;
  recentMessage: string;
  online: boolean;
  onClick?: () => void;
}

export const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: '#44b700',
    color: '#44b700',
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    '&::after': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      animation: 'ripple 1.2s infinite ease-in-out',
      border: '1px solid currentColor',
      content: '""',
    },
  },
  '@keyframes ripple': {
    '0%': {
      transform: 'scale(.8)',
      opacity: 1,
    },
    '100%': {
      transform: 'scale(2.4)',
      opacity: 0,
    },
  },
}));

const ChatPreviewComponent: React.FC<ChatPreviewProps> = ({ name, avatarUrl, recentMessage, online, onClick }) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer', mb: 2 }} onClick={onClick}>
      <Box sx={{ mr: 2 }}>
        {online ? (
          <StyledBadge
            overlap="circular"
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            variant="dot"
          >
            <Avatar alt={name} src={avatarUrl} />
          </StyledBadge>
        ) : (
          <Avatar alt={name} src={avatarUrl} />
        )}
      </Box>
      <Box>
        <Typography variant="subtitle1">{name}</Typography>
        <Typography variant="body2" color="textSecondary" noWrap>
          {recentMessage}
        </Typography>
      </Box>
    </Box>
  );
};

export default ChatPreviewComponent;
