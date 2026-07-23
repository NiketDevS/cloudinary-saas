import { currentUser } from "@clerk/nextjs/server";
import prisma from "./prisma";

export async function checkAndSyncUser() {
  try {
    const clerkUser = await currentUser();
    if (!clerkUser) {
      return null;
    }

    // Check if user exists in database
    let dbUser = await prisma.user.findUnique({
      where: { clerkId: clerkUser.id },
    });

    if (!dbUser) {
      // Sync user to database
      const email = clerkUser.emailAddresses[0]?.emailAddress;
      if (!email) {
        throw new Error("User has no email address");
      }

      dbUser = await prisma.user.create({
        data: {
          clerkId: clerkUser.id,
          email: email,
          firstName: clerkUser.firstName,
          lastName: clerkUser.lastName,
          imageUrl: clerkUser.imageUrl,
        },
      });
    }

    return dbUser;
  } catch (error) {
    console.error("Error syncing user with database:", error);
    return null;
  }
}
