// student.controller.js
const { response } = require('express');
const bcryptjs = require('bcryptjs');
const Estudiante = require('../models/estudiante');

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

    await Estudiante.findByIdAndUpdate(id, resto);

    const estudiante = await Estudiante.findOne({ _id: id });

    res.status(200).json({
        msg: 'Estudiante actualizado exitosamente',
        estudiante
    });
};

const estudiantesDelete = async (req, res) => {
    const { id } = req.params;
    await Estudiante.findByIdAndUpdate(id, { estado: false });

    const estudiante = await Estudiante.findOne({ _id: id });

    res.status(200).json({
        msg: 'Estudiante eliminado exitosamente',
        estudiante
    });
};

const estudiantesPost = async (req, res) => {
    const { nombre, correo, telefono, password } = req.body;
    const estudiante = new Estudiante({ nombre, correo, telefono, password });

    const salt = bcryptjs.genSaltSync();
    estudiante.password = bcryptjs.hashSync(password, salt);

    await estudiante.save();
    res.status(200).json({
        estudiante
    });
};

const asignarCurso = async (req, res) => {
    const { idEstudiante, idCurso } = req.body;

    try {
        const estudiante = await Estudiante.findById(idEstudiante);
        if (!estudiante) {
            return res.status(404).json({ msg: 'Estudiante no encontrado' });
        }

        if (estudiante.cursos.length >= 3) {
            return res.status(400).json({ msg: 'El estudiante ya está asignado a 3 cursos' });
        }

        if (estudiante.cursos.includes(idCurso)) {
            return res.status(400).json({ msg: 'El estudiante ya está asignado a este curso' });
        }

        estudiante.cursos.push(idCurso);
        await estudiante.save();

        res.json({ msg: 'Curso asignado correctamente', estudiante });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Hubo un error al asignar el curso' });
    }
};

const cursosAsignados = async (req, res) => {
    const { idEstudiante } = req.params;

    try {
        const estudiante = await Estudiante.findById(idEstudiante).populate('cursos');
        if (!estudiante) {
            return res.status(404).json({ msg: 'Estudiante no encontrado' });
        }

        res.json({ cursos: estudiante.cursos });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Hubo un error al obtener los cursos asignados' });
    }
};

module.exports = {
    estudiantesDelete,
    estudiantesPost,
    estudiantesGet,
    getEstudianteById,
    estudiantesPut,
    asignarCurso,
    cursosAsignados
};
