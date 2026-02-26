const { Router } = require("express");
const { body, validationResult, param } = require("express-validator");
const router = Router();
const pool = require("../db/pool");

router.get('/', async (req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT * FROM messages ORDER BY added DESC"
    );
    res.render('index', { 
      messages: rows,
      errors: [] 
    });
  } catch (err) {
    console.error(err);
    res.status(500).render('errors/500');
  }
});

router.get(
  '/message/:id',
  param('id').isInt().withMessage('Invalid message ID'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render('errors/400', { errors: errors.array() });
    }

    const id = parseInt(req.params.id);

    try {
      const { rows } = await pool.query(
        "SELECT * FROM messages WHERE id = $1",
        [id]
      );

      if (!rows[0]) {
        return res.status(404).render('errors/404');
      }

      res.render('messageDetails', { message: rows[0] });
    } catch (err) {
      console.error(err);
      res.status(500).render('errors/500');
    }
  }
);


router.post(
  '/new',
  [
    body('username')
      .trim()
      .notEmpty().withMessage('Username is required')
      .isLength({ min: 2, max: 30 }).withMessage('Username must be 2-30 characters'),

    body('text')
      .trim()
      .notEmpty().withMessage('Message text is required')
      .isLength({ min: 1, max: 500 }).withMessage('Message must be under 500 characters')
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {

      const { rows } = await pool.query(
        "SELECT * FROM messages ORDER BY added DESC"
      );

      return res.status(400).render('index', {
        messages: rows,
        errors: errors.array(),
      });
    }

    const { username, text } = req.body;

    try {
      await pool.query(
        "INSERT INTO messages (text, username) VALUES ($1, $2)",
        [text, username]
      );

      res.redirect("/");
    } catch (err) {
      console.error(err);
      res.status(500).render('errors/500');
    }
  }
);
module.exports = router;