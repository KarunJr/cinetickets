import { font } from "@/lib/font";
import {
  LayoutIcon,
  PlusCircledIcon,
  ListBulletIcon,
  ClipboardIcon,
} from "@radix-ui/react-icons";
import { NavLink } from "../navlink";
import { auth } from "@/auth";
import Image from "next/image";
const AdminSidebar = async () => {
  const session = await auth();
  const user = {
    firstname: session?.user.name,
    // lastname: "User",
    profile_img: session?.user.image,
  };

  const adminLinks = [
    {
      name: "Dashboard",
      path: "/admin",
      icon: LayoutIcon,
    },
    {
      name: "Add Shows",
      path: "/admin/add-shows",
      icon: PlusCircledIcon,
    },
    {
      name: "List Shows",
      path: "/admin/list-shows",
      icon: ListBulletIcon,
    },
    {
      name: "List Bookings",
      path: "/admin/list-booking",
      icon: ClipboardIcon,
    },
  ];
  return (
    <div
      className={`${font.className} flex flex-col items-center border-r-4 max-w-13 md:max-w-60 pt-8 w-full border-red-500/30 gap-2 h-[calc(100vh-64px)] mt-12`}
    >
      <div>
        {/* <img
          src={user.profile_img || "A"}
          alt="user"
          className="rounded-full h-9 md:h-14 w-9 md:w-14 mx-auto"
        /> */}

        <Image
          src={user.profile_img || "/avatar.png"}
          alt="user"
          fill
          className="rounded-full object-cover"
          sizes="56px"
          priority
        />
        <p className="font-normal text-base max-md:hidden my-3">
          {user.firstname}
        </p>
      </div>

      <div className="w-full flex flex-col gap-4 md:gap-2 ">
        {adminLinks.map((link, index) => (
          <NavLink
            href={link.path}
            key={index}
            className="flex items-center justify-center md:justify-start gap-3 py-3 px-3"
          >
            <link.icon className="w-6 h-6" />
            <p className="max-md:hidden">{link.name}</p>
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default AdminSidebar;
