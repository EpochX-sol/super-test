import { writable } from 'svelte/store';
import type { Writable } from 'svelte/store';
import prisma from '$lib/db/prisma';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'; 
import { browser } from '$app/environment';

const JWT_SECRET = 'env.JWT_SECRET';  

interface User {
  id: string;
  email: string;
  name: string;
}

export const user: Writable<User | null> = writable(null);

export const authHandler = {
  login: async (email: string, password: string): Promise<User> => {
    const foundUser = await prisma.user.findUnique({ where: { email } });
    if (!foundUser) throw new Error('User not found');
    
    const isValid = await bcrypt.compare(password, foundUser.password);
    if (!isValid) throw new Error('Invalid password');
    
    const { password: _, ...userWithoutPassword } = foundUser;
     
    const token = jwt.sign({ userId: userWithoutPassword.id }, JWT_SECRET, { expiresIn: '7d' });
     
    if (browser) {
      document.cookie = `session=${token}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Strict; HttpOnly`;
    }
    
    user.set(userWithoutPassword);
    console.log(userWithoutPassword)
    return userWithoutPassword;
  },
  
  logout: (): void => {
    user.set(null); 
    if (browser) {
      document.cookie = 'session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Strict; HttpOnly';
    }
  },
  
  signup: async (email: string, password: string, name: string): Promise<User> => {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: { email, password: hashedPassword, name }
    });
    
    const { password: _, ...userWithoutPassword } = newUser;
    
    // Create JWT token
    const token = jwt.sign({ userId: userWithoutPassword.id }, JWT_SECRET, { expiresIn: '7d' });
    
    // Set token in cookie (if in browser environment)
    if (browser) {
      document.cookie = `session=${token}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Strict; HttpOnly`;
    }
    
    user.set(userWithoutPassword);
    return userWithoutPassword;
  },
  
  getCurrentUser: async (): Promise<User | null> => {
    if (browser) {
      const token = document.cookie.replace(/(?:(?:^|.*;\s*)session\s*\=\s*([^;]*).*$)|^.*$/, "$1");
      if (token) {
        try {
          const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
          const foundUser = await prisma.user.findUnique({ 
            where: { id: decoded.userId },
            select: { id: true, email: true, name: true }
          });
          if (foundUser) {
            user.set(foundUser);
            return foundUser;
          }
        } catch (error) {
          console.error('Invalid token:', error);
        }
      }
    }
    
    return new Promise<User | null>(resolve => {
      const unsubscribe = user.subscribe(value => {
        resolve(value);
        unsubscribe();
      });
    });
  }
};