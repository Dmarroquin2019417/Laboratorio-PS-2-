const { response, json } = require('express');
const bcryptjs = require('bcryptjs');
const Estudiante = require('../models/estudiante');
const { generarJWT } = require("../helpers/generar-jwt");

const estudiantesGet = async (req, res = response) => {
    const { limite, desde } = req.query;
    const query = { estado: true };

    const [total, estudiantes] = await Promise.all([
        Estudiante.countDocuments(query),
        Estudiante.find(query)
            .skip(Number(desde))
            .limit(Number(limite))
    ]);

    res.status(200).json({
        total,
        estudiantes
    });
};

const getEstudianteById = async (req, res) => {
    const { id } = req.params;
    const estudiante = await Estudiante.findOne({ _id: id });

    res.status(200).json({
        estudiante
    });
};

const estudiantesPut = async (req, res) => {
    const { id } = req.params;
    const { _id, password, correo, telefono, ...resto } = req.body;

    const estudiante = await Estudiante.findByIdAndUpdate(id, resto);

    res.status(200).json({
        msg: 'Estudiante actualizado exitosamente',
        estudiante
    });
};

const estudiantesDelete = async (req, res) => {
    const { id } = req.params;
    await Estudiante.findByIdAndUpdate(id, { estado: false });

    const estudiante = await Estudiante.findByIdAndUpdate(id, { estado: false });
    res.status(200).json({
        msg: 'Estudiante eliminado exitosamente',
        estudiante
    });
};

const estudiantesPost = async (req, res) => {
    const { nombre, correo, telefono, password, role } = req.body;
    const estudiante = new Estudiante({ nombre, correo, telefono, password, role });

    const salt = bcryptjs.genSaltSync();
    estudiante.password = bcryptjs.hashSync(password, salt);

    await estudiante.save();
    res.status(200).json({
        estudiante
    });
};

const estudiantesLogin = async (req, res) => {
    const { correo, password } = req.body;

    try{
        const estudiante = await Estudiante.findOne({ correo });

    if (!estudiante) {
        return res.status(400).json({
            msg: 'El Estudiante no sea encontrado'
        });
    }

    if(!estudiante.estado){
        return res.status(400).json({
            msg: 'Estudiante borrado de la base de datos'
        })
    }

    const passwordValido = bcryptjs.compareSync(password, estudiante.password);

    if (!passwordValido) {
        return res.status(400).json({
            msg: 'Contraseña incorrecta'
        });
    }

    const token = await generarJWT(estudiante.id)

    res.status(200).json({
        msg_1: 'Inicio de sesión exitosamente',
        msg_2: 'Welcome '+ estudiante.nombre,
        msg_3: 'Este su token =>'+ token,
    });

    }catch(e){
        console.log(e);
        res.status(500).json({
            msg: 'Eyy un error inesperado'
        })
    }

}


module.exports = {
    estudiantesDelete,
    estudiantesPost,
    estudiantesGet,
    getEstudianteById,
    estudiantesPut,
    estudiantesLogin
};
