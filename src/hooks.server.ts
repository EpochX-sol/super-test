import { handle } from '$lib/server/auth';
import { env } from '$env/dynamic/private';

const JWT_SECRET = env.JWT_SECRET;

export {JWT_SECRET,handle}
