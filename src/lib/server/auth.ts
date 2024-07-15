import { prisma } from '$lib/db/prisma';
import type { Handle } from '@sveltejs/kit';
import { parse } from 'cookie';
import jwt from 'jsonwebtoken';

const JWT_SECRET = 'your_jwt_secret';

export const handle: Handle = async ({ event, resolve }) => {
  const cookies = parse(event.request.headers.get('cookie') || '');
  
  if (cookies.session) {
    try {
      const session = jwt.verify(cookies.session, JWT_SECRET);
      const user = await prisma.user.findUnique({ 
        where: { id: session.userId },
        select: { id: true, email: true, name: true }
      });
      if (user) {
        event.locals.user = user;
      }
    } catch (err) {
      // Invalid token
    }
  }

  const response = await resolve(event);
  return response;
};

export const createSession = (userId: string) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
};