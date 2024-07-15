import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import prisma from '$lib/db/prisma';

export const GET: RequestHandler = async ({ params }) => {
  try {
    const subtask = await prisma.subtask.findUnique({
      where: { id: params.subtaskId }
    });
    if (!subtask) {
      return json({ error: 'Subtask not found' }, { status: 404 });
    }
    return json(subtask);
  } catch (error) {
    return json({ error: (error as Error).message }, { status: 500 });
  }
};

export const PUT: RequestHandler = async ({ params, request }) => {
  try {
    const { title, description, status } = await request.json();
    const subtask = await prisma.subtask.update({
      where: { id: params.subtaskId },
      data: {
        title,
        description,
        status
      },
    });
    return json(subtask);
  } catch (error) {
    return json({ error: (error as Error).message }, { status: 400 });
  }
};

export const DELETE: RequestHandler = async ({ params }) => {
  try {
    await prisma.subtask.delete({
      where: { id: params.subtaskId },
    });
    return new Response(null, { status: 204 });
  } catch (error) {
    return json({ error: (error as Error).message }, { status: 400 });
  }
};