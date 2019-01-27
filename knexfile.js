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
            host: 'ec2-50-17-203-51.compute-1.amazonaws.com',
            user: 'fxwkjcyawtohcl',
            password: '83e094bb1501761f33a1ef74b6dba4b8a85d220b46615a5461a39b2d904b3ac3',
            database: 'd8f4u4b2llotp6'
        }
    }
};