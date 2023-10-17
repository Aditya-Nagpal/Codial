const kue=require('kue');
const queue=kue.createQueue();
queue.on('error',function(err){
    console.log(err);
});

module.exports=queue;