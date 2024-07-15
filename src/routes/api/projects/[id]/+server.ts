import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import prisma from '$lib/db/prisma';

export const GET: RequestHandler = async ({ params }) => {
  try {
    const project = await prisma.project.findUnique({
      where: { id: params.id },
      include: {
        tasks: {
          include: {
            subtasks: true
          }
        }
      }
    });
    if (!project) {
      return json({ error: 'Project not found' }, { status: 404 });
    }
    return json(project);
  } catch (error) {
    return json({ error: (error as Error).message }, { status: 500 });
  }
};

export const PUT: RequestHandler = async ({ params, request }) => {
  try {
    const { name, description, startDate, endDate, status } = await request.json();
    const project = await prisma.project.update({
      where: { id: params.id },
      data: {
        name,
        description,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        status
      },
    });
    return json(project);
  } catch (error) {
    return json({ error: (error as Error).message }, { status: 400 });
  }
};

export const DELETE: RequestHandler = async ({ params }) => {
  try {
    await prisma.project.delete({
      where: { id: params.id },
    });
    return new Response(null, { status: 204 });
  } catch (error) {
    return json({ error: (error as Error).message }, { status: 400 });
  }
};