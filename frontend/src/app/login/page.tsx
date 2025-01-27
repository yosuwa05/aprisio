"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { _axios } from "@/lib/axios-instance";
import { useGlobalAuthStore } from "@/stores/GlobalAuthStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { formSchema } from "./schema";

export default function LoginForm({}: React.ComponentPropsWithoutRef<"div">) {
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const router = useRouter();

  const { mutate, isPending } = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      const res = await _axios.post("/auth/login", values);
      return res;
    },
    onSuccess(data) {
      if (data && data.data.status) {
        toast("Logged in successfully");

        const globalState = useGlobalAuthStore.getState();
        globalState.setUser(data.data.user);

        router.push("/feed");
      }
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const res = mutate(values);

    console.log(res);
  }

  return (
    <div className={"flex justify-center items-center h-screen"}>
      <div className="max-w-[450px] min-w-[300px] font-bold">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Login</CardTitle>
            <CardDescription>
              Enter your email below to login to your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <div className="flex flex-col gap-6">
                  <div className="grid gap-2">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field, formState }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input
                              autoComplete="username"
                              placeholder="user@gmail.com"
                              {...field}
                            />
                          </FormControl>
                          {formState.errors.email && "Welcome"}
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid gap-2">
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <div className="relative ">
                              <Input
                                autoComplete="new-password"
                                placeholder="Password"
                                type={showPassword ? "text" : "password"}
                                {...field}
                              />
                              {showPassword ? (
                                <EyeOff
                                  className="absolute cursor-pointer right-3 top-1/2 -translate-y-1/2 text-gray-400"
                                  onClick={() => setShowPassword(!showPassword)}
                                />
                              ) : (
                                <Eye
                                  className="absolute cursor-pointer right-3 top-1/2 -translate-y-1/2 text-gray-400"
                                  onClick={() => setShowPassword(!showPassword)}
                                />
                              )}
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={isPending}>
                    Login
                  </Button>
                </div>
              </form>
              <div className="mt-4 text-center text-sm">
                Don&apos;t have an account?{" "}
                <a href="#" className="underline underline-offset-4">
                  Sign up
                </a>
              </div>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
