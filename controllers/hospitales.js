const { response } = require('express');

const Hospital = require('../models/hospital');


const getHospitales = async(req, res = response) => {

    const hospitales = await Hospital.find()
        .populate('usuario', 'nombre img');



    res.json({
        ok: true,
        msg: hospitales
    });

}


const crearHospital = async(req, res = response) => {

    const uid = req.uid;

    const hospital = new Hospital({
        usuario: uid,
        ...req.body
    });



    try {



        const hospitalDB = await hospital.save();


        res.json({
            ok: true,
            msg: hospitalDB
        });


    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }



}


const actualizarHospital = async(req, res = response) => {
    const id = req.params.id;
    const uid = req.uid;

    try {
        const hospital = await Hospital.findById(id);

        if (!hospital) {
            res.status(404).json({
                ok: false,
                msg: 'No se encontro hospital'
            });
        }
        // hospital.nombre = req.body.nombre;
        const cambiosHospital = {
                ...req.body,
                usuario: uid
            }
            //el new : true es para actualizar de inmediato la BD
        const hospitalActualizado = await Hospital.findByIdAndUpdate(id, cambiosHospital, { new: true });

        res.json({
            ok: true,
            hospital: hospitalActualizado
        });

    } catch (error) {
        console.log('Fallo en el update');
        console.log(error);


        res.status(500).json({
            ok: false,
            msg: 'Hable con el admin'
        });

    }




}

const borrarHospital = async(req, res = response) => {

    const id = req.params.id;


    try {
        const hospital = await Hospital.findById(id);

        if (!hospital) {
            res.status(404).json({
                ok: false,
                msg: 'No se encontro hospital'
            });
        }
        await Hospital.findOneAndDelete(id);
        //el new : true es para actualizar de inmediato la BD

        res.json({
            ok: true,
            msg: 'hospital eliminado'
        });

    } catch (error) {
        console.log('Fallo en el update');
        console.log(error);


        res.status(500).json({
            ok: false,
            msg: 'Hable con el admin'
        });

    }

}





module.exports = {
    getHospitales,
    crearHospital,
    actualizarHospital,
    borrarHospital
}