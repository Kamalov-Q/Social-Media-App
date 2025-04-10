import { getPosts } from "@/actions/post.action";
import { getDbUserId } from "@/actions/user.action";
import CreatePost from "@/components/create-post";
import PostCard from "@/components/post-card";
import { RecommendedUsers } from "@/components/recommended-users";
import { currentUser } from "@clerk/nextjs/server";

export default async function Home() {
  const user = await currentUser();
  const { posts } = await getPosts();
  const dbUserId = await getDbUserId();
  console.log("posts", posts);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
      <div className="lg:col-span-6">
        {user ? <CreatePost /> : null}
        <div className="space-y-6">
          {posts?.length === 0 ? (
            <div className="text-center text-muted-foreground">
              No posts yet
            </div>
          ) : (
            posts?.map((post) => (
              <PostCard dbUserId={dbUserId} post={post} key={post?.id} />
            ))
          )}
        </div>
      </div>

      <div className="hidden lg:block lg:col-span-4 sticky top-20">
        <RecommendedUsers />
      </div>
    </div>
  );
}
