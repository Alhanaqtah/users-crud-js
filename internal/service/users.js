import bcrypt from 'bcryptjs';

export const ErrUserExists = new Error("User already exists");
export const ErrUserNotFound = new Error("User not found");

export class Service {
    constructor(storage) {
        this.storage = storage;
    }

    async signUp(username, password) {
        const op = "service.user.signUp";

        try {
            // Проверка существования пользователя
            const existingUser = await this.storage.userByUsername(username);
            if (existingUser) {
                throw ErrUserExists;
            }
            
            // Хэширование пароля
            const passHash = await bcrypt.hash(password, 10);
            
            // Создание пользователя
            const id = await this.storage.createUser(username, passHash);
            
            console.log(op, 'User signed up successfully. ID:', id);

            return id;        
        } catch (error) {
            console.error(op, 'Error while signing up:', error.message);
            throw error;
        }
    }

    async getUsers() {
        const op = "service.user.getUsers";

        try {
            let users = await this.storage.getUsers();

            return users;
        } catch (error) {
            console.error(op, "Failed to get all users:", error.message);
            throw error;
        }
    }

    async getByID(userID) {
        const op = 'service.user.getByID';

        try {
            const user = await this.storage.getByID(userID);
            
            return user;
        } catch (error) {
            console.error(op, 'Error while getting user:', error.message);

            if (error.message === ErrUserNotFound.message)
                throw ErrUserNotFound;
        }
    }

    async removeByID(userID) {
        const op = 'service.user.removeByID';
        try {
            await this.storage.removeByID(userID);
        } catch (error) {
            console.error(op, 'Error while removing user:', error.message);

            if (error.message === ErrUserNotFound.message)
                throw ErrUserNotFound;
            
            throw error;
        }
    }

    async updateByID(userID, updates) {
        const op = 'service.user.patchByID';
        
        try {
            if (updates.username) {
                const existingUser = await this.storage.userByUsername(updates.username);
                if (existingUser && existingUser.id !== userID) {
                    throw ErrUserExists;
                }
            }

            await this.storage.updateByID(userID, updates);
        } catch (error) {
            console.error(op, 'Error while updating user:', error.message);
            if (error.message === ErrUserNotFound.message)
                throw ErrUserNotFound;
            throw error;
        }
    }
}
