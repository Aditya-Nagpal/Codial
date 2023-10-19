const nodeMailer=require('../config/nodemailer');

exports.sendResetMail=(resetToken) => {
  console.log(resetToken);
    let htmlString=nodeMailer.renderTemplate({resetToken: resetToken}, '/reset_mails/reset_link_mail.ejs');
    nodeMailer.transporter.sendMail({
        from: 'MyCodial@gmail.com',
        to: resetToken.user.email,
        subject: 'Reset password request',
        html: htmlString
    }).then(function(info){
        console.log('Reset mail sent.');
        return;
    })
      .catch(function(err){
        console.log('Error in sending reset mail',err);
        return;
      });
};