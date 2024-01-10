const queue=require('../config/kue');
const resetLinkMailer=require('../mailers/reset_link_mailer');

queue.process('reset-link-emails', function(job,done){
    resetLinkMailer.sendResetMail(job.data);
    done();
});