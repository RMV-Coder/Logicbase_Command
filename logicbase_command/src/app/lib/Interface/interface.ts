export interface User {
    name: string
    email: string
    password: string
    company: string
    designation: string
}
export interface Project { project_id: number; project_name: string; /* ... */ }
export type NewProject = Omit<Project,'project_id'>
export interface Message { message_id: number; message_text: string; /* ... */ }
export interface Chat { chat_id: number; messages: Message[]; unreadCount: number; /* ... */ }

