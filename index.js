const express = require("express");
const connectToDB = require("./config/db.js");
const app = express();

const PORT = 5000;

//connect to database
connectToDB();

//Initialize middleware to parse the JSON data from body
app.use(express.json({extended: false}));

app.get("/", (req, res) => {
    res.send("API is running");
});

app.listen(PORT, () => {
    console.log("Server is running on Port - ", PORT);
});
