import { authSchema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useMutation } from "@tanstack/react-query";
import $axios from "@/http";
import { authStore } from "@/store/auth.store";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import { usePassState } from "@/hooks/use-pass-state";

export default function Register() {
  const { setAuth } = useAuth();
  const { setIsAuth, setUser } = authStore();
  const { passState, setPassState } = usePassState();
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof authSchema>>({
    resolver: zodResolver(authSchema),
    defaultValues: { email: "", password: "" },
  });

  const { mutate } = useMutation({
    mutationKey: ["register"],
    mutationFn: async (values: z.infer<typeof authSchema>) => {
      const { data } = await $axios.post("/auth/register", values);
      return data;
    },
    onSuccess: data => {
      setIsAuth(true);
      setUser(data.user);
      localStorage.setItem("accessToken", data.accessToken);
      navigate("/");
      toast("User signed up successfully");
    },
    onError: (err: any) => {
      toast(err.response.data.message);
    },
  });

  const { isSubmitting } = form.formState;

  const onSubmit = (values: z.infer<typeof authSchema>) => {
    mutate(values);
  };

  return (
    <>
      <h1 className="text-2xl font-bold">Register</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2 mt-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="otabektulaganov@gmail.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type={passState === "hide" ? "password" : "text"}
                    placeholder={passState === "hide" ? "********" : "otabek04"}
                    {...field}
                  />
                </FormControl>
                <div className="flex items-center gap-1">
                  <Checkbox
                    id="pass-state"
                    value={passState}
                    checked={passState === "hide" ? false : true}
                    onClick={() => setPassState(passState === "hide" ? "show" : "hide")}
                  />
                  <Label htmlFor="pass-state">{passState === "hide" ? "Show" : "Hide"} password</Label>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <p className="text-sm text-muted-foreground">
            Have an account?{" "}
            <span
              className="cursor-pointer text-blue-500 hover:underline"
              onClick={() => setAuth("login")}
            >
              Sign in
            </span>
          </p>
          <Button type="submit" disabled={isSubmitting}>
            Submit
          </Button>
        </form>
      </Form>
    </>
  );
}
