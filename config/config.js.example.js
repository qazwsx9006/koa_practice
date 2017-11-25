module.exports = {
  DevelopEnv: true,
  Line: {
    channelAccessToken: 'YOUR_CHANNEL_ACCESS_TOKEN',
    channelSecret: 'YOUR_CHANNEL_SECRET'
  },
  SSL:{
    key: '/etc/letsencrypt/live/$your-domain/privkey.pem',
    cert: '/etc/letsencrypt/live/$your-domain/fullchain.pem'
  },
  AstrologyUrl: 'url',
  pushMeValidateCode: 'code',
  MeId: 'id'
}