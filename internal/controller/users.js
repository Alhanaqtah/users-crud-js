import { ErrUserExists, ErrUserNotFound } from '../service/users.js';

export class Controller {
    constructor(service) {
        this.service = service;
    }

    async signUp(req, res) {
        try {
            const { username, password } = req.body;
            
            if (!username || !password) {
                return res.status(400).json({ error: 'Invalid credentials' });
            }
    
            let userID = await this.service.signUp(username, password);
            
            return res.status(200).json({ id: userID });
        } catch (error) {
            if (error === ErrUserExists) {
                return res.status(409).json({ error: 'User already exists' });
            } else {
                return res.status(500).json({ error: 'Internal error' });
            }
        }
    }

    async getUsers(req, res) {
        try {
            let users = await this.service.getUsers();

            return res.status(200).json(users);
        } catch (error) {
            return res.status(500).json({ error: 'Internal error' });
        }
    }

    async getByID(req, res) {
        try {
            const userID = req.params.id;

            const user = await this.service.getByID(userID);

            return res.status(200).json(user);
        } catch (error) {
            if (error === ErrUserNotFound)
                return res.status(404).json({error: 'User not found'});
            return res.status(500).json({error: 'Internal error'});
        }
    }
}
