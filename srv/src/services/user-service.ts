import { TokenPayload, User } from "models";
import { QueryResult } from "pg";
import db from './../db/db';
import bcrypt from "bcrypt";
import {v4} from 'uuid';
import mailService from "./mail-service";
import tokenService from "./token-service";
import UserDto from './../dtos/user-dto';

class UserService {
  async registration(email: string, password: string, name: string, surname: string) {
    // check is already exist
    const candidate: QueryResult<User> = await db.query('SELECT * from person where email = $1', [email]);
    if (candidate.rows[0]) {
      throw new Error(`User with email: ${email} already exist`)
    }
    // crypt password
    const hashPassword = await bcrypt.hash(password, 3);
    // create activation Link
    const activationLink = v4();
    // create new User
    const user: QueryResult<User> = await db.query(`INSERT INTO person (email, password, isActivated, activationLink, name, surname) values ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [email, hashPassword, false, activationLink, name, surname]);
    // send mail to user with activation link 
    await mailService.sendActivationMail(email, activationLink);
    const userDto = new UserDto(user.rows[0]);
    // generate tokens 
    const tokens = tokenService.generateTokens({...userDto} as TokenPayload);
    // save token
    await tokenService.saveToken(userDto.id, tokens.refreshToken);
    
    return {...tokens, user: userDto }
  }
}

export default new UserService()