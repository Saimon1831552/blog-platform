const db = require('../config/db');

const commentController = {};

commentController.postComment = async (req, res) => {
  const { body } = req.body;
  const { id } = req.params; 

  if (!body) return res.status(400).json({ message: 'Comment body required' });

  try {
    const [[post]] = await db.query('SELECT id FROM posts WHERE id = ?', [id]);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    await db.query(
      'INSERT INTO comments (post_id, user_id, body) VALUES (?, ?, ?)',
      [id, req.user.id, body]
    );
    res.status(201).json({ message: 'Comment added' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

commentController.deleteComment = async (req, res) => {
  const { id } = req.params;
  try {
    const [[comment]] = await db.query('SELECT user_id FROM comments WHERE id = ?', [id]);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });
    if (comment.user_id !== req.user.id)
      return res.status(403).json({ message: 'Not your comment' });

    await db.query('DELETE FROM comments WHERE id = ?', [id]);
    res.json({ message: 'Comment deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = commentController;