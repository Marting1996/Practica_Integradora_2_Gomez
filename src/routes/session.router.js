/* import { Router } from "express";
import UserModel from "../Dao/mongoManager/models/user.models.js";
import passport from "passport";
import { createHash, isValidPassword } from "../utils.js";

const userRouter = Router()

userRouter.get("/login", (req, res) => {
    res.render("login", {})
})
userRouter.get("/register", (req, res) => {
    res.render("register", {})
})

userRouter.post("/login", passport.authenticate("login", "/login"), async (req, res) => {
    if(!req.user) return res.status(400).send("Usuario no encontrado")
    req.session.user = req.user
    return res.redirect("/api/session/profile")
})

userRouter.post("/register", passport.authenticate("register", {failureRedirect: "/api/session/register"}),
    async (req, res) => {
        res.redirect("/api/session/login")
    }
);

const isAdmin = (req, res, next) => {
    if (req.session.user && req.session.user.role === "admin") {
        next();
    } else {
        res.status(403).json({ error: "Acceso denegado" });
    }
};
function auth (req, res, next) {
    if(req.session?.user) return next()
    res.redirect("/")
}

userRouter.get("/profile", auth, (req, res) => {
    const user = req.session.user
    res.render("profile", user )
})

userRouter.get("/admin", isAdmin, (req, res) => {
    res.render("admin", {})
});

userRouter.post("/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error("Error al destruir la sesión:", err);
        }
        return res.redirect("/api/session/login");
    });
});

//GITHUB
userRouter.get("/login-github",
    passport.authenticate("github", {scope: ["user:email"]}),
    async (req, res) => {}
)

userRouter.get("/githubcallback",
    passport.authenticate("github", {failureRedirect: "/"}),
    async (req, res) => {
        console.log("Callback:", req.user);
        req.session.user = req.user
        console.log(req.session);
        res.redirect("/api/session/profile")
    }
)

export default userRouter */