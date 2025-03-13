import React from 'react';
import '@/app/styles/global_styles.css';
import CustomButton from './components/button';

const LandingPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center">
            <header className="bg-blue-600 w-full py-4">
                <h1 className="text-white text-center text-3xl font-bold">Hello World</h1>
            </header>
            <main className="flex-grow flex flex-col justify-center items-center">
                <CustomButton />
            </main>
            <footer className="bg-gray-800 w-full py-4">
            </footer>
        </div>
    );
};

export default LandingPage;