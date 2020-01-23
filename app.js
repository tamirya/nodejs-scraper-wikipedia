const express = require("express");
const app = express();
const routers = require("./routes/router");

app.use(routers);
app.listen(3000);
