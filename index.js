
// import whtasapp-api js
const { Client, LegacySessionAuth,  LocalAuth } = require('whatsapp-web.js');
// import terminal qr code
const qrcode = require('qrcode-terminal');
// import untuk write file
const fs = require('fs');


const SESSION_FILE_PATH = '/whatsapp-session.json';
let sessionCfg;

if(fs.existsSync(SESSION_FILE_PATH)) {
    sessionCfg = require(SESSION_FILE_PATH);
}

const client = new Client({
    puppeteer: {
        headless: true
    },
    authStrategy: new LocalAuth({
        clientId: "client-one"
    })
});

client.initialize(); 

// apabila masih loading screen
client.on('loading_screen', (percent, message) => {
    console.log('LOADING SCREEN', percent, message);
});
 
// apabila qr code telah diterima
client.on('qr', (qr) => {
    // console.log("QR Code yang diterima : ", qr);
    qrcode.generate(qr);
});

// apabila sudah terautentikasi
client.on('authenticated', (session) => {
    console.log('AUTHENTICATED', session);
    sessionCfg = session;
});

client.on('auth_failure', msg => {
    // Fired if session restore was unsuccessful
    console.error('AUTHENTICATION FAILURE', msg);
});


// apabila sudah ready 
client.on('ready', () => {
    console.log('Client is ready ...');
})

// apabila org ngirim pesan kekita, maka akan kita balas...
client.on('message', msg => {
    if(msg.body){
        msg.reply('jangan balas wa ini, saya adalah BOT');
    }
})

// apabila logout
client.on('disconnected', (reason) => {
    console.log('Client was logged out', reason);
});

