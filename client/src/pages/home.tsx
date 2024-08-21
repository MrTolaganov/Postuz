import CardSkeleton from "@/cards/card-skeleton";
import PostCard from "@/cards/post-card";
import $axios from "@/http";
import { IPost } from "@/interfaces";
import PendingModal from "@/modals/pending.modal";
import { authStore } from "@/store/auth.store";
import { postStore } from "@/store/post.store";
import { useQuery } from "@tanstack/react-query";

export default function Home() {
  const { posts, setPosts } = postStore();
  const { user, isAuth } = authStore();

  const { isLoading } = useQuery({
    queryKey: ["get-posts"],
    queryFn: async () => {
      const { data } = await $axios.get("/post/get");
      setPosts(data.posts);
      return data;
    },
  });

  return (
    <>
      {isAuth && !user.isActivated ? (
        <div className="w-full h-screen flex justify-center items-center">
          <PendingModal />
        </div>
      ) : (
        <div className="container mx-auto mt-24 md:mt-28">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {isLoading
              ? Array.from({ length: 12 }).map((_, idx) => <CardSkeleton key={idx} />)
              : posts
                  .slice()
                  .reverse()
                  .map((post: IPost) => <PostCard key={post.id} post={post} />)}
          </div>
        </div>
      )}
    </>
  );
}
