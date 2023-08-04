const mongoose = require('mongoose');
const mongoURI = "mongodb+srv://dbUser:dbUserPassword@cluster0.zt5rirz.mongodb.net/?retryWrites=true&w=majority"
mongoose.set('strictQuery', true);

const connectToMongo = () => {
    mongoose
      .connect(mongoURI)
      .then(() => console.log("connection success"))
      .catch((err) => console.log(err));
  };

module.exports = connectToMongo;