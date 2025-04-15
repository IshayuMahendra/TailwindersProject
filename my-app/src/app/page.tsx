"use client";

import React, { useContext, useEffect, useState } from 'react';
import Image from 'next/image';
import '@/app/styles/global_styles.css';
import '@/app/styles/splash.css';
import CustomButton from './components/button';
import Link from 'next/link';
import Modal from './components/modal';
import Typer from './components/typer';
import { useRouter } from 'next/navigation';
import { useIsLoggedIn } from './provider/loggedInProvider';
const bg = "/img/splashBG.jpg";

const SplashPage: React.FC = () => {
    const [showSignupModal, setShowSignupModal] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const { isLoggedIn, setIsLoggedIn } = useIsLoggedIn();
    const router = useRouter();

    return (
                    <div className="splash">
            <div className="splash-left-corner">
                <button className="pol-button pol-button-circle inline-block" onClick={() => {
                    setShowModal((prev) => true);
                }}>?</button>
            </div>
            <div className="splash-content">
                <h1>Pollster</h1>
                <p><Typer typedString="your vote. your polls. your impact." msSpeed={40}></Typer></p>
                <div className="mt-4 block">
                    <button className="pol-button inline-block" onClick={() => setShowLoginModal(true)}>Login</button>
                    <button className="pol-button ml-4 inline-block" onClick={() => setShowSignupModal(true)}>Sign Up</button>
                </div>
            </div>
            {showModal &&
                <Modal onDismiss={() => setShowModal(false)} transitionSeconds={0.3}>
                    <div className="text-center">
                        <h2>about us</h2>
                        <p className="mt-4">"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."</p>
                    </div>
                </Modal>
            }
            {showLoginModal &&
                <Modal onDismiss={() => setShowLoginModal(false)} transitionSeconds={0.3}>
                    <div className="text-center">
                        <h2>Login</h2>
                        <form className="mt-4" onSubmit={async (e) => {e.preventDefault(); setShowLoginModal(false); setIsLoggedIn(true); router.push("/home")}}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium">Username</label>
                                <input type="text" id="login-username" className="mt-1 p-2 w-full border rounded" required/>
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium">Password</label>
                                <input type="password" id="login-password" className="mt-1 p-2 w-full border rounded" required/>
                            </div>
                            <button type="submit" className="pol-button">Submit</button>
                        </form>
                    </div>
                </Modal>
            }
            {showSignupModal &&
                <Modal onDismiss={() => setShowSignupModal(false)} transitionSeconds={0.3}>
                    <div className="text-center">
                        <h2>Sign Up</h2>
                        <form className="mt-4">
                            <div className="mb-4">
                                <label className="block text-sm font-medium">Name</label>
                                <input type="text" id="signup-name" className="mt-1 p-2 w-full border rounded" required/>
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium">Username</label>
                                <input type="text" id="signup-username" className="mt-1 p-2 w-full border rounded" required/>
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium">Password</label>
                                <input type="password" id="signup-password" className="mt-1 p-2 w-full border rounded" required/>
                            </div>
                            <button type="submit" className="pol-button">Submit</button>
                        </form>
                    </div>
                </Modal>
            }
            <Image src={bg} className="splash-img" alt="test" fill />
        </div>
    );
};

export default SplashPage;