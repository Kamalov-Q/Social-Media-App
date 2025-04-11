"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { getDbUserId } from "./user.action";

export async function getProfileByUsername(username: string) {
    try {
        const user = await prisma?.user?.findUnique({
            where: {
                username,
            },
            select: {
                id: true,
                username: true,
                name: true,
                bio: true,
                image: true,
                location: true,
                website: true,
                createdAt: true,
                _count: {
                    select: {
                        followers: true,
                        followings: true,
                        posts: true,
                    }
                }
            }
        });

        return user;

    } catch (error: any) {
        console.error(error?.message);
        throw new Error(error?.message);
    }
}

export async function getUserPosts(userId: string) {
    try {

        const posts = await prisma?.post?.findMany({
            where: {
                authorId: userId,
            },
            include: {
                author: {
                    select: {
                        id: true,
                        username: true,
                        name: true,
                        image: true,
                    }
                },
                comments: {
                    include: {
                        author: {
                            select: {
                                id: true,
                                username: true,
                                name: true,
                                image: true,
                            },
                        },
                    },
                    orderBy: {
                        createdAt: "asc"
                    }
                },
                likes: {
                    select: {
                        userId: true,
                    }
                },
                _count: {
                    select: {
                        likes: true,
                        comments: true,
                    }
                }
            },
            orderBy: {
                createdAt: "desc",
            }

        })

        return posts;

    } catch (error: any) {
        console.error(error?.message);
        throw new Error(error?.message);
    }
}

export async function getUserLikedPosts(userId: string) {
    try {
        const likedPosts = await prisma?.post?.findMany({
            where: {
                likes: {
                    some: {
                        userId
                    }
                }
            },
            include: {
                author: {
                    select: {
                        id: true,
                        username: true,
                        name: true,
                        image: true,
                    }
                },
                comments: {
                    include: {
                        author: {
                            select: {
                                id: true,
                                username: true,
                                name: true,
                                image: true,
                            }
                        }
                    },
                    orderBy: {
                        createdAt: "asc",
                    }
                },
                likes: {
                    select: {
                        userId: true,
                    }
                },
                _count: {
                    select: {
                        likes: true,
                        comments: true,
                    }
                }
            },
            orderBy: {
                createdAt: "desc",
            }
        });

        return likedPosts;

    } catch (error: any) {
        console.error(error?.message);
        throw new Error(error?.message);
    }
}

export async function updateProfile(formData: FormData) {
    try {
        const { userId: clerkId } = await auth();
        if (!clerkId) throw new Error("Unauthorized");

        const name = formData?.get("name") as string;
        const bio = formData?.get("bio") as string;
        const location = formData?.get("location") as string;
        const website = formData?.get("website") as string;

        const user = await prisma?.user?.update({
            where: { clerkId },
            data: {
                name,
                bio,
                location,
                website,
            }
        })

        revalidatePath("/profile");
        return { user, success: true };

    } catch (error: any) {
        console.error(error?.message);
        throw new Error(error?.message);
    }
}

export async function isFollowing(userId: string) {
    try {
        const currentUserId = await getDbUserId();
        if (!currentUserId) return false;

        const follow = await prisma?.follows?.findUnique({
            where: {
                followerId_followingId: {
                    followerId: currentUserId,
                    followingId: userId,
                }
            }
        })

        return !!follow;

    } catch (error: any) {
        console.error(error?.message);
        throw new Error(error?.message);
    }
}