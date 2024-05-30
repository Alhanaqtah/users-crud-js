import bcrypt from 'bcryptjs';


export const ErrUserExists = new Error("User already exists");

export class Service {
    constructor(storage) {
        this.storage = storage;
    }

    async signUp(username, password) {
        const op = "service.user.signUp";

        try {
            // Проверка существования пользователя
            const existingUser = await this.storage.UserByUsername(username);
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
}
