import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useConfirm } from "@/hooks/use-confirm";
import $api from "@/http/api";
import { postStore } from "@/store/post.store";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export default function AlertModal() {
  const { post, isOpen, onClose } = useConfirm();
  const { posts, setPosts } = postStore();

  const { mutate } = useMutation({
    mutationKey: ["delete-post"],
    mutationFn: async () => {
      const { data } = await $api.delete(`/post/delete/${post.id}`);
      return data;
    },
    onSuccess: data => {
      setPosts(posts.filter(post => post.id !== data.post.id));
      onClose();
      toast("Post deleted successfully");
    },
    onError: (err: any) => toast(err.response.data.message),
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your post and remove your
            data from our servers.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-4">
          <Button onClick={onClose}>Cancel</Button>
          <Button variant={"destructive"} onClick={() => mutate()}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
