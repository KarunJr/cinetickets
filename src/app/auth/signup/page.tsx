import { SignupForm } from "@/components/auth/signup-form";
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
  title: "Signup - Create Your CineTickets Account",
  description: "Join CineTickets today and book your favorite movie tickets instantly."
}
const SignupPage = () => {
  return (
    <div className="h-screen flex justify-center items-center w-full">
      <Card className="max-w-md w-full shadow-xl">
        <CardHeader>
          <CardTitle className="text-center font-bold text-2xl">
            CineTickets
          </CardTitle>
          <CardDescription className="text-center">
            Create an account
          </CardDescription>
        </CardHeader>

        <CardContent>
          <SignupForm />
        </CardContent>

        <CardFooter>
          <Link href="/auth/login" className="mx-auto">
            <Button
              className="cursor-pointer"
              variant={"link"}
              size={"sm"}
            >
              Already have an account?
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SignupPage;
