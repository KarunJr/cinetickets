import { LoginForm } from "@/components/auth/login-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Login - CineTickets",
  description: "Access your CineTickets account to quickly book and manage your movie tickets."
}

const LoginPage = () => {
  return (
    <div className="h-screen flex justify-center items-center w-full">
      <Card className="max-w-md w-full shadow-xl">
        <CardHeader>
          <CardTitle className="text-center font-bold text-2xl">
            CineTickets
          </CardTitle>
          <CardDescription className="text-center">
            Welcome Back
          </CardDescription>
        </CardHeader>

        <CardContent>
          <LoginForm />
        </CardContent>

        <CardFooter>
          <Link href="/auth/signup" className="mx-auto">
            <Button
              className="cursor-pointer"
              variant={"link"}
              size={"sm"}
            >
              Don't you have an acount?
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoginPage;
