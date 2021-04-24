const jwt = require('jsonwebtoken');

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

module.exports = {
    validarJWT
}