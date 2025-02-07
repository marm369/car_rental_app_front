import { fetchConversation, sendMessage } from "../service/ChatService";

export const getMessages = async (userId, ownerId, setMessages) => {
  if (!userId || !ownerId) return;

  const messages = await fetchConversation(userId, ownerId);

  const formattedMessages = messages.map((message) => {
    const formattedDate = new Date(message.createdAt).toLocaleString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    return { ...message, content: `${message.content} (${formattedDate})` };
  });

  setMessages(formattedMessages);
};

export const handleSendMessage = async (
  userId,
  ownerId,
  message,
  setMessages,
  setMessage
) => {
  if (!message.trim() || !userId || !ownerId) return;

  const newMessage = { senderId: userId, content: message };

  setMessages((prevMessages) => [...prevMessages, newMessage]);
  await sendMessage(userId, ownerId, message);

  setMessage("");
};
