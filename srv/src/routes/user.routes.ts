import { CorsRequest } from 'cors';
import { Request, Response } from 'express';
import * as express from 'express';
import userController from '../controller/user.controller';
const router = express.Router();

router.post('/registration', userController.registration);
router.post('/login', userController.login);
router.post('/logout', userController.logout);
router.post('/activate/:link', userController.activate);
router.post('/refresh', userController.refresh);
router.post('/user', userController.registration);
router.get('/user', userController.getUsers);
router.get('/user/:id', userController.getUser);
router.put('/user', userController.updateUser);
router.delete('/user/:id', userController.deleteUser);

export default router
