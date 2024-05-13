const mongoose = require('mongoose');
const mongoURI = "mongodb+srv://sonvanerohit88:dbUserPassword@cluster0.c7cwjgp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
mongoose.set('strictQuery', true);

const connectToMongo = () => {
    mongoose
      .connect(mongoURI)
      .then(() => console.log("connection success"))
      .catch((err) => console.log(err));
  };

module.exports = connectToMongo;
