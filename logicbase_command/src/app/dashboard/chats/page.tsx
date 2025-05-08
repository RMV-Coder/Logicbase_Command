'use client';
import { useState, useEffect } from 'react';
import { useUserStore } from '@/stores/userStore';
import ChatPreviewComponent from '@/app/components/ChatPreviewComponent';
import { Box, Card, CardContent, Snackbar, Alert, Typography, Button, TextField } from '@mui/material';
// import { LaptopOutlined, NotificationOutlined, UserOutlined } from '@ant-design/icons';
export const dynamic = 'force-dynamic';
interface AppUser {
    user_id: string;
    first_name: string;
    last_name: string;
    profile_image: string | null;
}

  
interface Chat {
    chatId: string;
    participantName: string;
    avatarUrl: string;
    recentMessage: string;
    online: boolean;
    messages: { sender: string; content: string; timestamp: string }[];
  }

//   const mockChats: Chat[] = [
//     {
//       chatId: '1',
//       participantName: 'Alice',
//       avatarUrl: '/static/images/avatar/1.jpg',
//       recentMessage: 'Hey, how’s the project?',
//       online: true,
//       messages: [
//         { sender: 'Alice', content: 'Hey, how’s the project?', timestamp: '10:00 AM' },
//         { sender: 'Me', content: 'Going well!', timestamp: '10:05 AM' },
//         { sender: 'Me', content: 'Do we proceed with phase 2 next week?', timestamp: '10:06 AM' },
//         { sender: 'Me', content: 'I think we could finish before the deadline.', timestamp: '10:07 AM' },
//       ],
//     },
//     {
//       chatId: '2',
//       participantName: 'Bob',
//       avatarUrl: '/static/images/avatar/2.jpg',
//       recentMessage: 'Let’s catch up tomorrow.',
//       online: false,
//       messages: [
//         { sender: 'Bob', content: 'Let’s catch up tomorrow.', timestamp: '9:00 AM' },
//       ],
//     },
//   ];
const Chats: React.FC = () => {
    const user = useUserStore((state)=>state.user)
    const [allUsers, setAllUsers] = useState<AppUser[]>([]);
    const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
    const [messageInput, setMessageInput] = useState('');
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
    const [chats, setChats] = useState<Chat[]>([]);
    // const [messages, setMessages] = useState<{ sender: string; content: string; timestamp: string }[]>([]);
    const selectedChat = chats.find(chat => chat.chatId === selectedChatId);
    
    const fetchChats = async(userId: string) => {
        try{
            const response = await fetch(`/api/get/chats/${userId}`, {
                method: 'GET'
            })
            const result = await response.json();
            if(!response.ok){
                throw new Error(result.error || "Failed to fetch chats");
            }
            setChats(result.chats);
        } catch (error){
            console.log(error);
        }
    }
    const fetchAllUsersExceptMe = async (userId: string) => {
        try {
          const response = await fetch(`/api/get/users/exclude/${userId}`);
          const result = await response.json();
          if (!response.ok) throw new Error(result.error || "Failed to fetch users");
          setAllUsers(result.users);
          console.log('Users: ', result.users);
        } catch (error) {
          console.error(error);
        }
    };
    const startNewChatWithUser = async (receiverId: string) => {
        try {
          const response = await fetch('/api/create/chat', {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              sender_id: user?.user_id,
              receiver_id: receiverId,
            }),
          });
      
          const result = await response.json();
          if (!response.ok) throw new Error(result.error || "Failed to create chat");
      
          setSnackbarMessage(result.message);
          setSnackbarSeverity("success");
          setSelectedChatId(result.chatId); // optionally select chat immediately
          if(user&&user.user_id)
          fetchChats(user.user_id); // refresh chat list
        } catch (err) {
          setSnackbarMessage("Error creating chat");
          setSnackbarSeverity("error");
          console.error(err);
        } finally {
          setSnackbarOpen(true);
        }
      };
      
    // add a fetch request to get all the chats related to me (current user, those where this user is a participant), 
    useEffect(()=>{
        if(user){
            if(user.user_id){
                fetchChats(user.user_id as string);
                fetchAllUsersExceptMe(user.user_id as string);
                console.log('1');
            }
            console.log('123');
        }
        console.log('22');
    },[user])
    const handleSendMessage = async() => {
        if (!messageInput.trim()) return;
        try{
            const response = await fetch('/api/send/chat', {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message_text: messageInput.trim(),
                    message_chat_id: selectedChatId,
                    message_sender_id: user?.user_id,
                })
            })
            const result = await response.json();
            if(!response.ok){
                setSnackbarMessage(result.error);
                throw new Error(result.error || "Failed to send message");
            }
            // You can later mutate the actual state or send to backend here
            setSnackbarMessage('Message sent!');
            setSnackbarSeverity('success');
        } catch (error){
            console.log(error);
            setSnackbarSeverity('error');
        } finally {
            setSnackbarOpen(true);
            setMessageInput('');
        }
      };
    return (
      <>
              <Box
                  sx={{
                  display: 'flex',
                  // justifyContent: 'center',
                  alignItems: 'flex-start',
                  width: '100%',
                  maxWidth: '2000px',
                  minWidth: '500px',
                  height: '72vh',
                  minHeight:'100%',
                  maxHeight:'1080px',
                  gap:2
                  }}
              >   
                  <Card
                  sx={{
                      width: '20%',
                      maxWidth: '1920px',
                      minWidth: '200px',
                      height: '100%',
                      minHeight:'756px',
                      maxHeight:'1080px',
                      p: 2,
                      // borderRadius: 3,
                      // boxShadow: 3,
                      overflowY: 'auto'
                  }}
                  >
                      <CardContent>
                        {chats.map(chat => (
                            <ChatPreviewComponent
                            key={chat.chatId}
                            name={chat.participantName}
                            avatarUrl={chat.avatarUrl}
                            recentMessage={chat.recentMessage}
                            online={chat.online}
                            onClick={() => setSelectedChatId(chat.chatId)}
                            />
                        ))}
                        <Typography variant="subtitle1" gutterBottom>
                            Start New Chat
                        </Typography>
                        {allUsers.map(otherUser => (
                        <ChatPreviewComponent
                            key={otherUser.user_id}
                            name={`${otherUser.first_name} ${otherUser.last_name}`}
                            avatarUrl={otherUser.profile_image || ''}
                            recentMessage="Start conversation"
                            online={false}
                            onClick={() => startNewChatWithUser(otherUser.user_id)}
                        />
                        ))}
                      </CardContent>
                  </Card>
                  {/* Active Chat Window */}
        <Card
          sx={{
            flex: 1,
            height: '100%',
            p: 3,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {selectedChat ? (
            <>
              <Typography variant="h6" gutterBottom>
                Chat with {selectedChat.participantName}
              </Typography>
              <Box sx={{ flex: 1, overflowY: 'auto', mb: 2 }}>
                {selectedChat.messages.map((msg, index) => (
                  <Typography
                    key={index}
                    align={msg.sender === 'Me' ? 'right' : 'left'}
                    sx={{ mb: 1 }}
                  >
                    <strong>{msg.sender}: </strong>{msg.content}
                  </Typography>
                ))}
              </Box>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  fullWidth
                  placeholder="Type a message..."
                  value={messageInput}
                  onChange={e => setMessageInput(e.target.value)}
                  size="small"
                />
                <Button variant="contained" onClick={handleSendMessage}>
                  Send
                </Button>
              </Box>
            </>
          ) : (
            <Typography variant="h6" align="center" color="textSecondary">
              Select a conversation to start chatting.
            </Typography>
          )}
        </Card>
              </Box>
              <Snackbar anchorOrigin={{ vertical: 'top', horizontal:'center' }} open={snackbarOpen} autoHideDuration={6000} onClose={() => setSnackbarOpen(false)}>
                  <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity} sx={{ width: '100%' }}>
                      {snackbarMessage}
                  </Alert>
              </Snackbar>
          </>
  );
};

export default Chats;