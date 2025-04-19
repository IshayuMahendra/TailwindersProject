"use client";

import React, { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useIsLoggedIn } from '../provider/loggedInProvider';

interface ProtectedRouteProps {
    children: ReactNode;
};

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }: ProtectedRouteProps) => {
    const router = useRouter();
    const {isLoggedIn} = useIsLoggedIn();
    useEffect(() => {
        if(!isLoggedIn) {
            router.push("/");
        }
    }, []);


    return (
        <>
{isLoggedIn && 
<>{children}</>
}
        </>
    );
};

export default ProtectedRoute;