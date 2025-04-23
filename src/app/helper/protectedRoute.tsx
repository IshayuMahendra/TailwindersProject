"use client";

import React, { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '../provider/userProvider';

interface ProtectedRouteProps {
    children: ReactNode;
};

//ProtectedRoute: a way to verify that a user is authenticated client-side
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }: ProtectedRouteProps) => {
    const router = useRouter();
    const {isLoggedIn} = useUser();
    useEffect(() => {
        if(!isLoggedIn) {
            router.push("/home?login=true");
        }
    }, [isLoggedIn]);


    return (
        <>
{isLoggedIn && 
<>{children}</>
}
        </>
    );
};

export default ProtectedRoute;