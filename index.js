const express=require('express');
const app=express();
const port=9000;

app.listen(port,function (err){
    if(err){
        console.log(`Error in connecting to server ${err}`);
        return;
    }
    console.log(`Server connected successfully ${port}`);
});