const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');
const validarJWT = (req, res, next) => {
    //leer el token

    const token = req.header('x-token');

    console.log(token);

    if (!token) {
        return res.status(401).json({
            ok: false,
            msg: 'no hay token en la peticion'
        });
    }

    try {
        const { uid } = jwt.verify(token, process.env.JWT_SECRET);

        console.log(uid);
        req.uid = uid;


        next();

    } catch (error) {
        return res.status(401).json({
            ok: false,
            msg: 'token invalido'
        });
    }








}

validarADMIN_ROLE = async(req, res, next) => {

    const uid = req.uid;
    try {
        const usuarioDB = await Usuario.findById(uid);

        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe usuario'
            });
        }
        if (usuarioDB.role !== 'ADMIN_ROLE') {
            return res.status(403).json({
                ok: false,
                msg: 'No tiene autorizacion el  usuario'
            });
        }
        next();



    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Habla con el administrador'
        })

    }
}
validarADMIN_ROLEoMismoUsuario = async(req, res, next) => {

    const uid = req.uid;

    const id = req.params.id;
    try {
        const usuarioDB = await Usuario.findById(uid);

        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe usuario'
            });
        }
        if (usuarioDB.role === 'ADMIN_ROLE' || uid === id) {
            next();
        } else {
            return res.status(403).json({
                ok: false,
                msg: 'No tiene autorizacion el  usuario'
            });
        }




    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Habla con el administrador'
        })

    }
}


module.exports = {
    validarJWT,
    validarADMIN_ROLE,
    validarADMIN_ROLEoMismoUsuario
}