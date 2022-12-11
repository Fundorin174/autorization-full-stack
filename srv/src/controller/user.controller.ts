import { Request, Response, NextFunction } from 'express';
import { QueryResult } from 'pg';
import userService from './../services/user-service';
import db from './../db/db';
import { User } from './../models'
class UserController {
  async registration(req: Request, res: Response, next: NextFunction) {
    const refreshPeriod = 30*24*60*60*1000 // 30 days in ms
    try {
      const {email, password, name, surname} = req.body;
      const userData = await userService.registration(email, password, name, surname);
      // save refresh token in cookie
      res.cookie('refreshToken', userData.refreshToken, {maxAge: refreshPeriod, httpOnly: true})
      return res.json(userData);
    } catch (error) {
      console.log(error)
      res.status(500).json(error);
    }
  }
  async login(req: Request, res: Response, next: NextFunction) {

    try {

    } catch (error) {
      res.status(500).json(error);
    }
  }
  async logout(req: Request, res: Response, next: NextFunction) {

    try {

    } catch (error) {
      res.status(500).json(error);
    }
  }
  async activate(req: Request, res: Response, next: NextFunction) {

    try {

    } catch (error) {
      res.status(500).json(error);
    }
  }
  async refresh(req: Request, res: Response, next: NextFunction) {

    try {

    } catch (error) {
      res.status(500).json(error);
    }
  }
  // async createUser(req: Request, res: Response) {
  //   const { name, surname } = req.body as User;
  //   try {
  //     const newPerson: QueryResult<User> = await db.query(`INSERT INTO person (name, surname) values ($1, $2) RETURNING *`, [name, surname])
  //     res.json(newPerson.rows[0]);
  //   } catch (error) {
  //     res.status(500).json(error);
  //   }
  // }
  async getUsers(req: Request, res: Response) {
    try {
      const users: QueryResult<User> = await db.query('SELECT * from person')
      res.json(users.rows)
    } catch (error) {
      res.status(500).json(error);
    }
  }
  async getUser(req: Request, res: Response) {
    const id = req.params.id;
    try {
      const user: QueryResult<User> = await db.query('SELECT * from person where id = $1', [id]);
      res.json(user.rows[0]);
    } catch (error) {
      res.status(500).json(error);
    }
  }
  async updateUser(req: Request, res: Response) {
    const { id, name, surname } = req.body as User
    try {
      const user: QueryResult<User> = await db.query('UPDATE person set name = $1, surname = $2 where id = $3 RETURNING *', 
      [name, surname, id]);
      res.json(user.rows[0]);
    } catch (error) {
      res.status(500).json(error);
    }
  }
  async deleteUser(req: Request, res: Response) {
    const id = req.params.id;
    try {
      const user: QueryResult<User> = await db.query('DELETE from person where id = $1', [id]);
      res.json(user.rows[0]);
    } catch (error) {
      res.status(500).json(error);
    }
  }
}

export default new UserController();