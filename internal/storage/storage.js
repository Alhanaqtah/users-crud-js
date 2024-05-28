import sqlite3 from 'sqlite3';

export class Storage {
    constructor(storagePath) {
        this.db = new sqlite3.Database(String(storagePath));
    }

    
}