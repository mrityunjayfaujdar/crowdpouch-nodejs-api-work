const mongoose = require("mongoose");

const databaseURL = "mongodb://localhost/crowdpouch-dev";

const connectToDB = async () => {
    try {
        await mongoose.connect(databaseURL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("MongoDB Connected...");
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};

module.exports = connectToDB;
