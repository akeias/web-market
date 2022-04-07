import User from "../../../models/User"
import { body } from 'express-validator';
import { customHandler } from '../../../utils/server/commonHandler';
import { Err, Ok } from "../../../utils/server/commonError";
import { createJWT, encryptPassword, uuid4, verifyJWT } from "../../../utils/encrypt";
import { validateRequest } from "../../../utils/server/middleware";
import LoginToken, { loginToken } from "../../../models/LoginToken";

export interface loginQuery {
    id: string,
    password: string,
    fingerprint: string,
    persistent: boolean
}

const handler = customHandler()
    .post(
        validateRequest([
            body("id").exists(),
            body("password").exists(),
            body("fingerprint").exists(), // fingerprint required
            body("persistent").isBoolean()
        ]),
        async (req, res) => {
            let { id, password, fingerprint, persistent } = req.body
            const ip = (req.headers["x-real-ip"] || "0.0.0.0").toString()
            password = encryptPassword(password)
            const result = await User.findOne({ id, password })
            if (result) {
                const { role } = result
                const access_jti = uuid4()
                const refresh_jti = uuid4()
                const consistDate = persistent ? 14 : 1
                const expirationtime = consistDate.toString() + "d"
                let expireAt = new Date()
                expireAt.setDate(expireAt.getDate() + consistDate)
                const loginToken: loginToken = { userid: id, jti: refresh_jti, fingerprint, ip, createdAt: new Date(), expireAt }
                const access_token = await createJWT(id, role, access_jti, "30m")
                const refresh_token = await createJWT(id, role, refresh_jti, expirationtime)
                const cookies = [`access_token=${access_token};Max-Age=${30 * 60};Path=/;HttpOnly;Secure;SameSite=Strict`,
                `refresh_token=${refresh_token};Max-Age=${consistDate * 24 * 60 * 60};Path=/;HttpOnly;Secure;SameSite=Strict`]
                res.setHeader('Set-Cookie', cookies)
                await new LoginToken(loginToken).save()
                Ok(res, role)
            } else {
                Err(res, "not a valid id or password")
            }
        }
    )
    .delete(
        async (req, res) => {
            const cookies = [`access_token=;Max-Age=-1;Path=/;HttpOnly;Secure;SameSite=Strict`,
                `refresh_token=;Max-Age=-1;Path=/;HttpOnly;Secure;SameSite=Strict`]
            res.setHeader('Set-Cookie', cookies)
            const { refresh_token } = req.cookies
            if (refresh_token) {
                const { jti } = await verifyJWT(refresh_token)
                await LoginToken.deleteOne({ jti })
            }
            Ok(res, "logout success")
            // res.redirect("/")
        }
    )

export default handler