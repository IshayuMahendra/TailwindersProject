"use client";

import React, { useEffect, useState } from 'react';
import '@/app/styles/global_styles.css';
import NavBar from '../../components/navbar';
import RightSidebar from '../../components/RightBar';
import LeftSidebar from '../../components/LeftBar';
import PollList from '../../components/pollList';
import ProtectedRoute from '../../helper/protectedRoute';
import { Poll } from '../../components/addPollForm';

//Home page with flex colummns and then scrolls vertically when on mobile
const HomePage: React.FC = () => {
    return (
                        <PollList collectionType='home' />
    );
};

export default HomePage;
