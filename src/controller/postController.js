const db = require('../config/db');

const postController = {};

postController.getAll = async (req, res) => {
  try {
    const [posts] = await db.query(`
      SELECT p.id, p.title, p.content, p.created_at,
             u.name AS author, c.name AS category
      FROM posts p
      JOIN users u           ON p.user_id     = u.id
      LEFT JOIN categories c ON p.category_id = c.id
      ORDER BY p.created_at DESC
    `);
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

postController.getId = async (req, res) => {
  const { id } = req.params;
  try {
    const [[post]] = await db.query(`
      SELECT p.id, p.title, p.content, p.created_at,
             u.name AS author, c.name AS category
      FROM posts p
      JOIN users u           ON p.user_id     = u.id
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.id = ?
    `, [id]);

    if (!post) return res.status(404).json({ message: 'Post not found' });

    const [comments] = await db.query(`
      SELECT c.id, c.body, c.created_at, u.name AS author
      FROM comments c
      JOIN users u ON c.user_id = u.id
      WHERE c.post_id = ?
      ORDER BY c.created_at ASC
    `, [id]);

    res.json({ ...post, comments });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

postController.post = async (req, res) => {
  const { title, content, category_id } = req.body;
  if (!title || !content)
    return res.status(400).json({ message: 'Title and content required' });

  try {
    const [result] = await db.query(
      'INSERT INTO posts (user_id, category_id, title, content) VALUES (?, ?, ?, ?)',
      [req.user.id, category_id || null, title, content]
    );
    res.status(201).json({ message: 'Post created', postId: result.insertId });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

postController.update = async (req, res) => {
  const { title, content, category_id } = req.body;
  const { id } = req.params;
  try {
    const [[post]] = await db.query('SELECT user_id FROM posts WHERE id = ?', [id]);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    if (post.user_id !== req.user.id)
      return res.status(403).json({ message: 'Not your post' });

    await db.query(
      'UPDATE posts SET title = ?, content = ?, category_id = ? WHERE id = ?',
      [title, content, category_id || null, id]
    );
    res.json({ message: 'Post updated' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

postController.deletePost = async (req, res) => {
  const { id } = req.params;
  try {
    const [[post]] = await db.query('SELECT user_id FROM posts WHERE id = ?', [id]);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    if (post.user_id !== req.user.id)
      return res.status(403).json({ message: 'Not your post' });

    await db.query('DELETE FROM posts WHERE id = ?', [id]);
    res.json({ message: 'Post deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = postController;