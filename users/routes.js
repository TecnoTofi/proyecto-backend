const queries = require('./dbQueries');

const roles = (req, res) => {
    console.log('Conexion GET entrante : /api/user/role');
    queries
        .roles
        .getAll()
        .then(roles => {
            console.log('Informacion de Roles obtenida');
            res.status(200).json(roles);
        })
        .catch(err => {
            console.log(`Error en Query SELECT de Role : ${err}`);
            res.status(500).json({message: err});
         });
    console.log('Informacion de Roles enviada');
};

module.exports = { roles };