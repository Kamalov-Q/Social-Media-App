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