
const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos } = require('../middlewares/validar-campos');
const { existenteEmail, existeEstudianteById, esRolValido} = require('../helpers/db-validators');
const { estudiantesPost, estudiantesGet, getEstudianteById, estudiantesPut, estudiantesDelete, asignarCurso, cursosAsignados } = require('../controllers/student.controller');

const router = Router();

router.get("/", estudiantesGet);

router.get("/:id", [
    check("id","El id no es un formato válido de MongoDB").isMongoId(),
    check("id").custom(existeEstudianteById),
    validarCampos
], getEstudianteById);

router.put("/:id", [
    check("id","El id no es un formato válido de MongoDB").isMongoId(),
    check("id").custom(existeEstudianteById),
    validarCampos
], estudiantesPut);

router.delete("/:id", [
    check("id","El id no es un formato válido de MongoDB").isMongoId(),
    check("id").custom(existeEstudianteById),
    validarCampos
], estudiantesDelete);

router.post("/", [
    check("nombre","El nombre es obligatorio").not().isEmpty(),
    check("password","El password debe ser mayor a 6 caracteres").isLength({min: 6}),
    check("correo","Este no es un correo válido").isEmail(),
    check("correo").custom(existenteEmail),
    check("telefono","El teléfono es obligatorio").not().isEmpty(), 
    validarCampos,
], estudiantesPost);

router.post("/asignar-curso", asignarCurso);

router.get("/:id/cursos", [
    check("id","El id no es un formato válido de MongoDB").isMongoId(),
    check("id").custom(existeEstudianteById),
    validarCampos
], cursosAsignados);

module.exports = router;
