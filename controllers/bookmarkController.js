const prisma = require('../config/db');

// @desc    Add a bookmark
// @route   POST /api/bookmarks
// @access  Private
const addBookmark = async (req, res, next) => {
  try {
    const { expertId } = req.body;

    const existingBookmark = await prisma.bookmark.findFirst({
      where: {
        seekerId: req.user.id,
        expertId: expertId,
      },
    });

    if (existingBookmark) {
      res.status(400);
      throw new Error('Already bookmarked');
    }

    const bookmark = await prisma.bookmark.create({
      data: {
        seekerId: req.user.id,
        expertId: expertId,
      },
      include: {
        expert: {
          include: {
            user: { select: { name: true, avatar: true } },
          },
        },
      },
    });

    res.status(201).json(bookmark);
  } catch (error) {
    next(error);
  }
};

// @desc    Remove a bookmark
// @route   DELETE /api/bookmarks/:id
// @access  Private
const removeBookmark = async (req, res, next) => {
  try {
    const bookmark = await prisma.bookmark.findUnique({
      where: { id: req.params.id },
    });

    if (!bookmark) {
      res.status(404);
      throw new Error('Bookmark not found');
    }

    if (bookmark.seekerId !== req.user.id) {
      res.status(403);
      throw new Error('Not authorized to remove this bookmark');
    }

    await prisma.bookmark.delete({
      where: { id: req.params.id },
    });

    res.json({ message: 'Bookmark removed' });
  } catch (error) {
    next(error);
  }
};

// @desc    List bookmarks
// @route   GET /api/bookmarks
// @access  Private
const listBookmarks = async (req, res, next) => {
  try {
    const bookmarks = await prisma.bookmark.findMany({
      where: { seekerId: req.user.id },
      include: {
        expert: {
          include: {
            user: { select: { name: true, avatar: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(bookmarks);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addBookmark,
  removeBookmark,
  listBookmarks,
};
