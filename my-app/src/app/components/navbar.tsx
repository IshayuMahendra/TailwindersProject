"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useUser } from "../provider/userProvider";
import { useRouter } from "next/navigation";

const NavBar: React.FC = () => {
    const userProvider = useUser();
    const router = useRouter();
    return (
        <nav className="w-full h-24 px-8 py-4 bg-[#0E2A2D] text-[#AAC789] flex items-center justify-between shadow-md">
            <div className="text-xl font-mono tracking-wide"><h2>Pollster.</h2></div>

            {userProvider.isLoggedIn &&
                <div className="flex items-center space-x-10">
                    <button className=" bg-[#1E4147] px-8 py-4 border border-[#AAC789] text-[#AAC789] hover:bg-[#1E4147] transition rounded" onClick={() => {
                        userProvider.setIsLoggedIn(false);
                        router.push("/");
                    }}>
                        <h3>LOGOUT</h3>
                    </button>
                    <div className="w-15 h-15 rounded-full overflow-hidden border-2 border-[#AAC789]">
                        <Image
                            src="/img/avatar.webp"
                            alt="User Avatar"
                            width={90}
                            height={50}
                            className="object-cover"
                        />
                    </div>
                </div>
            }
        </nav>
    );
};

export default NavBar;
