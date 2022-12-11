import {Request, Response} from 'express';
import { QueryResult } from 'pg';
import db from './../db/db';
import { User } from './../models'
class UserController {
  async createUser(req: Request, res: Response) {
    const {name, surname} = req.body as User;
    try {
      const newPerson:QueryResult<User> = await db.query(`INSERT INTO person (name, surname) values ($1, $2) RETURNING *`, [name, surname])
    res.json(newPerson.rows[0]);
    } catch (error) {
      res.status(500).json(error);
    }    
  }
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
      const user: QueryResult<User> = await  db.query('SELECT * from person where id = $1', [id]);
      res.json(user.rows[0]);
    } catch (error) {
      res.status(500).json(error);
    }        
  }
  async updateUser(req: Request, res: Response) {
    const {id, name, surname} = req.body as User
    try {
      const user: QueryResult<User> = await db.query('UPDATE person set name = $1, surname = $2 where id = $3 RETURNING *', [name, surname, id]);
      res.json(user.rows[0]);
    } catch (error) {
      res.status(500).json(error);
    }       
  }
  async deleteUser(req: Request, res: Response) {
    const id = req.params.id;
    try {
      const user: QueryResult<User> = await  db.query('DELETE from person where id = $1', [id]);
      res.json(user.rows[0]);
    } catch (error) {
      res.status(500).json(error);
    }  
  }
}

export default new UserController();