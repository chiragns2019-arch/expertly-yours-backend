const prisma = require('../config/db');

// @desc    List user's conversations
// @route   GET /api/messages/conversations
// @access  Private
const listConversations = async (req, res, next) => {
  try {
    let expert = null;
    if (req.user.role === 'EXPERT') {
      expert = await prisma.expertProfile.findUnique({
        where: { userId: req.user.id },
      });
    }

    let filter = {};
    if (expert) {
      filter = {
        OR: [
          { expertId: expert.id },
          { seekerId: req.user.id }
        ]
      };
    } else {
      filter = { seekerId: req.user.id };
    }

    const conversations = await prisma.conversation.findMany({
      where: filter,
      include: {
        seeker: { select: { id: true, name: true, avatar: true } },
        expert: {
          include: {
            user: { select: { id: true, name: true, avatar: true } },
          },
        },
        relatedRequirement: { select: { companyName: true, problemDescription: true } },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
      orderBy: { updatedAt: 'desc' },
    });

    // Format the response for the frontend Message component
    const formatted = conversations.map(c => {
      const isExpertSide = expert && c.expertId === expert.id;
      
      const participantId = isExpertSide ? c.seeker.id : c.expert.user.id;
      const participantName = isExpertSide ? c.seeker.name : c.expert.user.name;
      const participantAvatar = isExpertSide ? c.seeker.avatar : c.expert.user.avatar;
      const participantTitle = isExpertSide ? 'Seeker' : c.expert.title || 'Expert';

      return {
        id: c.id,
        participantId,
        participantName,
        participantAvatar,
        participantTitle,
        lastMessage: c.messages.length > 0 ? c.messages[0].text : 'No messages yet',
        lastMessageTime: c.messages.length > 0 ? c.messages[0].createdAt : c.updatedAt,
        unreadCount: 0, // Mock for now
        relatedRequirement: c.relatedRequirement ? c.relatedRequirement.companyName || 'Requirement' : undefined,
      };
    });

    res.json(formatted);
  } catch (error) {
    next(error);
  }
};

// @desc    Get messages for a conversation
// @route   GET /api/messages/:conversationId
// @access  Private
const getMessages = async (req, res, next) => {
  try {
    const { conversationId } = req.params;

    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
    });

    if (!conversation) {
      res.status(404);
      throw new Error('Conversation not found');
    }

    const messages = await prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: 'asc' },
    });

    res.json(messages);
  } catch (error) {
    next(error);
  }
};

// @desc    Send a message
// @route   POST /api/messages/:conversationId
// @access  Private
const sendMessage = async (req, res, next) => {
  try {
    const { conversationId } = req.params;
    const { text } = req.body;

    if (!text) {
      res.status(400);
      throw new Error('Message text is required');
    }

    const message = await prisma.message.create({
      data: {
        conversationId,
        senderId: req.user.id,
        text,
      },
    });

    // Update conversation timestamp
    await prisma.conversation.update({
      where: { id: conversationId },
      data: { updatedAt: new Date() },
    });

    res.status(201).json(message);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  listConversations,
  getMessages,
  sendMessage,
};
