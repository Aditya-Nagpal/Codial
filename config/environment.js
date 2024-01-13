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
    name: 'production'
};

module.exports=development;