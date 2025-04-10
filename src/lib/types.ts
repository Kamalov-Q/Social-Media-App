// export type Post = {
//   id?: string;
//   auhtorId?: string;
//   content?: string;
//   image?: string;
//   createdAt?: Date;
//   updatedAt?: Date;
//   // author?: User;
//   // comments?: Comment[];
//   // likes?: Like[];
//   // notifications?: Notification[];
// };

// export type User = {
//   id?: string;
//   email?: string;
//   username?: string;
//   clerkId?: string;
//   name?: string;
//   image?: string;
//   bio?: string;
//   website?: string;
//   location?: string;

//   // posts?: Post[];
//   // followers?: Follow[];
//   // following?: Follow[];
//   // comments?: Comment[];
//   // likes?: Like[];

//   createdAt?: Date;
//   updatedAt?: Date;
// };

// export type Comment = {
//   id?: string;
//   postId?: string;
//   authorId?: string;
//   content?: string;
//   createdAt?: Date;
//   updatedAt?: Date;
//   author: User;
//   post: Post;
//   notification?: Notification[];
// };

// export type Like = {
//   id?: string;
//   postId?: string;
//   userId?: string;
//   user?: User;
//   post?: Post;
//   createdAt?: Date;
//   updatedAt?: Date;
// };

// export type Follow = {
//   followerId?: string;
//   followingId?: string;
//   follower: User;
//   following: User;
//   createdAt?: Date;
//   updatedAt?: Date;
// };

// export type Notification = {
//   id?: string;
//   userId?: string;
//   postId?: string;
//   commentId?: string;
//   creatorId?: string;
//   type?: NotificationType;
//   read?: boolean;
//   user: User;
//   creator: User;
//   post: Post;
//   comment: Comment;
//   createdAt?: Date;
//   updatedAt?: Date;
// };

// export enum NotificationType {
//   LIKE = "LIKE",
//   COMMENT = "COMMENT",
//   FOLLOW = "FOLLOW",
// }
