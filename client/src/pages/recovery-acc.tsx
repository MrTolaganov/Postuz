import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { usePassState } from "@/hooks/use-pass-state";
import $axios from "@/http";
import { passwordSchema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";

export default function RecoveryAcc() {
  const { passState, setPassState } = usePassState();
  const { accessToken } = useParams();
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  const { mutate } = useMutation({
    mutationKey: ["recovery-acc"],
    mutationFn: async (values: z.infer<typeof passwordSchema>) => {
      const { data } = await $axios.put("/auth/recovery-acc", {
        password: values.password,
        token: accessToken,
      });
      return data;
    },
    onSuccess: () => {
      navigate("/auth");
      toast("Account recovered successfully");
    },
    onError: (err: any) => {
      toast(err.response.data.message);
    },
  });

  const { isSubmitting } = form.formState;

  const onSubmit = (values: z.infer<typeof passwordSchema>) => {
    mutate(values);
  };

  return (
    <div className="w-full h-screen flex justify-center items-center">
      <Card className="w-1/3 p-3 bg-gray-900 relative">
        <CardContent>
          <h1 className="text-2xl font-bold">Recovery Account</h1>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2 mt-4">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New password</FormLabel>
                    <FormControl>
                      <Input
                        type={passState === "hide" ? "password" : "text"}
                        placeholder={passState === "hide" ? "********" : "otabek04"}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm password</FormLabel>
                    <FormControl>
                      <Input
                        type={passState === "hide" ? "password" : "text"}
                        placeholder={passState === "hide" ? "********" : "otabek04"}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex items-center gap-1">
                <Checkbox
                  id="pass-state"
                  checked={passState === "hide" ? false : true}
                  value={passState}
                  onClick={() => setPassState(passState === "hide" ? "show" : "hide")}
                />
                <Label htmlFor="pass-state">
                  {passState === "hide" ? "Show" : "Hide"} passwords
                </Label>
              </div>
              <Button type="submit" disabled={isSubmitting}>
                Submit
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
