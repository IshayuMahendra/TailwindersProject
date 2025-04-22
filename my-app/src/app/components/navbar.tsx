"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { UserProvider, useUser } from "../provider/userProvider";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons";

//Nav bar, removes logout, user name and profile if use is not logged in
const NavBar: React.FC = () => {
    const userProvider = useUser();
    const router = useRouter();

    let doLogout = () => {
        fetch("http://localhost:3000/api/auth/logout", {
            method: 'POST'
        }).then(async (response: Response) => {
            let jsonData = await response.json();
            if (response.status == 200) {
                userProvider.setUser(null);
                userProvider.setIsLoggedIn(false);
                router.push("/");
            }
        })
    };

    return (
        <nav className="h-20 px-8 py-4 bg-[#0E2A2D] text-[#AAC789] flex border-solid border-[#667753] border-b-1">
            <div className="w-1/2 text-lg sm:text-4xl font-mono mt-auto mb-auto">Pollster.</div>

            {userProvider.isLoggedIn &&
                <div className="w-1/2 flex">
                    <div className="ml-auto space-x-3 md:space-x-6 flex items-center">
                        <span className="hidden md:inline-block">Hello, {userProvider.user?.displayName}</span>
                        <img className="inline-block rounded-full border-3 h-full" src="img/avatar.webp"></img>
                        <button className="pol-icon-button" onClick={doLogout}>
                            <FontAwesomeIcon icon={faRightFromBracket}></FontAwesomeIcon>
                        </button>
                    </div>
                </div>
            }
        </nav>
    );
};

export default NavBar;
