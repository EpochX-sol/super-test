import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import prisma  from '$lib/db/prisma';
import bcrypt from 'bcrypt';

export const GET: RequestHandler = async ({ params }) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
      },
    });
    
    if (!user) {
      return json({ error: 'User not found' }, { status: 404 });
    }
    
    return json(user);
  } catch (error) {
    return json({ error: (error as Error).message }, { status: 500 });
  }
};

export const PUT: RequestHandler = async ({ params, request }) => {
  try {
    const { email, name, password } = await request.json();
    
    let updateData: any = { email, name };
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateData.password = hashedPassword;
    }
    
    const user = await prisma.user.update({
      where: { id: params.id },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
      },
    });
    
    return json(user);
  } catch (error) {
    return json({ error: (error as Error).message }, { status: 400 });
  }
};

export const DELETE: RequestHandler = async ({ params }) => {
  try {
    await prisma.user.delete({
      where: { id: params.id },
    });
    return new Response(null, { status: 204 });
  } catch (error) {
    return json({ error: (error as Error).message }, { status: 400 });
  }
};