const mung = require('express-mung');
const bodyParser = require('body-parser');

const validateResponse = (body, _, req, res) => {
    const payload = JSON.parse(body.toString());
    if (payload.guid === 'xxx') {
        res.status(403).json({ message: "Permission Denied"});
        return;
    }
    return body;
};

const validateRequest = (req) => {
    const payload = req.body;
    return payload.guid !== 'xxx';
};

module.exports = (gatewayExpressApp) => {
    gatewayExpressApp.use(mung.write(validateResponse));

    gatewayExpressApp.use(bodyParser.raw());

    gatewayExpressApp.all('/*', (req, res, next) => {
        if (!validateRequest(req)) {
            res.status(403).json({ message: "Permission Denied"});
        } else {
            next();
        }
    });
};
