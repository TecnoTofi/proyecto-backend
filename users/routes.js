const queries = require('./dbQueries');

const roles = (req, res) => {
    console.log('Conexion GET entrante : /api/user/role');
    queries
        .users
        .getRoles()
        .then(roles => {
            console.log('Informacion de Roles obtenida');
            res.status(200).json(roles);
        });
    console.log('Informacion de Roles enviada');
};

module.exports = { roles };