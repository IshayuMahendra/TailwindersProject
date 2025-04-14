"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import '@/app/styles/global_styles.css';
import '@/app/styles/home.css';
import CustomButton from '../components/button';
import Link from 'next/link';
import Modal from '../components/modal';
import Typer from '../components/typer';
import NavBar from '../components/navbar';
import RightSidebar from '../components/RightBar';
import LeftSidebar from '../components/LeftBar';
import PollList from '../components/pollList';
const bg = "/img/splashBG.jpg";

const HomePage: React.FC = () => {
    return (
        <div className = "home min-h screen flex flex-col">
            <NavBar />
            <div className = "flex">
                <LeftSidebar/>
            <main className = "flex-1 p-6">
            <PollList/>
            </main>
            <RightSidebar />
           </div>
        </div>
    );

}


export default HomePage;