"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { UserProvider, useUser } from "../provider/userProvider";
import { useRouter } from "next/navigation";

//Nav bar, removes logout, user name and profile if use is not logged in
const NavBar: React.FC = () => {
    const userProvider = useUser();
    const router = useRouter();

    let doLogout = () => {
        fetch("http://localhost:3000/api/auth/logout", {
            method: 'POST'
          }).then(async (response: Response) => {
            let jsonData = await response.json();
            if(response.status == 200) {
                userProvider.setUser(null);
                userProvider.setIsLoggedIn(false);
                router.push("/");
            }
          })
    };

    return (
        <nav className="w-full h-24 px-8 py-4 bg-[#0E2A2D] text-[#AAC789] flex items-center justify-between shadow-md">
            <div className="text-xl font-mono tracking-wide"><h2>Pollster.</h2></div>

            {userProvider.isLoggedIn &&
                <div className="flex items-center space-x-10">
                    <button className=" bg-[#1E4147] px-8 py-4 border border-[#AAC789] text-[#AAC789] hover:bg-[#1E4147] transition rounded" onClick={doLogout}>
                        <h3>LOGOUT</h3>
                    </button>
                    <h2>{userProvider.user?.displayName}</h2>
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
