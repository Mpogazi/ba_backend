import * as mysql from 'mysql';

export class db {
    private connection: mysql.Connection;
    private config = {
        host: process.env.BOWEN_HOSTNAME || 'ba-db.clt2cjuppshj.ap-southeast-1.rds.amazonaws.com',
        user: process.env.BOWEN_USERNAME || 'ba_dev',
        password: process.env.BOWEN_DB_PASSWORD || 'dev',
        database: 'ba-db'
    };

    constructor() {
        this.connection = mysql.createConnection(this.config);
    }

    public getConn(): mysql.Connection {
        return this.connection;
    }
}