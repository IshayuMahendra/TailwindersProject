"use client";

import React, { useEffect, useState } from 'react';
import '@/app/styles/global_styles.css';
import NavBar from '../components/navbar';
import RightSidebar from '../components/RightBar';
import LeftSidebar from '../components/LeftBar';
import PollList from '../components/pollList';
import ProtectedRoute from '../helper/protectedRoute';
import { Poll } from '../components/addPollForm';

//Home page with flex colummns and then scrolls vertically when on mobile
const HomePage: React.FC = () => {
    return (
            <div className="pol-home h-full flex flex-col">
                <NavBar />
                {/* flex-1 allows rest of space to be filled */}
                <div className="flex-1 flex flex-col lg:flex-row w-full">
                    {/* Left Sidebar */}
                    <div className="w-full lg:w-1/4 xl:w-1/5">
                        <LeftSidebar />
                    </div>

                    {/* Main Content */}
                    <main className="flex-1">
                        <PollList collectionType='home' />
                    </main>

                    {/* Right Sidebar */}
                    <div className="w-full lg:w-1/4 xl:w-1/5">
                        <RightSidebar />
                    </div>
                </div>
            </div>
    );
};

export default HomePage;
