import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useConfirm } from "@/hooks/use-confirm";
import { API_URL } from "@/http";
import $api from "@/http/api";
import { IPost } from "@/interfaces";
import { postSchema } from "@/lib/validation";
import AlertModal from "@/modals/alert.modal";
import { authStore } from "@/store/auth.store";
import { postStore } from "@/store/post.store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

export default function PostCard({ post }: { post: IPost }) {
  const { title, body, image, author } = post;
  const { onOpen, setPost } = useConfirm();
  const [open, setOpen] = useState(false);
  const { posts, setPosts } = postStore();
  const { isAuth, user } = authStore();

  const onDelete = () => {
    onOpen();
    setPost(post);
  };

  const form = useForm<z.infer<typeof postSchema>>({
    resolver: zodResolver(postSchema),
    defaultValues: { title, body },
  });

  const { isSubmitting } = form.formState;

  const { mutate } = useMutation({
    mutationKey: ["edit-post"],
    mutationFn: async (values: z.infer<typeof postSchema>) => {
      const { data } = await $api.put(`/post/put/${post.id}`, values);
      return data;
    },
    onSuccess: data => {
      setPosts(posts.map(post => (post.id === data.post.id ? data.post : post)));
      setOpen(false);
      toast("Post edited successfully");
    },
    onError: (err: any) => {
      toast(err.response.data.message);
      form.reset();
    },
  });

  const onSubmit = (values: z.infer<typeof postSchema>) => {
    mutate(values);
  };
  

  return (
    <>
      <Card>
        <img src={`${API_URL}/${image}`} alt={title} className="w-full h-48" />
        <CardContent className="mt-2">
          <CardTitle className="line-clamp-1">{title}</CardTitle>
          <p className="line-clamp-2 mt-1 text-muted-foreground">{body}</p>
        </CardContent>
        {isAuth && author===user.id && (
          <CardFooter className="gap-2">
            <Button className="w-full" size={"sm"} onClick={() => setOpen(true)}>
              Edit
            </Button>
            <Button
              className="w-full"
              variant={"destructive"}
              size={"sm"}
              onClick={() => onDelete()}
            >
              Delete
            </Button>
          </CardFooter>
        )}
      </Card>
      <Sheet open={open} onOpenChange={() => setOpen(false)}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Edit post</SheetTitle>
            <SheetDescription>Describe your post</SheetDescription>
          </SheetHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-8">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input className="bg-secondary" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="body"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Body</FormLabel>
                    <FormControl>
                      <Input className="bg-secondary" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={isSubmitting}>
                Submit
              </Button>
            </form>
          </Form>
        </SheetContent>
      </Sheet>
      <AlertModal />
    </>
  );
}
