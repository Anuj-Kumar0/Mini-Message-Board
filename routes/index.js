const { Router } = require("express");
const router = Router();
const pool = require("../db/pool");

router.get('/', async (req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT * FROM messages ORDER BY added DESC"
    );
    res.render('index', { messages: rows });
  } catch (err) {
    console.error(err);
    res.status(500).render('errors/500');
  }
});
router.get('/message/:id', async(req, res) => {
  const id = parseInt(req.params.id);
  const { rows } = await pool.query(
    "SELECT * FROM messages WHERE id = $1",
    [id]
  );

  if (!rows[0]) {
    return res.status(404).render('errors/404');
  }

  res.render('messageDetails', { message: rows[0] });
});

  router.post('/new', async(req, res) => {

   const { username, text } = req.body;
   
   await pool.query(
    "INSERT INTO messages (text, username) VALUES ($1, $2)",
    [text, username]
  );

    res.redirect("/")
  })

  module.exports = router;