const queue=require('../config/kue');
const resetLinkMailer=require('../mailers/reset_link_mailer');

queue.process('reset-link-emails', function(job,done){
    console.log('Reset-Link-Emails worker is processing a job', job.data);
    resetLinkMailer.sendResetMail(job.data);
    done();
});