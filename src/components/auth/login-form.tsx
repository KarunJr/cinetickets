"use client";
import { LoginSchema } from "@/schema";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { SocialButton } from "@/components/auth/social";
import { Button } from "@/components/ui/button";
import { useState, useTransition } from "react";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "../form-success";
import { login } from "@/actions/login";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";

export const LoginForm = () => {
  const [error, setError] = useState<undefined | string>();
  const [success, setSuccess] = useState<undefined | string>();
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const searchParams = useSearchParams();
  const urlError =
    searchParams.get("error") === "OAuthAccountNotLinked"
      ? "This email is already linked with a different login method."
      : "";

  const loginHandler = (values: z.infer<typeof LoginSchema>) => {
    setError("");
    setSuccess("");
    startTransition(async () => {
      const result = await login(values);

      if (result.success) {
        const response = await signIn("credentials", {
          email: values.email,
          password: values.password,
          redirect: false,
        });

        if (response?.error === "CredentialsSignin") {
          setError("Invalid email or password!");
        } else if (response?.error) {
          setError(response.error);
        } else if (response?.ok) {
          setSuccess("Logged in successfully!");
          router.push("/");
        }
      } else if (result.error) {
        setError(result.error);
      }
    });
  };
  return (
    <div className="w-full space-y-5">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(loginHandler)}>
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email:</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      placeholder="johndoe@gmail.com"
                      required
                    />
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
                  <FormLabel>Password:</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="password"
                      placeholder="******"
                      required
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormError message={error || urlError} />
            <FormSuccess message={success} />
            <Button
              type="submit"
              className="w-full p-4 cursor-pointer"
              disabled={isPending}
            >
              Login
            </Button>
          </div>
        </form>
      </Form>
      <SocialButton />
    </div>
  );
};
