const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos } = require('../middlewares/validar-campos');
const { existeCursoById, noExistenteEmail} = require('../helpers/db-validators');

const { estudianteasigCursoPost, estudianteasigCursoGet, getEstudianteasigCursoByid, estudianteasigCursoDelete } = require('../controllers/estudiantesasigCursos.controller');

const router = Router();

router.get("/", estudianteasigCursoGet);

router.get(
    "/buscar",
    [
        check("correo").custom(noExistenteEmail),
        validarCampos
    ], getEstudianteasigCursoByid);

router.delete(
        "/:id",
        [
            check("id","El id no es un formato válido de MongoDB").isMongoId(),
            check("id").custom(existeCursoById),
            validarCampos
        ], estudianteasigCursoDelete);

        
router.post(
    "/", 
    [
        check("correo","El estudiante es obligatorio").not().isEmpty(),
        check("materia","El curso es obligatorio").not().isEmpty(),
        validarCampos,
    ], estudianteasigCursoPost); 

module.exports = router;