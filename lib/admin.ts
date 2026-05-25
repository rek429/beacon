import { auth } from "@clerk/nextjs";

const adminIds = [
  // Add your Clerk user ID here
  process.env.NEXT_PUBLIC_ADMIN_USER_ID,
];

export const isAdmin = () => {
  const { userId } = auth();
  if (!userId) return false;
  return adminIds.includes(userId);
};
