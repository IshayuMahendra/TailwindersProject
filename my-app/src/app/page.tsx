"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import '@/app/styles/global_styles.css';
import '@/app/styles/splash.css';
import CustomButton from './components/button';
import Link from 'next/link';
import Modal from './components/modal';
import Typer from './components/typer';
const bg = "/img/splashBG.jpg";

const SplashPage: React.FC = () => {
    const [showModal, setShowModal] = useState(false);
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
                    <Link className="pol-button inline-block" href="/login">Login</Link>
                    <Link className="pol-button ml-4 inline-block" href="/login">Sign Up</Link>
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
            <Image src={bg} className="splash-img" alt="test" fill />
        </div>
    );
};

export default SplashPage;