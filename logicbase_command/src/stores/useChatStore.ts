// // stores/useChatStore.ts
// import { create } from 'zustand'
// import { immer } from 'zustand/middleware/immer'
// import { Chat, Message } from '@/app/lib/Interface/interface'
// import * as chatService from '@/app/lib/Interface/interface'

// interface ChatState {
//   chats: Chat[]
//   activeChatId?: number
//   loading: boolean
//   error?: string

//   fetchChats: () => Promise<void>
//   openChat: (chatId: number) => void
//   sendMessage: (chatId: number, text: string) => Promise<void>
//   markAsRead: (chatId: number) => void
// }

// export const useChatStore = create<ChatState>()(
//   immer((set) => ({
//     chats: [],
//     activeChatId: undefined,
//     loading: false,
//     error: undefined,

//     fetchChats: async () => {
//       set(state => { state.loading = true; state.error = undefined })
//       try {
//         const list = await chatService.getAllChats()
//         set(state => {
//           state.chats = list
//           state.loading = false
//         })
//       } catch (err: unknown) {
//         set(state => {
//           state.error = err || 'Failed to load chats'
//           state.loading = false
//         })
//       }
//     },

//     openChat: (id) => {
//       set(state => {
//         state.activeChatId = id
//         // optionally clear unread count:
//         const chat = state.chats.find(c => c.chat_id === id)
//         if (chat) chat.unreadCount = 0
//       })
//     },

//     sendMessage: async (chatId, text) => {
//       try {
//         const msg: Message = await chatService.postMessage(chatId, text)
//         set(state => {
//           const chat = state.chats.find(c => c.chat_id === chatId)
//           if (chat) chat.messages.push(msg)
//         })
//       } catch (err: any) {
//         console.error('sendMessage error', err)
//       }
//     },

//     markAsRead: (chatId) => {
//       set(state => {
//         const chat = state.chats.find(c => c.chat_id === chatId)
//         if (chat) chat.unreadCount = 0
//       })
//     },
//   }))
// )
