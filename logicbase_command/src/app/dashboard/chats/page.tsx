'use client';
import { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { useUserStore } from '@/stores/userStore';
import * as Ably from 'ably';
import ChatPreviewComponent from '@/app/components/ChatPreviewComponent';
import { Typography as AntdTypography, Space, Card as AntdCard, Button } from 'antd';
import { SendOutlined } from '@ant-design/icons';
import { Box, Card, CardContent, Snackbar, Alert, Typography, TextField, Avatar } from '@mui/material';
import { DateTime } from 'luxon';
import { StyledBadge } from '@/app/components/ChatPreviewComponent';
export const dynamic = 'force-dynamic';

const { Text } = AntdTypography;
interface AppUser {
    user_id: string | number;
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
    messages: { sender: string; content: string; timestamp: string; status: string }[];
    chatParticipants: [number, number];
}
interface AblyChatData {
  message_receiver_id: string;
  message_sender_name: string;
  message_sender_id: string;
  message_text:string;
  message_timestamp: string;
  message_chat_id: string;
}

const Chats: React.FC = () => {
    const user = useUserStore((state) => state.user);
    const realtime = useRef<Ably.Realtime | null>(null);
    const notificationSound = useRef<HTMLAudioElement | null>(null);
    const channel = useRef<Ably.RealtimeChannel | null>(null);
    const [allUsers, setAllUsers] = useState<AppUser[]>([]);
    const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
    const [messageInput, setMessageInput] = useState('');
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
    const [chats, setChats] = useState<Chat[]>([]);
    const chatWindowRef = useRef<HTMLDivElement>(null);
    const selectedChat = chats.find(chat => chat.chatId === selectedChatId);

    const fetchChats = async (userId: string) => {
        try {
            const response = await fetch(`/api/get/chats/${userId}`, {
                method: 'GET'
            });
            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.error || "Failed to fetch chats");
            }
            console.log("Fetched chat list data: ", result.chats);
            setChats(result.chats);
        } catch (error) {
            console.log(error);
        }
    }
    const fetchAllUsersForNewChat = async (userId: string) => {
        try {
            const response = await fetch(`/api/get/users/exclude/${userId}`);
            const result = await response.json();
            if (!response.ok) throw new Error(result.error || "Failed to fetch users");
            setAllUsers(result.users);
            console.log('Users: ', result.users);
        } catch (error) {
            setSnackbarMessage("Error fetching users");
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
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

            if (user && user.user_id) {
                fetchChats(user.user_id); // refresh chat list
                fetchAllUsersForNewChat(user.user_id);
                console.log("Fetched chat list");
            }
        } catch (err) {
            setSnackbarMessage("Error creating chat");
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
            console.error(err);
        }
    };

    useEffect(() => {
        // Initialize Ably instance
        realtime.current = new Ably.Realtime({
            key: process.env.NEXT_PUBLIC_ABLY_API_KEY,
            transportParams: { heartbeatInterval: 15000 },
        });

        channel.current = realtime.current.channels.get('chats');

        return () => {
            console.log('Closing Ably connection...');
            if (realtime.current) realtime.current.close();
        };
    }, []);

    useEffect(() => {
        if (user && channel.current) {
            const handleIncomingMessage = async (event_message: Ably.Message) => {
                console.log('abley message received: ', event_message)
                const { message_receiver_id, message_sender_name, message_sender_id, message_text, message_timestamp, message_chat_id }: AblyChatData = event_message.data;
                if (user && message_sender_id === user.user_id && message_receiver_id !== user.user_id) return;
                const chat = chats.find(chat => chat.chatId === message_chat_id);
                if (chat) {
                    chat.messages.push({ sender: message_sender_name, content: message_text, timestamp: DateTime.fromISO(message_timestamp).toFormat('t'), status: 'seen' });
                    setChats([...chats]);
                    if (notificationSound.current) {
                    notificationSound.current.play().catch(error => {
                        console.error("Error playing notification sound:", error);
                        // Handle potential errors like user interaction requirements
                    });
                }
                }
            };

            // Subscribe only once when the component mounts and user is available
            channel.current.subscribe('chats', handleIncomingMessage);

            // Cleanup function to unsubscribe when the component unmounts or user changes
            return () => {
                console.log('Unsubscribing from Ably channel...');
                channel.current?.unsubscribe('chats', handleIncomingMessage);
            };
        }
    }, [user, chats]); // Re-run effect if user or chats change (to handle potential race conditions)

    useEffect(() => {
        if (user?.user_id) {
            fetchChats(user.user_id as string);
            fetchAllUsersForNewChat(user.user_id as string);
        }
    }, [user?.user_id]); // Fetch data when user ID is available

    useLayoutEffect(() => {
      if (chatWindowRef.current) {
          chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
      }
    }, [selectedChat?.messages]);
    const handleSendMessage = async () => {
        if (!messageInput.trim() || !channel.current || !selectedChatId || !user?.user_id || !selectedChat?.chatParticipants) return;

        await channel.current.publish('chats', {
                message_text: messageInput.trim(),
                message_chat_id: selectedChatId,
                message_sender_id: user.user_id,
                message_sender_name: `${user.first_name} ${user.last_name}`,
                message_reciever_id: selectedChat.chatParticipants.find(value => value !== Number(user.user_id)),
                message_timestamp: new Date()
        });
        const chat = chats.find(chat => chat.chatId === selectedChatId);
                if (chat) {
                    chat.messages.push({ sender: `${user.first_name} ${user.last_name}`, content: messageInput.trim(), timestamp: DateTime.now().toFormat('t'), status: 'unread' });
                    setChats([...chats]);
                }
        
        try {
            const response = await fetch('/api/send/chat', {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message_text: messageInput.trim(),
                    message_chat_id: selectedChatId,
                    message_sender_id: user?.user_id,
                })
            });
            setMessageInput('');
            const result = await response.json();
            if (!response.ok) {
                setSnackbarMessage(result.error);
                throw new Error(result.error || "Failed to send message");
            }
            // setSnackbarMessage('Message sent!');
            // setSnackbarSeverity('success');
        } catch (error) {
            console.log(error);
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        }
    };

    return (
        <>
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    width: '100%',
                    maxWidth: '2000px',
                    minWidth: '500px',
                    height: '76vh',
                    minHeight: '100%',
                    maxHeight: '1080px',
                    gap: 2
                }}
            >
                <Card
                    sx={{
                        width: '20%',
                        maxWidth: '1920px',
                        minWidth: '200px',
                        height: '76vh',
                        minHeight: 'fit-content',
                        maxHeight: '1080px',
                        p: 2,
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
                        {allUsers.length > 0 && (<Typography variant="subtitle1" gutterBottom>
                            Start New Chat
                        </Typography>)}
                        {allUsers.map(otherUser => (
                            <ChatPreviewComponent
                                key={otherUser.user_id}
                                name={`${otherUser.first_name} ${otherUser.last_name}`}
                                avatarUrl={otherUser.profile_image || ''}
                                recentMessage="Start conversation"
                                online={false}
                                onClick={() => startNewChatWithUser(otherUser.user_id as string)}
                            />
                        ))}
                    </CardContent>
                </Card>
                {/* Active Chat Window */}
                <Card
                    sx={{
                        flex: 1,
                        height: '76vh',
                        minHeight: 'fit-content',
                        maxHeight: '1080px',
                        p: 3,
                        display: 'flex',
                        flexDirection: 'column',
                    }}
                >
                    {selectedChat ? (
                        <>
                            <Typography variant="h6" gutterBottom>
                                <Space><StyledBadge
                                            overlap="circular"
                                            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                            variant="dot"
                                          ><Avatar alt={selectedChat.participantName} src={selectedChat.avatarUrl} sx={{ width: 48, height: 48 }} /></StyledBadge> {selectedChat.participantName}</Space>
                            </Typography>
                            <Box sx={{ flex: 1, overflowY: 'auto', mb: 2, pt: '8px' }} ref={chatWindowRef}>
                                <AntdCard size='small' style={{ width: '100%', height: '100%' }}>
                                    {selectedChat.messages.length > 0 ? (
                                        selectedChat.messages.map((msg, index) => (
                                            <Typography
                                                key={index}
                                                align={user && msg.sender === `${user.first_name} ${user.last_name}` ? 'right' : 'left'}
                                                sx={{ mb: 1 }}
                                            >
                                                {user && msg.sender !== `${user.first_name} ${user.last_name}` &&
                                                    // <Space><Avatar alt={selectedChat.participantName} src={selectedChat.avatarUrl} sx={{ width: 32, height: 32 }} /><Text style={{ fontSize: '1rem', fontWeight: '500' }}>{msg.sender}</Text></Space> :
                                                    <Space><Avatar alt={selectedChat.participantName} src={selectedChat.avatarUrl} sx={{ width: 32, height: 32 }} /><Text style={{ fontSize: '1rem', fontWeight: '500' }}>{msg.sender}</Text></Space>}
                                                <Box sx={{ mt: 1, display: 'flex', justifyContent: user && msg.sender === `${user.first_name} ${user.last_name}` ? 'flex-end' : 'flex-start' }}><Box sx={{ display: 'flex', flexDirection: 'column', gap: '2px', alignItems: user && msg.sender === `${user.first_name} ${user.last_name}` ? 'flex-end' : 'flex-start' }}><AntdCard size='small' style={{ marginTop: '2px', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '1', maxWidth: 'fit-content', backgroundColor: 'rgba(22, 105, 178, 0.1)', borderColor: 'rgba(22, 105, 178, 0.3)' }}><Text>{msg.content}</Text></AntdCard><Text style={{ fontSize: '12px', color: 'rgba(0, 0, 0, 0.8)', paddingLeft: user && msg.sender === `${user.first_name} ${user.last_name}` ? '0px' : '8px', paddingRight: user && msg.sender === `${user.first_name} ${user.last_name}` ? '8px' : '0px' }}>{msg.timestamp}</Text></Box></Box>{/*•*/}
                                            </Typography>
                                        ))
                                    ) : (
                                        <Typography variant="subtitle2" color="textSecondary" align="center">
                                            No messages yet. Start the conversation!
                                        </Typography>
                                    )}
                                </AntdCard>
                            </Box>
                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <TextField
                                    fullWidth
                                    autoComplete="off"
                                    placeholder="Type a message..."
                                    value={messageInput}
                                    onChange={e => setMessageInput(e.target.value)}
                                    size="small"
                                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                                />
                                <Button type={'primary'} icon={<SendOutlined />} onClick={handleSendMessage} onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}>
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
            <audio ref={notificationSound} src="/pop-up-notify-smooth-modern-332448.mp3" preload="auto" />
            <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'center' }} open={snackbarOpen} autoHideDuration={6000} onClose={() => setSnackbarOpen(false)}>
                <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </>
    );
};

export default Chats;