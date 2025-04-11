"use server";

import prisma from "@/lib/prisma";
import { getDbUserId } from "./user.action";

export async function getNotifications() {
    try {

        const userId = await getDbUserId();
        if (!userId) throw new Error("Unauthenticated");

        const notifications = await prisma.notification.findMany({
            where: {
                userId
            },
            include: {
                creator: {
                    select: {
                        id: true,
                        name: true,
                        username: true,
                        image: true,
                    }
                },
                post: {
                    select: {
                        id: true,
                        content: true,
                        image: true,
                    }
                },
                comment: {
                    select: {
                        id: true,
                        content: true,
                        createdAt: true,
                    }
                }
            },
            orderBy: {
                createdAt: "desc",
            }
        })
        return notifications;

    } catch (error: any) {
        console.error(error.message);
        throw new Error(error.message);
    }
}

export async function markNotificationAsRead(notificationIds: string[]) {
    try {
        await prisma?.notification?.updateMany({
            where: {
                id: {
                    in: notificationIds,
                },
            },
            data: {
                read: true,
            }
        });

        return { success: true, message: "Notifications marked as read" };

    } catch (error: any) {
        console.error(error.message);
        throw new Error(error.message);
    }
}
