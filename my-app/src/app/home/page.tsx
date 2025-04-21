"use client";

import React from 'react';
import '@/app/styles/global_styles.css';
import '@/app/styles/home.css';
import NavBar from '../components/navbar';
import RightSidebar from '../components/RightBar';
import LeftSidebar from '../components/LeftBar';
import PollList from '../components/pollList';
import ProtectedRoute from '../helper/protectedRoute';

const HomePage: React.FC = () => {
    return (
        <ProtectedRoute>
            <div className="home min-h-screen flex flex-col">
                <NavBar />
                <div className="flex flex-col lg:flex-row w-full">
                    {/* Left Sidebar */}
                    <div className="w-full lg:w-1/5 p-4">
                        <LeftSidebar />
                    </div>

                    {/* Main Content */}
                    <main className="w-full lg:w-3/5 p-4">
                        <PollList />
                    </main>

                    {/* Right Sidebar */}
                    <div className="w-full lg:w-1/5 p-4">
                        <RightSidebar />
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
};

export default HomePage;
