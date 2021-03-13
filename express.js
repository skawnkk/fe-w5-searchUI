const express = require("express");
const server = express();
server.use(express.static("public"))
const AMAZONPATH = 'https://completion.amazon.com/api/2017/suggestions?mid=ATVPDKIKX0DER&alias=aps&suggestion-type=KEYWORD&prefix=';

server.get("/", (req, res) => {
   res.render(index.html);
})

server.listen(3000, (err) => {
   if (err) return console.log("err");
   console.log("the server is listening on port 3000");
});

