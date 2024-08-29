import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { TOKEN_SECRET } from "../config.js";
import { createAccessToken } from "../libs/jwt.js";

export const register = async (req, res) => {
    const { email, password, username } = req.body;

    try {
        //primero valido al usuario
        const userFound = await User.findOne({ email });
        if (userFound) {
            return res.status(400).json(["The email already exists"]);
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const newUser = new User({
            username,
            email,
            password: passwordHash,
        });

        //guardo el usuario y creo el token
        const userSaved = await newUser.save();

        // Creo el token y lo envio al frontend
        const token = await createAccessToken({ id: userFound._id });
        res.json({
            id: userSaved._id,
            username: userSaved.username,
            email: userSaved.email,
            token: token,
        });

        /*         
                const token = await createAccessToken({ id: userSaved._id });
        res.cookie("token", token);

        res.json({
            id: userSaved._id,
            username: userSaved.username,
            email: userSaved.email,
            createdAt: userSaved.createdAt,
            updatedAt: userSaved.updatedAt,
        }); */
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const userFound = await User.findOne({ email });

        if (!userFound) {
            return res.status(400).json({ message: "User not found" });
        }

        //.compare devuelve true o false
        const isMatch = await bcrypt.compare(password, userFound.password);

        if (!isMatch) {
            return res.status(400).json({ message: "Incorrect password" });
        }

        // Creo el token y lo envio al frontend
        const token = await createAccessToken({ id: userFound._id });
        res.json({
            id: userFound._id,
            username: userFound.username,
            email: userFound.email,
            token,
        });

        /*         

        res.cookie("token", token);
        res.json({
            id: userFound._id,
            username: userFound.username,
            email: userFound.email,
            createdAt: userFound.createdAt,
            updatedAt: userFound.updatedAt,
        }); */
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Verificar el token desde el frontend
export const verifyToken = async (req, res) => {
    const token = req.headers["authorization"]?.split(" ")[1]; // Obtener el token del header Authorization

    console.log("token header: ", token);

    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    jwt.verify(token, TOKEN_SECRET, async (err, user) => {
        if (err) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const userFound = await User.findById(user.id);
        if (!userFound) {
            return res.status(401).json({ message: "Unauthorized" });
        } else {
            return res.json({
                id: userFound._id,
                username: userFound.username,
                email: userFound.email,
            });
        }
    });
};

//verifica si el usuario existe
/* export const verifyToken = async (req, res) => {
    const { token } = req.cookies;

    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    } else {
        jwt.verify(token, TOKEN_SECRET, async (err, user) => {
            if (err) {
                return res.status(401).json({ message: "Unauthorized" });
            }

            const userFound = await User.findById(user.id);
            if (!userFound) {
                return res.status(401).json({ message: "Unauthorized" });
            } else {
                return res.json({
                    id: userFound._id,
                    username: userFound.username,
                    email: userFound.email,
                });
            }
        });
    }
}; */

export const logout = (req, res) => {
    res.clearCookie("token"); // Elimina la cookie con el nombre "token"
    res.sendStatus(200); // Responde con un estado 200 (OK)
};

//export const profile = async (req, res) => {
//    //console.log(req.user);
//    const userFound = await User.findById(req.user.id);
//
//    if (!userFound) return res.status(400).json({ message: "User not found" });
//
//    return res.json({
//        id: userFound._id,
//        username: userFound.username,
//        email: userFound.email,
//        createdAt: userFound.createdAt,
//        updatedAt: userFound.updatedAt,
//    });
//};
