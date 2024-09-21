const mongoose = require("mongoose");

const connecDb = async () => {
  try {
    const con = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected ${con.connection.host}`.cyan.underline);
  } catch (error) {
    console.log(`Error: ${error}`.red.bold);
    process.exit();
  }
};

module.exports = connecDb;
