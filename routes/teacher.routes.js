const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos } = require('../middlewares/validar-campos');
const { existenteEmail, existeMaestroById, esRolValido} = require('../helpers/db-validators');
const { maestrosPost, maestrosGet, getMaestroById, maestrosPut, maestrosDelete } = require('../controllers/maestro.controller');

const router = Router();

router.get("/", maestrosGet);

router.get(
    "/:id",
    [
        check("id","El id no es un formato válido de MongoDB").isMongoId(),
        check("id").custom(existeMaestroById),
        validarCampos
    ], getMaestroById);

router.put(
    "/:id",
    [
        check("id","El id no es un formato válido de MongoDB").isMongoId(),
        check("id").custom(existeMaestroById),
        validarCampos
    ], maestrosPut);

router.delete(
        "/:id",
        [
            check("id","El id no es un formato válido de MongoDB").isMongoId(),
            check("id").custom(existeMaestroById),
            validarCampos
        ], maestrosDelete);

        
router.post(
    "/", 
    [
        check("nombre","El nombre es obligatorio").not().isEmpty(),
        check("password","El password debe ser mayor a 6 caracteres").isLength({min: 6,}),
        check("correo","Este no es un correo válido").isEmail(),
        check("correo").custom(existenteEmail),
        check("role").custom(esRolValido),
        validarCampos,
    ], maestrosPost); 

module.exports = router;
