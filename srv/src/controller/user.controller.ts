import { Request, Response, NextFunction } from 'express';
import userService from './../services/user-service';
import { User } from '../models'
import {  validationResult } from 'express-validator';
import ApiError from './../exeptions/api-error';
class UserController {
  
  async registration(req: Request, res: Response, next: NextFunction) {
    const refreshPeriod = 30*24*60*60*1000 // 30 days in ms
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(ApiError.BadRequest('Validation error', errors.array()));
      }
      const {email, password, name, surname} = req.body;
      const userData = await userService.registration(email, password, name, surname);
      // save refresh token in cookie
      res.cookie('refreshtoken', userData.refreshtoken, {maxAge: refreshPeriod, httpOnly: true})
      return res.json(userData);
    } catch (error) {
      next(error);
    }
  }
  async login(req: Request, res: Response, next: NextFunction) {
    const refreshPeriod = 30*24*60*60*1000 // 30 days in ms
    try {
      const {email, password} = req.body;
      const userData = await userService.login(email, password);
      // save refresh token in cookie
      res.cookie('refreshtoken', userData.refreshtoken, {maxAge: refreshPeriod, httpOnly: true});
      return res.json(userData);
    } catch (error) {
      next(error);
    }
  }
  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const {refreshtoken} = req.cookies;
      if (refreshtoken) {
        const token = await userService.logout(refreshtoken);
        res.clearCookie('refreshtoken');
        return res.json(token);
      }

    } catch (error) {
      next(error);
    }
  }
  async activate(req: Request, res: Response, next: NextFunction) {

    try {
      const activationLink = req.params.link;
      await userService.activate(activationLink);
      return res.redirect(process.env.CLIENT_URL!);
    } catch (error) {
      next(error);
    }
  }
  async refresh(req: Request, res: Response, next: NextFunction) {

    const refreshPeriod = 30*24*60*60*1000 // 30 days in ms
    try {
      const {refreshtoken} = req.cookies;

      const userData = await userService.refresh(refreshtoken);
      // save refresh token in cookie
      res.cookie('refreshtoken', userData.refreshtoken, {maxAge: refreshPeriod, httpOnly: true});
      return res.json(userData);
    } catch (error) {
      next(error);
    }
  }

  async getUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const userData = await userService.getUsers();      
      res.json(userData);
    } catch (error) {
      next(error);
    }
  }
  async getUser(req: Request, res: Response, next: NextFunction) {
    const id = req.params.id;
    try {
      const userData = await userService.getUser(+id);      
      res.json(userData);
    } catch (error) {
      next(error);
    }
  }
  async updateUser(req: Request, res: Response, next: NextFunction) {
    const { id, name, surname } = req.body as User
    try {
      const userData = await userService.updateUser(+id, name, surname);    
      res.json(userData);
    } catch (error) {
      next(error);
    }
  }
  async deleteUser(req: Request, res: Response, next: NextFunction) {
    const id = +req.params.id;
    try {
      const userData = await userService.deleteUser(id);
      res.json(userData);
    } catch (error) {
      next(error);
    }
  }
}

export default new UserController();