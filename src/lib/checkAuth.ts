import { auth } from '@/auth';

export default async function checkAuth() {
  const session = await auth();
  if (!session?.user?.id) {
    return null;
  }
  return session.user.id;
}
