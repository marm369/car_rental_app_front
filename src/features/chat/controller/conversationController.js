import { useEffect } from "react";
import { fetchUserConversations } from "../service/ConversationService";

const ConversationController = ({ userId, setConversations, setLoading }) => {
  useEffect(() => {
    const loadConversations = async () => {
      setLoading(true);
      const data = await fetchUserConversations(userId);
      setConversations(data);
      setLoading(false);
    };

    if (userId) {
      loadConversations();
    }
  }, [userId, setConversations, setLoading]);

  return null; // No need to render anything
};

export default ConversationController;
