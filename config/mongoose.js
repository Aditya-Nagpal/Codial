const mongoose=require('mongoose');
const env=require('./environment');
mongoose.connect(`mongodb://localhost/${env.db}`);

const db=mongoose.connection;

db.on('error',console.error.bind(console,'Error in connecting to database'));

db.once('open',function (){
    console.log("Server connected to database successfully.");
});

module.exports=db;