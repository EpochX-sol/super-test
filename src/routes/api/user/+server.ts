import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import  prisma  from "$lib/db/prisma";
import bcrypt from 'bcrypt';

export const POST: RequestHandler = async ({ request }) => {
  try {
    const { email, name, password } = await request.json();
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
      },
    });
    
    return json(user, { status: 201 });
  } catch (error) {
    return json({ error: (error as Error).message }, { status: 400 });
  }
};

export const GET: RequestHandler = async () => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
      },
    });
    return json(users);
  } catch (error) {
    return json({ error: (error as Error).message }, { status: 500 });
  }
};