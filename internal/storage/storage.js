import sqlite3 from 'sqlite3';

export const ErrUserNotFound = new Error("User not found");

export class Storage {
    constructor(storagePath) {
        this.storagePath = storagePath;
        this.db = new sqlite3.Database(storagePath, (err) => {
            if (err) {
                console.error("Failed to init connection to database:", err.message);
                throw new Error("Failed to init connection to database: " + err.message);
            }

            console.log("Database connection successfully initialized.");

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
                    console.error("Failed to create table:", err.message);
                    throw new Error("Failed to create table: " + err.message);
                } else {
                    console.log("Table 'users' created or already exists.");
                }
            });
        });
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

    async removeByID(userID) {
        return new Promise((resolve, reject) => {
            this.db.run('DELETE FROM users WHERE id = ?', [userID], function(err) {
                if (err) {
                    reject(new Error("Failed to remove user: " + err));
                } else {
                    if (!this.changes) {
                        reject(ErrUserNotFound)
                    } else {
                        resolve(null)
                    }
                }
            })
        })
    }
}
