const express = require("express");
const connectToDB = require("./config/db.js");
const upload = require("express-fileupload");
const app = express();

const PORT = 5000;

//connect to database
connectToDB();

//Initialize middleware to parse the JSON data from body
app.use(express.json({extended: false}));
app.use(upload());

app.get("/", (req, res) => {
    res.send("API is running");
});

app.use("/api/users", require("./routes/api/users"));
app.use("/api/login", require("./routes/api/login"));
app.use("/api/zips", require("./routes/api/zips"));

app.listen(PORT, () => {
    console.log("Server is running on Port - ", PORT);
});
