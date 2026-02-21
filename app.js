require("dotenv").config();
const express = require("express");
const app = express();
const path = require("node:path");
const assetsPath = path.join(__dirname, "public");
const indexRouter = require('./routes/index')
const messageRouter = require('./routes/newMessage')

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.static(assetsPath));

app.use(express.urlencoded({ extended: true }));

app.use("/", indexRouter);
app.use("/new", messageRouter);

app.use((req, res, next) => {
    res.status(404).render('errors/404');
  });

  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).render('errors/500');
  });  

const PORT = process.env.PORT || 3000;
app.listen(PORT, (error) => {
  if (error) {
    throw error;
  }
  console.log(`Server is Live! - listening on port ${PORT}!`);
});
