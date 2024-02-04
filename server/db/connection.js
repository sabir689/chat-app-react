const mongoose = require('mongoose');




const url = "mongodb+srv://chatBot:IzhW0xHs9D9MF7ab@cluster0.lyyi68r.mongodb.net/?retryWrites=true&w=majority";

mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(()=>console.log('Connected to the db')).catch((e)=>console.log('Error',e))