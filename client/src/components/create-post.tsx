import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "./ui/sheet";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { postSchema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { ChangeEvent, useState } from "react";
import { toast } from "sonner";
import { postStore } from "@/store/post.store";
import { useCreatePost } from "@/hooks/use-create-post";
import $api from "@/http/api";

export default function CreatePost() {
  const { isOpen, onClose } = useCreatePost();
  const [image, setImage] = useState<File | null>(null);
  const { posts, setPosts } = postStore();

  const form = useForm<z.infer<typeof postSchema>>({
    resolver: zodResolver(postSchema),
    defaultValues: { title: "", body: "" },
  });

  const { isSubmitting } = form.formState;

  const onSubmit = (values: z.infer<typeof postSchema>) => {
    if (!image) return null;
    const formData = new FormData();
    const { title, body } = values;
    formData.append("title", title);
    formData.append("body", body);
    formData.append("image", image);
    $api
      .post("/post/post", formData)
      .then(res => {
        setPosts([...posts, res.data.post]);
        console.log(res.data.post);
        onClose();
        form.reset();
        setImage(null);
        toast("Post created successfully");
      })
      .catch((err: any) => {
        toast(err.response.data.message);
        form.reset();
      });
  };

  const onChangeFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    setImage(file as File);
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Create Post</SheetTitle>
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
            <div>
              <Label>Image</Label>
              <Input type="file" className="bg-secondary" onChange={onChangeFile} />
            </div>
            <Button type="submit" disabled={isSubmitting}>
              Submit
            </Button>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
