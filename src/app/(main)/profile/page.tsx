"use client";

import React from 'react';
import '@/app/styles/global_styles.css';
import NavBar from '../../components/navbar';
import RightSidebar from '../../components/RightBar';
import LeftSidebar from '../../components/LeftBar';
import PollList from '../../components/pollList';
import ProtectedRoute from '../../helper/protectedRoute';

//Home page with flex colummns and then scrolls vertically when on mobile
const ProfilePage: React.FC = () => {
    return (
        <ProtectedRoute>
            <PollList collectionType='profile' />
        </ProtectedRoute>
    );
};

export default ProfilePage;
