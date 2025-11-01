import Link from "next/link";
import { Button } from "./ui/button";
import getUser from "@/hooks/getUser";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { font } from "@/lib/font";
import { signOut } from "next-auth/react";
import { FaUser } from "react-icons/fa";
const UserStatus = () => {
  const user = getUser();
  return (
    <div>
      {user ? (
        <div className={`${font.className}`}>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Avatar className="cursor-pointer">
                <AvatarImage
                  src={user?.image || ""}
                  alt="user image"
                  referrerPolicy="no-referrer"
                  className="object-contain"
                />
                <AvatarFallback>
                  <FaUser />
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{user.name}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              { user.role === "admin" && 
                <DropdownMenuItem>
                  <Link href={"/admin"}>
                    Admin
                  </Link>
                </DropdownMenuItem>
              }
              <DropdownMenuItem onClick={() => signOut()}>
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ) : (
        <Link href={"/auth/login"}>
          <Button className="cursor-pointer font-semibold">Login</Button>
        </Link>
      )}
    </div>
  );
};

export default UserStatus;
