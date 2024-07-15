import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import prisma from '$lib/db/prisma';

export const POST: RequestHandler = async ({ request }) => {
  try {
    const { name, description, startDate, endDate, status, userId } = await request.json();
    const project = await prisma.project.create({
      data: {
        name,
        description,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        status,
        userId
      },
    });
    return json(project, { status: 201 });
  } catch (error) {
    return json({ error: (error as Error).message }, { status: 400 });
  }
};

export const GET: RequestHandler = async ({ url }) => {
  try {
    const userId = url.searchParams.get('userId');
    const projects = await prisma.project.findMany({
      where: userId ? { userId } : undefined,
      include: {
        tasks: {
          include: {
            subtasks: true
          }
        }
      }
    });
    return json(projects);
  } catch (error) {
    return json({ error: (error as Error).message }, { status: 500 });
  }
};