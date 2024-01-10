const nodeMailer=require('../config/nodemailer');

// this is another way of exporting a method.
exports.newComment=(comment) => {
    let htmlString=nodeMailer.renderTemplate({comment: comment}, '/comments/new_comment.ejs');
    nodeMailer.transporter.sendMail({
        from: 'MyCodial@gmail.com',
        to: comment.user.email,
        subject: 'new comment published',
        html: htmlString
    }).then(function(info){
        return;
    })
      .catch(function(err){
        console.log('Error in sending email.',err);
        return;
      });
};