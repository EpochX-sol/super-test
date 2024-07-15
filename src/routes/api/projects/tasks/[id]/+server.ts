import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import prisma from '$lib/db/prisma';

export const GET: RequestHandler = async ({ params }) => {
  try {
    const task = await prisma.task.findUnique({
      where: { id: params.id },
      include: { subtasks: true }
    });
    if (!task) {
      return json({ error: 'Task not found' }, { status: 404 });
    }
    return json(task);
  } catch (error) {
    return json({ error: (error as Error).message }, { status: 500 });
  }
};

export const PUT: RequestHandler = async ({ params, request }) => {
  try {
    const { title, description, status, priority, startDate, dueDate } = await request.json();
    const task = await prisma.task.update({
      where: { id: params.id },
      data: {
        title,
        description,
        status,
        priority,
        startDate: startDate ? new Date(startDate) : null,
        dueDate: dueDate ? new Date(dueDate) : null,
      },
    });
    return json(task);
  } catch (error) {
    return json({ error: (error as Error).message }, { status: 400 });
  }
};

export const DELETE: RequestHandler = async ({ params }) => {
  try {
    await prisma.task.delete({
      where: { id: params.id },
    });
    return new Response(null, { status: 204 });
  } catch (error) {
    return json({ error: (error as Error).message }, { status: 400 });
  }
};