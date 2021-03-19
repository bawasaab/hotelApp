const mongodbUrl = 'mongodb://127.0.0.1:27017/hotelApp';
const jwtSecret = 'SuperSecRetKey';
// const baseUrl = 'http://localhost:3000';
//  const baseUrl = 'http://humdine.com:3000';
 const baseUrl = 'https://humdine.com:8443';
// const baseUrl = 'http://ec2-13-236-87-146.ap-southeast-2.compute.amazonaws.com:3000';
const QrCodeLink = baseUrl + '/api1/visitors/load/';
const stripe_Publishable_key = 'pk_live_83msQRRmSER3tzZr2aGAcQYj00zazhb49q';
const stripe_Secret_key = 'sk_live_YwMJUPxUHfCS0YOWCXDJaxe000DtXWpFli';
const stripe_plan_id = 'plan_HSsXSND7fDFJNz';

module.exports = {
    baseUrl,
    mongodbUrl,
    jwtSecret,
    QrCodeLink,
    stripe_Publishable_key,
    stripe_Secret_key,
    stripe_plan_id
}
