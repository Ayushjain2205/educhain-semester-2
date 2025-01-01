import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { ConnectButton } from "thirdweb/react";
import { client } from "@/lib/client";
import { bscTestnet } from "thirdweb/chains";

const Navbar = () => {
  const router = useRouter();

  return (
    <nav className="bg-[#10002B] text-[#E0AAFF] p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex-1">
          <Link
            href="/"
            className="flex items-center gap-2 font-permanent-marker text-2xl text-[#3BF4FB]"
          >
            <img src="/sage.svg" alt="SageSpace" className="w-10 h-10" />
            SageSpace
          </Link>
        </div>

        <div className="flex-1 flex justify-center space-x-8">
          <Link
            href="/"
            className={`font-space-grotesk text-lg ${
              router.pathname === "/"
                ? "text-[#3BF4FB] border-b-2 border-[#3BF4FB]"
                : "text-[#E0AAFF] hover:text-[#C77DFF]"
            }`}
          >
            Explore
          </Link>
          <Link
            href="/create"
            className={`font-space-grotesk text-lg ${
              router.pathname === "/create"
                ? "text-[#3BF4FB] border-b-2 border-[#3BF4FB]"
                : "text-[#E0AAFF] hover:text-[#C77DFF]"
            }`}
          >
            Create
          </Link>
        </div>

        <div className="flex-1 flex justify-end">
          <ConnectButton client={client} chain={bscTestnet} theme={"light"} />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
