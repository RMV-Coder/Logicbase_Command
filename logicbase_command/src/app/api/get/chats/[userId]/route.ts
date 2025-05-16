// /api/get/chats/${userId}/route.ts
import { NextResponse, NextRequest } from "next/server";
import pool from "@/app/lib/Database/db";
import { RowDataPacket } from "mysql2";

interface Message {
  sender: string;
  content: string;
  timestamp: string;
  status: string;
}

interface Chat {
  chatId: string;
  participantName: string;
  avatarUrl: string | null;
  recentMessage: string | null;
  online: boolean;
  messages: Message[];
}

interface ChatQueryRow extends RowDataPacket {
  chat_id: number;
  chat_token: string;
  chat_participants: [number, number];
  recent_message: string | null;
  recent_time: Date | null;
  other_user_id: number;
  other_first_name: string;
  other_last_name: string;
  other_profile_image: string | null;
  is_active: number;
}

interface MessageQueryRow extends RowDataPacket {
  message_id: number;
  message_text: string;
  message_timestamp: Date;
  message_status:string;
  sender_first_name: string;
  sender_last_name: string;
  message_chat_id: number;
}

export async function GET(req: NextRequest, { params }: { params: { userId: string } }) {
  try {
    const { userId } = params;
    const connection = await pool.getConnection();
    console.log("User ID:", userId);

    try {
      // Fetch chats and the other participant's info, along with the most recent message and online status
      const chatsQuery = `
        SELECT
          c.chat_id,
          c.chat_token,
          JSON_EXTRACT(chat_config, '$.participants') AS chat_participants,
          MAX(cm2.user_id) AS other_user_id,
          MAX(u2.first_name) AS other_first_name,
          MAX(u2.last_name) AS other_last_name,
          MAX(u2.profile_image) AS other_profile_image,
          MAX(u2.isActive) AS is_active,
          MAX(m.message_text) AS recent_message,
          MAX(m.message_timestamp) AS recent_time
        FROM chats c
        JOIN chat_members cm ON cm.chat_id = c.chat_id AND cm.user_id = ?
        JOIN chat_members cm2 ON cm2.chat_id = c.chat_id AND cm2.user_id != ?
        LEFT JOIN users u2 ON u2.user_id = cm2.user_id
        LEFT JOIN chat_message m ON m.message_chat_id = c.chat_id AND m.message_timestamp = (
          SELECT MAX(message_timestamp)
          FROM chat_message
          WHERE message_chat_id = c.chat_id
        )
        GROUP BY c.chat_id, c.chat_token
        ORDER BY recent_time DESC;
      `;

      const [chatRows] = await connection.execute<ChatQueryRow[]>(chatsQuery, [userId, userId]);
      console.log("Chat rows:", chatRows);

      const chatsWithRecentMessage: Omit<Chat, 'messages'>[] = chatRows.map((row) => ({
        chatId: String(row.chat_id),
        participantName: `${row.other_first_name} ${row.other_last_name}`,
        avatarUrl: row.other_profile_image,
        recentMessage: row.recent_message,
        online: Boolean(row.is_active),
        chatParticipants:row.chat_participants,
        // recentTime: row.recent_time ? row.recent_time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : null, // We don't need recentTime in the final structure
      }));

      // Fetch all messages for each chat
      const chatsWithMessages = await Promise.all(
        chatsWithRecentMessage.map(async (chat) => {
          const messagesQuery = `
            SELECT
              m.message_text AS content,
              m.message_timestamp AS timestamp,
              u.first_name AS sender_first_name,
              u.last_name AS sender_last_name
            FROM chat_message m
            JOIN users u ON u.user_id = m.message_sender_id
            WHERE m.message_chat_id = ?
            ORDER BY m.message_timestamp ASC;
          `;
          const [messageRows] = await connection.execute<MessageQueryRow[]>(messagesQuery, [chat.chatId]);
          const messages: Message[] = messageRows.map((msgRow) => ({
            sender: `${msgRow.sender_first_name} ${msgRow.sender_last_name}`,
            content: msgRow.content,
            timestamp: msgRow.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            status: msgRow.message_status
          }));
          return { ...chat, messages };
        })
      );

      console.log("Chats with Messages:", chatsWithMessages);
      return NextResponse.json({ chats: chatsWithMessages, message: "Chat Data Retrieved Successfully" }, { status: 200 });
    } finally {
      if (connection) connection.release();
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}





// // /api/get/chats/${userId}/route.ts
// import { NextResponse, NextRequest } from "next/server";
// import pool from "@/app/lib/Database/db";
// import { RowDataPacket } from "mysql2";

// interface Message {
//   sender: string;
//   content: string;
//   timestamp: string;
//   status: string;
// }

// interface Chat {
//   chatId: string;
//   participantName: string;
//   avatarUrl: string | null;
//   recentMessage: string | null;
//   online: boolean;
//   messages: Message[];
//   chatParticipants: [number, number]; // Added chatParticipants
// }

// interface ChatQueryRow extends RowDataPacket {
//   chat_id: number;
//   chat_token: string;
//   chat_participants: [number, number];
//   recent_message: string | null;
//   recent_time: Date | null;
//   other_user_id: number;
//   other_first_name: string;
//   other_last_name: string;
//   other_profile_image: string | null;
//   is_active: number;
// }

// interface MessageQueryRow extends RowDataPacket {
//   message_id: number;
//   message_text: string;
//   message_timestamp: Date;
//   message_status: string;
//   sender_first_name: string;
//   sender_last_name: string;
//   message_chat_id: number;
// }

// interface ChatParticipantsQueryRow extends RowDataPacket {
//   chat_id: number;
//   user_id: number;
// }

// export async function GET(req: NextRequest, { params }: { params: { userId: string } }) {
//   try {
//     const { userId } = params;
//     const connection = await pool.getConnection();
//     console.log("User ID:", userId);

//     try {
//       // Fetch chats and the other participant's info, along with the most recent message and online status
//       const chatsQuery = `
//         SELECT
//           c.chat_id,
//           c.chat_token,
//           JSON_EXTRACT(chat_config, '$.participants') AS chat_participants,
//           MAX(cm2.user_id) AS other_user_id,
//           MAX(u2.first_name) AS other_first_name,
//           MAX(u2.last_name) AS other_last_name,
//           MAX(u2.profile_image) AS other_profile_image,
//           MAX(u2.isActive) AS is_active,
//           MAX(m.message_text) AS recent_message,
//           MAX(m.message_timestamp) AS recent_time
//         FROM chats c
//         JOIN chat_members cm ON cm.chat_id = c.chat_id AND cm.user_id = ?
//         JOIN chat_members cm2 ON cm2.chat_id = c.chat_id AND cm2.user_id != ?
//         LEFT JOIN users u2 ON u2.user_id = cm2.user_id
//         LEFT JOIN chat_message m ON m.message_chat_id = c.chat_id AND m.message_timestamp = (
//           SELECT MAX(message_timestamp)
//           FROM chat_message
//           WHERE message_chat_id = c.chat_id
//         )
//         GROUP BY c.chat_id, c.chat_token
//         ORDER BY recent_time DESC;
//       `;

//       const [chatRows] = await connection.execute<ChatQueryRow[]>(chatsQuery, [userId, userId]);
//       console.log("Chat rows:", chatRows);

//       // // Fetch participants for each chat
//       // const chatParticipantsMap: Record<number, [number, number]> = {};
//       // const allChatIds = chatRows.map(row => row.chat_id);

//       // if (allChatIds.length > 0) {
//       //   const participantsQuery = `
//       //     SELECT chat_id, user_id
//       //     FROM chat_members
//       //     WHERE chat_id IN (?)
//       //     ORDER BY chat_id, user_id ASC;
//       //   `;
//       //   const [participantRows] = await connection.execute<ChatParticipantsQueryRow[]>(
//       //     participantsQuery,
//       //     [allChatIds]
//       //   );

//       //   participantRows.forEach(row => {
//       //     if (!chatParticipantsMap[row.chat_id]) {
//       //       chatParticipantsMap[row.chat_id] = [];
//       //     }
//       //     chatParticipantsMap[row.chat_id].push(row.user_id);
//       //   });
//       // }

//       const chatsWithRecentMessage: Omit<Chat, 'messages' | 'chatParticipants'>[] = chatRows.map((row) => ({
//         chatId: String(row.chat_id),
//         participantName: `${row.other_first_name} ${row.other_last_name}`,
//         avatarUrl: row.other_profile_image,
//         recentMessage: row.recent_message,
//         online: Boolean(row.is_active),
//       }));

//       // Fetch all messages for each chat and add participants
//       const chatsWithMessages = await Promise.all(
//         chatsWithRecentMessage.map(async (chat) => {
//           const messagesQuery = `
//             SELECT
//               m.message_text AS content,
//               m.message_timestamp AS timestamp,
//               m.message_status,
//               u.first_name AS sender_first_name,
//               u.last_name AS sender_last_name
//             FROM chat_message m
//             JOIN users u ON u.user_id = m.message_sender_id
//             WHERE m.message_chat_id = ?
//             ORDER BY m.message_timestamp ASC;
//           `;
//           const [messageRows] = await connection.execute<MessageQueryRow[]>(messagesQuery, [chat.chatId]);
//           const messages: Message[] = messageRows.map((msgRow) => ({
//             sender: `${msgRow.sender_first_name} ${msgRow.sender_last_name}`,
//             content: msgRow.content,
//             timestamp: msgRow.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
//             status: msgRow.message_status,
//           }));

//           // const chatParticipants = chatParticipantsMap[Number(chat.chatId)] || [-1, -1];

//           return { ...chat, messages };
//         })
//       );

//       console.log("Chats with Messages and Participants:", chatsWithMessages);
//       return NextResponse.json({ chats: chatsWithMessages, message: "Chat Data Retrieved Successfully" }, { status: 200 });
//     } finally {
//       if (connection) connection.release();
//     }
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json({ error: "Server error." }, { status: 500 });
//   }
// }