import { emailSchema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useMutation } from "@tanstack/react-query";
import $axios from "@/http";
import { toast } from "sonner";
import { useState } from "react";

export default function ForgotPass() {
  const { setAuth } = useAuth();
  const [isSended, setIsSended] = useState(false);

  const form = useForm<z.infer<typeof emailSchema>>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: "" },
  });

  const { mutate } = useMutation({
    mutationKey: ["forgot-pass"],
    mutationFn: async (values: z.infer<typeof emailSchema>) => {
      const { data } = await $axios.post("/auth/forgot-pass", values);
      return data;
    },
    onSuccess: () => {
      setIsSended(true);
      toast("Link is sent to this email successfully");
    },
    onError: (err: any) => {
      toast(err.response.data.message);
    },
  });

  const { isSubmitting } = form.formState;

  const onSubmit = (values: z.infer<typeof emailSchema>) => {
    mutate(values);
  };

  return (
    <>
      <h1 className="text-2xl font-bold">Forgot password</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2 mt-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="otabektulaganov@gmail.com"
                    {...field}
                    disabled={isSended}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <p className="text-sm text-muted-foreground">
            Don't have an account?{" "}
            <span
              className="cursor-pointer text-blue-500 hover:underline"
              onClick={() => setAuth("register")}
            >
              Sign up
            </span>
          </p>
          <p className="text-sm text-muted-foreground">
            Have an account?{" "}
            <span
              className="cursor-pointer text-blue-500 hover:underline"
              onClick={() => setAuth("login")}
            >
              Sign in
            </span>
          </p>
          <Button type="submit" disabled={isSubmitting || isSended}>
            Submit
          </Button>
        </form>
      </Form>
    </>
  );
}
