import passport from "passport";
import local from "passport-local"
import GithubStrategy from "passport-github2"
import passportJWT from "passport-jwt"
import UserModel from "../Dao/mongoManager/models/user.models.js";
import { createHash, isValidPassword, extractCookie, generateToken } from "../utils.js";

const LocalStrategy = local.Strategy
const JWTStrategy = passportJWT.Strategy
const JWTextract = passportJWT.ExtractJwt

const initializePassport = () => {
    passport.use("github", new GithubStrategy(
        {
            clientID: "Iv1.083263fa4f14668c",
            clientSecret: "88058ba0a1c9f1a3d7821080db053e7fe6ad51ea",
            callbackURL: "http://localhost:8080/api/current/githubcallback"
        },
        async (accessToken, refreshToken, profile, done) => {
            console.log(profile);
            try {
                const email = profile._json.email
                const user = await UserModel.findOne({ email }).lean().exec()
                if (user) {
                    console.log("El usuario ya existe");
                } else {
                    console.log("El usuario no existe, Registralo");
                    const newUser = {
                        first_name: profile._json.name,
                        email,
                        password: "",
                        role: "user"
                    }
                    const result = await UserModel.create(newUser)
                }
                const token = generateToken(user)
                user.token = token
                return done(null, user)
    
            } catch (error) {
                return done ("Error al loguear con git", error)
            }
        }
    ))

    passport.use("register", new LocalStrategy(
        {
            passReqToCallback: true,
            usernameField: "email"
        },
        async(req, username, password, done) => {
            const { first_name, last_name, email, age } = req.body
            try {
                const user = await UserModel.findOne({ email: username })
                if(user) {
                    console.log("El usuario ya existe");
                    return done(null, false)
                }
                const newUser = {
                    first_name,
                    last_name,
                    email,
                    age,
                    password: createHash(password)
                }
                const result = await UserModel.create(newUser)
                console.log(result);

                const token = generateToken(result)
                result.token = token
                
                return done(null, result)
            } catch (error) {
                return done("Error al registrar" + error)
            }
        }
    ))

    passport.use("login", new LocalStrategy(
        {usernameField: "email"},
        async (username, password, done) => {
            const user = await UserModel.findOne({email: username}).lean().exec()
            try {
                if(!user) {
                    console.error("El usuario no existe");
                    return done(null, false)
                }
                if(!isValidPassword(user, password)) {
                    console.error("Contraseña incorrecta");
                    return done(null, false)
                }
                return done(null, user)
            } catch (error) {
                return done("Error en el login" + error)
            }
        }
    ))
     //Autenticacion, extrae y validar el jwt
     passport.use("jwt", new JWTStrategy(
        {
            jwtFromRequest: JWTextract.fromExtractors([extractCookie]),
            secretOrKey: "secretForJWT"
        },
        (jwt_payload, done) => {
            try {
                return done(null, jwt_payload)
            } catch(e) {
                return done(e)
            }
        }
        
    ))

    passport.serializeUser((user, done) => {
        done(null, user._id)
    })

    passport.deserializeUser(async(id, done) => {
        const user = await UserModel.findById(id)
        done(null, user)
    })
}

export default initializePassport