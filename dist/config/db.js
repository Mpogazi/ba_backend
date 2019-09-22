"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mysql = __importStar(require("mysql"));
class db {
    constructor() {
        this.config = {
            host: process.env.BOWEN_HOSTNAME || 'ba-db.clt2cjuppshj.ap-southeast-1.rds.amazonaws.com',
            user: process.env.BOWEN_USERNAME || 'ba_dev',
            password: process.env.BOWEN_DB_PASSWORD || 'dev',
            database: 'ba-db'
        };
        this.connection = mysql.createConnection(this.config);
    }
    getConn() {
        return this.connection;
    }
}
exports.db = db;
//# sourceMappingURL=db.js.map