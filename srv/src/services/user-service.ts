import { Token, TokenPayload, User } from "models";
import { QueryResult } from "pg";
import db from './../db/db';
import bcrypt from "bcrypt";
import {v4} from 'uuid';
import mailService from "./mail-service";
import tokenService from "./token-service";
import UserDto from './../dtos/user-dto';
import ApiError from "./../exeptions/api-error";

class UserService {
  async registration(email: string, password: string, name: string, surname: string) {
    // check is already exist
    const candidate: QueryResult<User> = await db.query('SELECT * from person where email = $1', [email]);
    if (candidate.rows[0]) {
      throw ApiError.BadRequest(`User with email: ${email} already exist`)
    }
    // crypt password
    const hashPassword = await bcrypt.hash(password, 3);
    // create activation Link
    const activationlink = v4();
    // create new User
    const user: QueryResult<User> = await db.query(`INSERT INTO person (email, password, isactivated, activationlink, name, surname) values ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [email, hashPassword, false, activationlink, name, surname]);
    // send mail to user with activation link 
    // beckouse it is bad email sendler
    //await mailService.sendActivationMail(email, `${process.env.API_URL}/api/activate/${activationlink}`);
    await this.activate(activationlink)// only for showing
    const userDto = new UserDto(user.rows[0]);
    // generate tokens 
    const tokens = tokenService.generateTokens({...userDto} as TokenPayload);
    // save token
    await tokenService.saveToken(userDto.id, tokens.refreshtoken);
    
    return {...tokens, user: userDto }
  }

  async activate(activationlink: string) {
    
    const user: QueryResult<User> = await db.query('SELECT * from person where activationlink = $1', [activationlink]);

    if (!user.rows[0]) {
      throw ApiError.BadRequest('Incorect Activation link')
    }
    //update user
    const activatedUser: QueryResult<User> = await db.query('UPDATE person SET isactivated = $1 WHERE id = $2 RETURNING *', 
    [true, user.rows[0].id]);
  }
  async login(email: string, password: string) {
    
    const user: QueryResult<User> = await db.query('SELECT * from person where email = $1', [email]);
    if (!user.rows[0]) {
      throw ApiError.BadRequest(`User with email: ${email} not registered`)
    }

    const isPasswordCorrect = await bcrypt.compare(password, (<User>user.rows[0]).password);
    if (!isPasswordCorrect) {
      throw ApiError.BadRequest(`Incorrect email or password`)
    }
    const userDto = new UserDto(<User>user.rows[0]);
    // generate tokens 
    const tokens = tokenService.generateTokens({...userDto} as TokenPayload);
    // save token
    await tokenService.saveToken(userDto.id, tokens.refreshtoken);
    
    return {...tokens, user: userDto }
  }
  async logout(refreshToken: string) {
    const token: Token = await tokenService.deleteToken(refreshToken);
    return token;
  }
  async getUsers() {
    const users: QueryResult<User> = await db.query('SELECT * from person')

    return users.rows[0];
  }
}

export default new UserService()