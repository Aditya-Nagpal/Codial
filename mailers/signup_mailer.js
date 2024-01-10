const nodeMailer=require('../config/nodemailer');

exports.signUpSuccess=(user)=>{
    let htmlString=nodeMailer.renderTemplate({user: user}, '/signUp/sign_up.ejs');
    nodeMailer.transporter.sendMail({
        from: 'MyCodial@gmail.com',
        to: user.email,
        subject: 'Sign up successful',
        html: htmlString
    }).then(function(info){
        return;
    })
      .catch(function(err){
        console.log('Error in sending email.',err);
        return;
      });
};