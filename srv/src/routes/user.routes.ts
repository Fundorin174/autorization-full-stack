import * as express from 'express';
import userController from '../controller/user.controller';
import { body } from 'express-validator';
import authMiddlware from '../middlewares/auth-middlware';
const router = express.Router();

router.post('/registration', 
body('email').isEmail(),
body('password').isLength({min: 3, max: 30}),
body('name').isLength({min: 2, max: 150}),
body('surname').isLength({min: 2, max: 150}),
userController.registration);
router.post('/login', userController.login);
router.post('/logout', userController.logout);
router.post('/activate/:link', userController.activate);
router.get('/refresh', userController.refresh);
router.get('/user', userController.getUsers);
router.get('/user/:id', authMiddlware, userController.getUser);
router.put('/user', authMiddlware, userController.updateUser);
router.delete('/user/:id', authMiddlware, userController.deleteUser);

export default router
