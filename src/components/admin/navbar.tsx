import { font } from "@/lib/font";
import Link from "next/link";

const AdminNavbar = () => {
  return (
    <div className={`${font.className} p-3 border-b-3 border-b-red-500`}>
      <Link href={"/"} className="text-2xl font-bold ">
        Cine<span className="text-3xl font-mono italic text-red-500">T</span>
        ickets
      </Link>
    </div>
  );
};

export default AdminNavbar;
