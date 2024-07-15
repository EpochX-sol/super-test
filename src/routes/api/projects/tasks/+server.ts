import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import prisma from '$lib/db/prisma';

export const POST: RequestHandler = async ({ params, request }) => {
  try {
    const { title, description, status, priority, startDate, dueDate } = await request.json();
    const task = await prisma.task.create({
      data: {
        title,
        description,
        status,
        priority,
        startDate: startDate ? new Date(startDate) : null,
        dueDate: dueDate ? new Date(dueDate) : null,
        projectId: params.id
      },
    });
    return json(task, { status: 201 });
  } catch (error) {
    return json({ error: (error as Error).message }, { status: 400 });
  }
};

export const GET: RequestHandler = async ({ params }) => {
  try {
    const tasks = await prisma.task.findMany({
      where: { projectId: params.id },
      include: { subtasks: true }
    });
    return json(tasks);
  } catch (error) {
    return json({ error: (error as Error).message }, { status: 500 });
  }
};