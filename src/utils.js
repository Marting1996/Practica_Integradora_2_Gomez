import { fileURLToPath } from "url"
import { dirname } from 'path'
import passport from "passport"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

import bcrypt from "bcrypt"
import  Jwt  from "jsonwebtoken"

const PRIVATE_KEY = "secretForJWT"

export const createHash = (password => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10))
})

export const isValidPassword = (user, password) => {
    return bcrypt.compareSync(password, user.password)
}
//generamos el token
export const generateToken = (user) => {
    const token = Jwt.sign( {user}, PRIVATE_KEY, {expiresIn: "24h"})
    return token
}
export const extractCookie = req => {
    const token = (req && req.cookies) ? req.cookies[PRIVATE_KEY] : null
    console.log("Cookie Extractor:", token);
    return token
}
//extraemos el token
export const authToken = (req, res, next) => {
    const authToken = req.headers.auth
    if(!authToken) {
        return res.status(401).send({
            error: "No estas autorizado"
        })
    }

    const token = authToken
    Jwt.verify(token, PRIVATE_KEY, (error, credentials) => {
        if(error) return res.status(403).send({error: "No estas autorizado"})
        req.user = credentials.user
        next()
    })
}

export const passportCall = strategy => {
    return async(req, res, next) => {
        passport.authenticate(strategy, function(err, user, info) {
            if(err) return next(err)
            if(!user) {
                return res.status(401).send({
                    error: info.messages? info.messages : info.toString()
                })
            }
            req.user = user
            next()
        })(req, res, next)
    }
}

export const authorization = role => {
    return async(req, res, next) => {
        const user = req.user
        if(!user) return res.status(401).send({error: "Sin autorizacion"})
        if(user.user.role !== role) return res.status(403).send({error: "Sin permisos"})

        return next()
    }
}

export default __dirname


