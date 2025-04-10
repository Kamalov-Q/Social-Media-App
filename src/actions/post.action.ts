"use server";

import prisma from "@/lib/prisma";
import { getDbUserId } from "./user.action";
import { revalidatePath } from "next/cache";

export async function createPost(content: string, image: string) {
  try {
    const userId = await getDbUserId();

    if (!userId) throw new Error("Unauthenticated");

    const post = await prisma.post.create({
      data: {
        content,
        image,
        authorId: userId,
      },
    });

    revalidatePath("/");
    return { success: true, data: post, message: "Post created successfully" };
  } catch (error: any) {
    console.error("Error creating post:", error.message);
    return { success: false, data: null, message: error.message };
  }
}

export async function getPosts() {
  try {
    const userId = await getDbUserId();
    if (!userId) throw new Error("Unauthenticated");

    const posts = await prisma.post.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            image: true,
            name: true,
          },
        },
        comments: {
          include: {
            author: {
              select: {
                id: true,
                username: true,
                image: true,
                name: true,
              },
            },
          },
          orderBy: {
            createdAt: "asc",
          },
        },
        likes: {
          select: {
            userId: true,
          },
        },
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },
      where: {
        authorId: userId,
      },
    });

    return {
      success: true,
      posts: posts ?? [],
      message: "Posts fetched successfully",
    };
  } catch (error: any) {
    console.error("Error fetching posts:", error.message);
    return { success: false, posts: [], message: error.message };
  }
}

export async function toggleLike(postId: string) {
  try {
    const userId = await getDbUserId();
    if (!userId) throw new Error("Unauthenticated");

    //check if like exists
    const existingLike = await prisma?.like?.findUnique({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });

    const post = await prisma.post.findUnique({
      where: {
        id: postId,
      },
      select: {
        authorId: true,
      },
    });

    if (!post) throw new Error("Post not found");

    if (existingLike) {
      //unlike
      await prisma.like.delete({
        where: {
          userId_postId: {
            userId,
            postId,
          },
        },
      });
    } else {
      //like and create notification (only if liking someone else's post)
      await prisma.$transaction([
        prisma?.like?.create({
          data: {
            userId,
            postId,
          },
        }),
        ...(post?.authorId !== userId
          ? [
              prisma?.notification?.create({
                data: {
                  type: "LIKE",
                  userId: post?.authorId, //user being followed
                  creatorId: userId, //user who followed
                  postId,
                },
              }),
            ]
          : []),
      ]);
    }

    revalidatePath("/");
    return {
      success: true,
      message: "Somebody liked this post",
    };
  } catch (error: any) {
    console.error("Error liking post:", error.message);
    return { success: false, message: error.message };
  }
}

export async function createComment() {}
