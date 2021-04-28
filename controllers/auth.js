const { response } = require('express');
const Usuario = require('../models/usuario');
const bcrypt = require('bcryptjs');

const { generarJWT } = require('../helpers/jwt');
const { googleVerify } = require('../helpers/google-verify');


const login = async(req, res = response) => {

    const { email, password } = req.body;

    try {
        // verificar emaill
        const usuarioDB = await Usuario.findOne({ email });

        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'Email no encontrado'
            });
        }

        //VALID PASSWORD

        const validPassword = bcrypt.compareSync(password, usuarioDB.password);
        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'Contraseña no válida'
            });
        }
        //generar el token
        const token = await generarJWT(usuarioDB.id);

        res.json({
            ok: true,
            msg: 'Hola mundo',
            token
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'

        });
    }

}

const googleSignIn = async(req, res = response) => {

    const googleToken = req.body.token;

    try {

        const { name, email, picture } = await googleVerify(googleToken);
        //REVisar si la cuenta existe 
        const usuarioDB = await Usuario.findOne({ email });

        let usuario;
        if (!usuarioDB) {
            usuario = new Usuario({
                nomnbre: name,
                email,
                password: '@@@',
                img: picture,
                google: true
            });
        } else {
            ///Existe usuario
            usuario = usuarioDB;
            usuario.google = true;
        }
        //GUardar en BD
        await usuario.save();

        //generar JWT
        const token = await generarJWT(usuario.id);

        res.json({
            ok: true,
            msg: 'google sign in',
            token
        });
    } catch (error) {
        res.status(400).json({
            ok: false,
            msg: 'token fallo',

        });
    }

}

const renewToken = async(req, res = response) => {

    const uid = req.uid;
    const token = await generarJWT(uid);

    res.json({
        ok: true,
        token
    });
}

module.exports = {
    login,
    googleSignIn,
    renewToken
}