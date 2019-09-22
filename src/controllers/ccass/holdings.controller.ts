import { db } from '../../config/db';
import * as mysql from 'mysql';

export class holdingsController {
    private connection: mysql.Connection;
    constructor() {
        this.connection = (new db()).getConn();
    }

    public createQuery(sql: string) {

    }

};