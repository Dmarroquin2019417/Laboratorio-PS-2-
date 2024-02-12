const { response, json } = require('express');
const bcryptjs = require('bcryptjs');
const Maestro = require('../models/maestro'); // Importa la clase Maestro

const maestrosGet = async (req, res = response) => {
    const { limite, desde } = req.query;
    const query = { estado: true };

    const [total, maestros] = await Promise.all([
        Maestro.countDocuments(query),
        Maestro.find(query)
            .skip(Number(desde))
            .limit(Number(limite))
    ]);

    res.status(200).json({
        total,
        maestros
    });
};

const getMaestroById = async (req, res) => {
    const { id } = req.params;
    const maestro = await Maestro.findOne({ _id: id });

    res.status(200).json({
        maestro
    });
};

const maestrosPut = async (req, res) => {
    const { id } = req.params;
    const { _id, password, correo, ...resto } = req.body;

    await Maestro.findByIdAndUpdate(id, resto);

    const maestro = await Maestro.findOne({ _id: id });

    res.status(200).json({
        msg: 'Maestro actualizado exitosamente',
        maestro
    });
};

const maestrosDelete = async (req, res) => {
    const { id } = req.params;
    await Maestro.findByIdAndUpdate(id, { estado: false });

    const maestro = await Maestro.findOne({ _id: id });

    res.status(200).json({
        msg: 'Maestro eliminado exitosamente',
        maestro
    });
};

const maestrosPost = async (req, res) => {
    const { nombre, correo, password, role } = req.body;
    const maestro = new Maestro({ nombre, correo, password, role });

    const salt = bcryptjs.genSaltSync();
    maestro.password = bcryptjs.hashSync(password, salt);

    await maestro.save();
    res.status(200).json({
        maestro
    });
};

module.exports = {
    maestrosDelete,
    maestrosPost,
    maestrosGet,
    getMaestroById,
    maestrosPut
};
