"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { UserProvider, useUser } from "../provider/userProvider";
import { useRouter, useSearchParams } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import Modal from "./modal";
import LoginForm from "./loginForm";
import SignupForm from "./signupForm";
import { usePathname } from 'next/navigation';

//Nav bar, removes logout, user name and profile if use is not logged in
const NavBar: React.FC = () => {
    const userProvider = useUser();
    const searchParams = useSearchParams()
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if(searchParams.get('login') == 'true') {
            setShowLoginModal(true);
        }
    }, [searchParams])

        const [showSignupModal, setShowSignupModal] = useState(false);
        const [showLoginModal, setShowLoginModal] = useState(false);

    let doLogout = () => {
        fetch("http://localhost:3000/api/auth/logout", {
            method: 'POST'
        }).then(async (response: Response) => {
            let jsonData = await response.json();
            if (response.status == 200) {
                router.push("/home");
                userProvider.setUser(null);
                userProvider.setIsLoggedIn(false);
            }
        })
    };

    return (
        <nav className="h-20 px-8 py-4 bg-[#0E2A2D] text-[#AAC789] flex border-solid border-[#667753] border-b-1">
            <div className="w-1/2 text-lg sm:text-4xl font-mono mt-auto mb-auto"> <Link href="/home" className="cursor-pointer hover:underline">Pollster.</Link></div>

                <div className="w-1/2 flex">
                    <div className="ml-auto space-x-3 md:space-x-6 flex items-center">
                    {userProvider.isLoggedIn ?
                    <>
                        <span className="hidden md:inline-block">Hello, {userProvider.user?.displayName}</span>
                        <img className="inline-block rounded-full border-3 h-full" src="img/avatar.webp"></img>
                        <button className="pol-iconbtn" onClick={doLogout}>
                            <FontAwesomeIcon icon={faRightFromBracket}></FontAwesomeIcon>
                        </button>
                    </>
                    :
                    <>
                    <button className="pol-button" onClick={() => setShowLoginModal(true)}>Login</button>
                    <button className="pol-button" onClick={() => setShowSignupModal(true)}>Sign Up</button>
                    </>
                    }
                    {showLoginModal &&
                <Modal onDismiss={() => {
                    setShowLoginModal(false);
                    router.push(pathname);
                    }} transitionSeconds={0.3}>
                    <LoginForm onLogin={() => setShowLoginModal(false)} initialError={searchParams.get('error')}></LoginForm>
                </Modal>
            }
            {showSignupModal &&
                <Modal onDismiss={() => setShowSignupModal(false)} transitionSeconds={0.3}>
                    <SignupForm onNewUser={() => {
                        setShowSignupModal(false);
                        setShowLoginModal(true);
                    }}/>
                </Modal>
}
                    </div>
                </div>
        </nav>
    );
};

export default NavBar;
