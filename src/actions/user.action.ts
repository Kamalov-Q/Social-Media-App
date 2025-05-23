"use server";
import prisma from "@/lib/prisma";
import { auth, currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function syncUser() {
  try {
    const { userId } = await auth();
    const user = await currentUser();
    if (!userId || !user) return;

    //check if the user exists in the database
    const existingUser = await prisma.user.findUnique({
      where: {
        clerkId: userId,
      },
    });

    if (existingUser) return existingUser;

    const dbUser = await prisma.user.create({
      data: {
        clerkId: userId,
        name: `${user?.firstName || ""} ${user?.lastName || ""}`,
        username:
          user?.username ?? user?.emailAddresses[0]?.emailAddress.split("@")[0],
        email: user?.emailAddresses[0]?.emailAddress,
        image: user?.imageUrl,
      },
    });

    return dbUser;
  } catch (error: any) {
    console.log("Error: ", error);
  }
}

export async function getUserByClerkId(clerkId: string) {
  return await prisma?.user?.findUnique({
    where: {
      clerkId,
    },
    include: {
      _count: {
        select: {
          followers: true,
          followings: true,
          posts: true,
        },
      },
    },
  });
}

export async function getDbUserId() {
  const { userId: clerkId } = await auth();
  if (!clerkId) return null;

  const user = await getUserByClerkId(clerkId);

  if (!user) throw new Error("User not found");

  return user?.id;
}

export async function getRandomUsers() {
  try {
    const userId = await getDbUserId();
    if (!userId) return [];
    const randomUsers = await prisma.user.findMany({
      where: {
        AND: [
          {
            NOT: { id: userId },
          },
          {
            NOT: {
              followers: {
                some: {
                  followerId: userId,
                },
              },
            },
          },
        ],
      },
      select: {
        id: true,
        name: true,
        username: true,
        image: true,
        _count: {
          select: {
            followers: true,
          },
        },
      },
      take: 3,
      orderBy: {
        createdAt: "desc",
      },
    });

    return randomUsers;
  } catch (error: any) {
    console.log("Error: ", error);
    return [];
  }
}

export async function toggleFollow(targetUserId: string) {
  try {
    const userId = await getDbUserId();

    if (!userId) return;
    if (userId === targetUserId) throw new Error("Cannot follow yourself");

    const existingFollow = await prisma.follows.findUnique({
      where: {
        followerId_followingId: {
          followerId: userId,
          followingId: targetUserId,
        },
      },
    });

    if (existingFollow) {
      //unfollow the user
      await prisma.follows.delete({
        where: {
          followerId_followingId: {
            followerId: userId,
            followingId: targetUserId,
          },
        },
      });
    } else {
      //follow the user
      await prisma.$transaction([
        prisma.follows.create({
          data: {
            followerId: userId,
            followingId: targetUserId,
          },
        }),
        prisma.notification.create({
          data: {
            type: "FOLLOW",
            userId: targetUserId, //user being followed
            creatorId: userId, //user who followed
          },
        }),
      ]);
    }
    revalidatePath("/");
    return {
      success: true,
      message: "Followed successfully",
    };
  } catch (error: any) {
    console.log("Error: ", error);
    return {
      success: false,
      error: error.message,
    };
  }
}
