
export const configuration = {
    db: [
        {
            name: 'test',
            type: 'mysql',
            charset: 'utf8mb4',
            host: '****',
            port: 3306,
            username: 'username',
            password: 'password',
            database: 'database',
            synchronize: false,
            logging: true,
        },
        {
            name: 'second',
            type: 'mysql',
            charset: 'utf8mb4',
            host: '****',
            port: 3306,
            username: 'username',
            password: 'password',
            database: 'database_2',
            synchronize: false,
            logging: true,
        },
    ],
};