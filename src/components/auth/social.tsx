"use client";

import { Button } from "../ui/button";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { signIn } from "next-auth/react";

export const SocialButton = () => {
  return (
    <div className="flex justify-center w-full items-center space-x-3">
      <Button
        variant={"outline"}
        className="p-4 w-1/2 cursor-pointer"
        onClick={() => signIn("google",{
          callbackUrl: "/"
        })}
      >
        <FcGoogle />
      </Button>

      <Button
        variant={"outline"}
        className="p-4 w-1/2 cursor-pointer"
        onClick={() => signIn("github", {
          callbackUrl: "/"
        })}
      >
        <FaGithub />
      </Button>
    </div>
  );
};
