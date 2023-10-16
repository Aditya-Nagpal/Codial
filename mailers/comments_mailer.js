const nodeMailer=require('../config/nodemailer');

// this is another way of exporting a method.
exports.newComment=(comment) => {
    console.log('Inside newComment mailer');
    nodeMailer.transporter.sendMail({
        from: 'MyCodial@gmail.com',
        to: comment.user.email,
        subject: 'new comment published',
        html: '<h1>Your comment is now published.</h1>'
    }).then(function(info){
        console.log('Message sent');
        return;
    })
      .catch(function(err){
        console.log('Error in sending email.',err);
        return;
      });
};