// models/estudiante.js

const { Schema, model } = require('mongoose');

const EstudianteSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    correo: {
        type: String,
        required: [true, 'El correo es obligatorio']
    },
    telefono: {
        type: String,
        required: [true, 'El teléfono es obligatorio']
    },
    password: {
        type: String,
        required: [true, 'La password es obligatoria']
    }
});

module.exports = model('Estudiante', EstudianteSchema);
