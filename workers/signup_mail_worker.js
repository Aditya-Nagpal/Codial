const queue=require('../config/kue');
const signUpMailer=require('../mailers/signup_mailer');

queue.process('signup-emails', function(job,done){
    signUpMailer.signUpSuccess(job.data);
    done();
});