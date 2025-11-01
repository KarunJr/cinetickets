"use client";
import { SignupSchema } from "@/schema";

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
import { register } from "@/actions/register";
import { FormError } from "../form-error";
import { FormSuccess } from "../form-success";

export const SignupForm = () => {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");

  const [isPending, startTransition] = useTransition();
  const form = useForm<z.infer<typeof SignupSchema>>({
    resolver: zodResolver(SignupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const registerHandler = (values: z.infer<typeof SignupSchema>) => {
    startTransition(async () => {
      setError("");
      setSuccess("");
      const result = await register(values);

      if (result?.success) {
        setSuccess(result.success);
        form.reset();
      }

      if (result?.error) {
        setError(result.error);
      }
    });
  };
  return (
    <div className="w-full space-y-5">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(registerHandler)}>
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name:</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="text"
                      placeholder="John Doe"
                      required
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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

            <FormError message={error} />
            <FormSuccess message={success} />

            <Button
              type="submit"
              className="w-full p-4 cursor-pointer"
              disabled={isPending}
            >
              Signup
            </Button>
          </div>
        </form>
      </Form>
      <SocialButton />
    </div>
  );
};
