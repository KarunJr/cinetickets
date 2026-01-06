"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { font } from "@/lib/font";

const ErrorPage = () => {
  return (
    <div className={`${font.className} h-screen flex justify-center items-center w-full`}>
      <Card className="max-w-md w-full">
        <CardContent>
          <div className="flex justify-center items-center flex-col bg-destructive/15 p-4 rounded-md text-red-500 space-y-3">
            <div className="flex justify-center items-center gap-x-2">
              <ExclamationTriangleIcon className="w-full text-destructive size-8" />
              <h1 className="font-bold text-2xl">Error</h1>
            </div>
            <p className="text-xl font-semibold">Something went wrong!</p>
          </div>
        </CardContent>

        <CardFooter className="mx-auto">
          <Link href={"/auth/login"}>
            <Button className="font-semibold cursor-pointer" variant={"link"}>
              Back to login
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ErrorPage;
