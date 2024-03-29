const express = require('express');
const cors = require('cors');
const { dbConnection } = require('../db/config');

class Server{

    constructor(){
        this.app = express();
        this.port = process.env.PORT;
        this.usuariosPath = '/api/estudiantes';
        this.cursosPath = '/api/cursos';
        this.estudiantesPath = '/api/estudiantes_Asigancion';

        this.conectarDB();

        this.middlewares();

        this.routes();
    }

    async conectarDB(){
        await dbConnection();
    }

    middlewares(){
        this.app.use(express.static('public'));
        this.app.use(cors());
        this.app.use(express.json());
    }

    routes(){
        this.app.use(this.usuariosPath, require('../routes/student.routes'));
        this.app.use(this.cursosPath, require('../routes/cursos.routes'));
        this.app.use(this.estudiantesPath, require('../routes/estudiantesasigCurso.routes'));
        
    }

    listen(){
        this.app.listen(this.port, () => {
            console.log('Servidor ejecutado y escuchando en el puerto', this.port);
        });
    }
}


module.exports = Server;
