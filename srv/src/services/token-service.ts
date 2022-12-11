require('dotenv').config();
import jwt, { Secret } from 'jsonwebtoken';
import { Token, TokenPayload } from 'models';
import { QueryResult } from 'pg';
import db from './../db/db';

class TokenService {
  generateTokens(payload: TokenPayload) {
    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET as Secret, { expiresIn: '30m' });
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET as Secret, { expiresIn: '60d' });
    return {
      accessToken, refreshToken
    }
  }

  async saveToken(userId: number, refreshToken: string) {
    // only one token for user
    const tokenData: QueryResult<Token> = await db.query('SELECT * from token where userId = $1', [userId]);
    if (tokenData.rows[0]) {
      tokenData.rows[0].refreshToken = refreshToken;
      const token: QueryResult<Token> = await db.query('UPDATE token set refreshToken = $1 where userId = $2 RETURNING *', [refreshToken, userId]);
      return token.rows[0];
    }
    const token: QueryResult<Token> = await db.query(`INSERT INTO token (refreshToken, userId) values ($1, $2) RETURNING *`, [refreshToken, userId])
    return token.rows[0];
  }
}

export default new TokenService()