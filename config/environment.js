const development={
    name: 'development',
    asset_path: './assets',
    session_cookie_key: 'random',
    db: 'codial_development',
    smtp: {
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: 'mycodial@gmail.com',
            pass: 'awwk cbpf tgpx hacu'
        }
    },
    google_client_id: '1074133619127-nagpj34f3okck28iuifccbs1fd3n939r.apps.googleusercontent.com',
    google_client_secret: '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',
    google_callbackURL: 'http://localhost:9000/users/auth/google/callback',
    jwt_secret: 'codial'
};

const production= {
    name: 'production',
    asset_path: process.env.ASSET_PATH,
    session_cookie_key: process.env.CODIAL_SESSION_COOKIE_KEY,
    db: process.env.CODIAL_DB,
    smtp: {
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: process.env.CODIAL_GMAIL_USERNAME,
            pass: process.env.CODIAL_GMAIL_PASSWORD
        }
    },
    google_client_id: process.env.CODIAL_GOOGLE_CLIENT_ID,
    google_client_secret: process.env.CODIAL_GOOGLE_CLIENT_SECRET,
    google_callbackURL: process.env.CODIAL_GOOGLE_CALLBACK_URL,
    jwt_secret: process.env.CODIAL_JWT_SECRET
};

module.exports=eval(process.env.CODIAL_ENVIRONMENT) == undefined ? development : eval(process.env.CODIAL_ENVIRONMENT);