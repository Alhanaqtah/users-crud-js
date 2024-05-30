import express from 'express';
import bodyParser from 'body-parser';

import {Storage} from './internal/storage/storage.js';
import {Service} from './internal/service/users.js';
import {Controller} from './internal/controller/users.js';

// CONFIG
const port = process.env.port || 5000;
const storagePath = process.env.STORAGE_PATH || './storage/storage.db';

// Repository
let storage = new Storage(storagePath); 

// Service
let service = new Service(storage);

// Controller
let controller = new Controller(service);

// Router
const app = express();

// Middleware
app.use(bodyParser.json());

app.get('/healthcheck', (req, res) => {
    res.sendStatus(200);
});

// Post user
app.post('/users', controller.signUp.bind(controller));

// Get all users
app.get('/users', controller.getUsers.bind(controller));

// Get user by id
app.get('/users/:id', controller.getByID.bind(controller));

// Patch user by id
app.patch('/users/:id', controller.updateByID.bind(controller));

// Delete user by id
app.delete('/users/:id', controller.removeByID.bind(controller));

app.listen(port, () => {
    console.log(`Server is listening on port '${port}'`)
});