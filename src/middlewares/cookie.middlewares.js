import * as crypto from "../utils/crypto.utils.js";

export const isConnected = (req, res, next) => {
    const { slyhear } = req.cookies;
    if(!slyhear) {
        return res.redirect('/');
    }
    req.user = crypto.decryptObject(slyhear);
    res.set('Cache-Control', 'no-store');
    next();
}

