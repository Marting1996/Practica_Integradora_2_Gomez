import { Router } from "express";
import passport from "passport";
import { generateToken } from "../utils.js";

const router = Router();

//  inicio de sesión
router.get("/login", (req, res) => {
    res.render("login", {});
});

//  registro
router.get("/register", (req, res) => {
    res.render("register", {});
});

//  inicio de sesión
router.post("/login", passport.authenticate("login"), async (req, res) => {
    if (!req.user) return res.status(400).send("Usuario no encontrado");

    const token = generateToken(req.user);

    res.cookie("secretForJWT", token, {
        maxAge: 60 * 60 * 1000, // 1 hora
        httpOnly: true
    });

    res.redirect("/api/current/profile");
});

//  registro
router.post("/register", passport.authenticate("register"), async (req, res) => {
    res.redirect("/api/current/login");
});

// cerrar sesión
router.post("/logout", (req, res) => {
    res.clearCookie("secretForJWT");
    res.redirect("/api/current/login");
});

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


router.get("/", (req, res) => {
    res.render("home", {})
})

router.get("/login-github", 
    passport.authenticate("github", {scope: ["user:email"]}),
    (req, res) => {}
)

router.get("/githubcallback",
    passport.authenticate("github", {failureRedirect: "/fail-github"}),
    (req, res) => {
        console.log("Callback", req.user);

        res.cookie("secretForJWT", req.user.token).redirect("/api/current/profile")
        }
    )

router.get("/fail-github", (req, res) => {
    res.render("fail-login", {})
})
router.get("/profile", passport.authenticate("jwt", { session: false }), (req, res) => {
    console.log("Authenticated user:", req.user); 
    res.render("profile", req.user);
});

router.get("/admin", isAdmin, (req, res) => {
    res.render("admin", {})
});


export default router

