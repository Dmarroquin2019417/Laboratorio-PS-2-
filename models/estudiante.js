const { Schema, model } = require('mongoose');

const EstudianteSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    correo: {
        type: String,
        required: [true, 'El correo es obligatorio'],
        unique: true
    },
    telefono: {
        type: String,
        required: [true, 'El teléfono es obligatorio']
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria']
    },
    
    role:{
        type: String,
        required: true,
        enum: ["TEACHER_ROLE"," STUDENT_ROLE"]
    },
});

module.exports = model('Estudiante', EstudianteSchema);
