import * as crypto from "../utils/crypto.utils.js";

export const generateCookie = (user) => {
    if(!user) {
        return false
    }

    const { id, login, isAdmin } = user;
    const cookie = crypto.encryptObject({
        id,
        login,
        isAdmin
    });

    return cookie;
};