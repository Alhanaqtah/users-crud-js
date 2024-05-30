import sqlite3 from 'sqlite3';

export const ErrUserNotFound = new Error("User not found");

export class Storage {
    constructor(storagePath) {
        this.storagePath = storagePath;
        this.db = new sqlite3.Database(storagePath), (err) => {
            if (err) {
                throw new Error("Failed to init connection to database");
            }

            this.db.run(`
                CREATE TABLE IF NOT EXISTS users (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    username VARCHAR(255) NOT NULL,
                    pass_hash BLOB NOT NULL,
                    name VARCHAR(255),
                    surname VARCHAR(255),
                    status TEXT,
                    registration_date DATETIME DEFAULT CURRENT_TIMESTAMP
                )
            `, (err) => {
                if (err) {
                    console.error("storage.storage.constructor", 'Failed to create table:', err);
                }
            });
        };
    }
    
    async createUser(username, passHash) {
        return new Promise((resolve, reject) => {
            this.db.run('INSERT INTO users (username, pass_hash) VALUES (?, ?)', [username, passHash], function(err) {
                if (err) {
                    reject(new Error("Failed to create user: " + err));
                } else {
                    resolve(this.lastID);                
                }
            });
        });
    }

    async userByUsername(username) {
        return new Promise((resolve, reject) => {
            this.db.get('SELECT * FROM users WHERE username = ?', [username], (err, row) => {
                if (err) {
                    reject(new Error("Failed to get user: " + err));
                } else {
                    if (row) {
                        resolve({
                            id: row.id,
                            username: row.username,
                            name: row.name,
                            surname: row.surname,
                            status: row.status,
                            registrationDate: row["registration_date"],
                        });
                    } else {
                        resolve(null);
                    }
                }
            });
        });
    }

    async getUsers() {
        return new Promise((resolve, reject) => {
            this.db.all('SELECT id, username, name, surname, status, registration_date FROM users', (err, row) => {
                if (err) {
                    reject(new Error("Failed o get all users"));
                } else {
                    resolve(row);
                }
            });
        });
    }

    async getByID(userID) {
        return new Promise((resolve, reject) => {
            this.db.get('SELECT username, name, surname, status, registration_date FROM users WHERE id = ?', [userID], (err, row) => {
                if (err) {
                    reject(new Error("Failed to get user by id:" + err));
                } else {
                    if (row !== undefined) {
                        resolve(row);
                    } else {
                        reject(ErrUserNotFound);
                    }
                }
            });
        });
    }
}
