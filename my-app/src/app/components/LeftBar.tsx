"use client"
import Link from "next/link";

//Left side bar displaying all the contributors
const LeftSidebar: React.FC = () => {
    /*Temporary slots just to fill the left side - Ishayu */
    const navItems = [
        { label: 'Home', path: '/home' },
        { label: 'Saved Polls', path: '/saved' },
        { label: 'Profile', path: '/profile' },
        { label: 'Settings', path: '/settings' },
    ];

    return (
        <aside className="w-64 min-h-screen p-6 bg-[#17393F] text-[#AAC789]">
            <div className="mt-10 text-lg font-semibold text-center mb-6">Account</div>
            <ul className="space-y-4">
                {/*Mapping the array to a list -Ishayu */}
                {navItems.map((item, index) => (
                    <li  key={index}>
                        <Link
                            href={item.path}
                            className="block px-18 py-2 rounded-md transition-colors duration-200 hover:bg-[#225055] hover:text-white"
                        >
                            {item.label}
                        </Link>
                    </li>
                ))}
            </ul>
        </aside>
    );
};

export default LeftSidebar;
