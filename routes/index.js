const { Router } = require("express");
const router = Router();

const messages = [
    {
      text: "Hi there!",
      user: "Amando",
      added: new Date()
    },
    {
      text: "Hello World!",
      user: "Charles",
      added: new Date()
    }
  ];
  
  router.get('/', (req, res) => {
    res.render('index', { messages: messages });
  });

  router.get('/message/:index', (req, res) => {
    const i = parseInt(req.params.index);
    const message = messages[i];
  
    if (!message) return res.status(404).send('Message not found');
  
    res.render('messageDetails', { message });
  });

  router.post('/new', (req, res) => {

    const messageUser = req.body.user; 
    const messageText = req.body.text;

    messages.push({ text: messageText, user: messageUser, added: new Date() });

    res.redirect("/")
  })

  module.exports = router;