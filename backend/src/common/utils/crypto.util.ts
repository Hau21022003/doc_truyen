import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';

/**
 * Mật mã hóa các utility functions
 */

/**
 * Băm mật khẩu với bcrypt
 */
export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
};

/**
 * So sánh mật khẩu với hash
 */
export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};

/**
 * Tạo token ngẫu nhiên an toàn
 */
export const generateSecureToken = (length: number = 32): string => {
  return crypto.randomBytes(length).toString('hex');
};

/**
 * Tạo JWT token (cần cài đặt jsonwebtoken)
 */
export const generateJWT = (payload: object, secret: string, expiresIn: string): string => {
  // const jwt = require('jsonwebtoken');
  // return jwt.sign(payload, secret, { expiresIn });
  throw new Error('JWT generation not implemented. Please install jsonwebtoken package first.');
};

/**
 * Xác thực JWT token
 */
export const verifyJWT = (token: string, secret: string): object => {
  // const jwt = require('jsonwebtoken');
  // return jwt.verify(token, secret);
  throw new Error('JWT verification not implemented. Please install jsonwebtoken package first.');
};

/**
 * Tạo API Key
 */
export const generateAPIKey = (prefix: string = 'api'): string => {
  const timestamp = Date.now().toString(36);
  const randomPart = crypto.randomBytes(16).toString('hex');
  return `${prefix}_${timestamp}_${randomPart}`;
};

/**
 * Tạo refresh token
 */
export const generateRefreshToken = (length: number = 64): string => {
  return crypto.randomBytes(length).toString('hex');
};