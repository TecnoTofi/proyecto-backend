//Creamos conexiones para los diferentes ambientes
module.exports = {
    //Ambiente de desarrollo
    development: {
        client: 'pg',
        connection: {
            host: 'localhost',
            user: 'postgres',
            password: 'test1234',
            database: 'proyecto'
        }
    },
    //Ambiente de pre-produccion
    staging: {
        client: 'pg',
        connection: {
            host: 'ec2-54-225-89-195.compute-1.amazonaws.com',
            user: 'fswnxtnoweacty',
            password: '38437f10ac98c1c38897647482a3748b6742cd0dfeb45ff0505185ad14da4a85',
            database: 'ddtvcn26fkmdqg'
        }
    }
};