const queue=require('../config/kue');
const signUpMailer=require('../mailers/signup_mailer');

queue.process('signup-emails', function(job,done){
    console.log('Signup-emails worker is processing a job');
    signUpMailer.signUpSuccess(job.data);
    done();
});