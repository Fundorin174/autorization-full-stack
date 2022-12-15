require('dotenv').config();
import jwt, { JwtPayload, Secret } from 'jsonwebtoken';
import { Token, TokenPayload, User } from 'models';
import { QueryResult } from 'pg';
import db from './../db/db';

class TokenService {
  generateTokens(payload: TokenPayload) {
    const accesstoken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET as Secret, { expiresIn: '30m' });
    const refreshtoken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET as Secret, { expiresIn: '60d' });
    return {
      accesstoken, refreshtoken
    }
  }

  validateAccessToken(token: string) {
    try {
      const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET as Secret) as User;
      return userData;
    } catch (error) {
      return null;
    }
  }

  validateRefreshToken(token: string) {
    try {
      const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET as Secret) as User;
      return userData;
    } catch (error) {
      return null;
    }
  }

  async saveToken(userId: number, refreshtoken: string) {
    // only one token for user
    const tokenData: QueryResult<Token> = await db.query('SELECT * from token where userId = $1', [userId]);
    if (tokenData.rows[0]) {
      tokenData.rows[0].refreshtoken = refreshtoken;
      const token: QueryResult<Token> = await db.query('UPDATE token set refreshtoken = $1 where userId = $2 RETURNING *', [refreshtoken, userId]);
      return token.rows[0];
    }
    const token: QueryResult<Token> = await db.query(`INSERT INTO token (refreshtoken, userId) values ($1, $2) RETURNING *`, [refreshtoken, userId])
    return token.rows[0];
  }

  async deleteToken(refreshtoken: string) {
    const token: QueryResult<Token> = await db.query('DELETE from token where refreshtoken = $1', [refreshtoken]);
    return token.rows[0];
  }
  async findToken(refreshtoken: string) {
    const token: QueryResult<Token> = await db.query('SELECT * from token where refreshtoken = $1', [refreshtoken]);
    return token.rows[0];
  }
}

export default new TokenService()