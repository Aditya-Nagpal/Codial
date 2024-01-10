const nodemailer=require('nodemailer');
const ejs=require('ejs');
const path=require('path');
const Secrets=require('../secrets');

let transporter=nodemailer.createTransport({
    service: Secrets.service,
    host: Secrets.host,
    port: Secrets.port,
    secure: false,
    auth: {
        user: Secrets.auth.user,
        pass: Secrets.auth.pass
    }
});

let renderTemplate=(data,relativePath) => {
    let mailHTML;
    ejs.renderFile(
        path.join(__dirname, '../views/mailers', relativePath),
        data,
        function(err, template){
            if(err){
                console.log('Error in  rendering template',err);
                return;
            }
            mailHTML=template;
        }
    );
    return mailHTML;
};

module.exports={
    transporter: transporter,
    renderTemplate: renderTemplate
};