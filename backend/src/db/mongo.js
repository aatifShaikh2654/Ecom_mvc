const mongoose = require("mongoose");

const db = () => {
    mongoose.connect(process.env.MONGO_DB_URL).then(() => {
        console.log("Database Connected")
    }).catch((e) => console.log(e))
}

module.exports = db