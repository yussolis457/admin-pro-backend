const { response, json } = require('express');

const Medico = require('../models/medico');

const getMedicos = async(req, res = response) => {

    const medicos = await Medico.find().populate('hospital', 'nombre img').populate('usuario', 'nombre img');


    res.json({
        ok: true,
        msg: medicos
    });

}


const crearMedico = async(req, res = response) => {

    const uid = req.uid

    const medico = new Medico({
        usuario: uid,
        ...req.body
    });


    try {

        const medicoDB = await medico.save();

        res.json({
            ok: true,
            msg: medicoDB
        });



    } catch (error) {
        console.log(error);

        res.status(500).json({
            ok: false,
            msg: 'Error hable con el Administrador'
        });
    }


}


const actualizarMedico = async(req, res = response) => {
    const uid = req.uid;
    const id = req.params.id;
    try {

        const medico = Medico.findById(id);

        if (!medico) {
            res.status(404).json({
                ok: false,
                msg: 'No es valio el id del medico'
            });
        }

        const cambioMedico = {
            usuario: uid,
            ...req.body

        }

        const medicoActualizado = await Medico.findByIdAndUpdate(id, cambioMedico, { new: true });

        res.json({
            ok: true,
            medico: medicoActualizado
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

const borrarMedico = async(req, res = response) => {

    const id = req.params.id;

    try {
        const medico = await Medico.findById(id);

        if (!medico) {
            res.status(404).json({
                ok: false,
                msg: 'No se encontro id  medico'
            });
        }
        await Medico.findByIdAndDelete(id);

        res.json({
            ok: true,
            msg: 'borrarMedico'
        });

    } catch (error) {

        console.log('Fallo en el Delete');
        console.log(error);


        res.status(500).json({
            ok: false,
            msg: 'Hable con el admin'
        });


    }




}





module.exports = {
    getMedicos,
    crearMedico,
    actualizarMedico,
    borrarMedico
}