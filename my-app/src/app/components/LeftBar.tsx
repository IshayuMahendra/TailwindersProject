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
        <aside className="pol-sidebar h-full w-full py-4 px-8 border-[#667753] border-r-0 lg:border-r-1">
            <ul className="space-y-3 mt-2">
                {/*Mapping the array to a list -Ishayu */}
                {navItems.map((item, index) => (
                    <li  key={index}>
                        <Link
                            href={item.path}
                            className="block py-2 px-3 rounded-md transition-colors duration-200 hover:bg-[#0E2A2D] hover:text-white"
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
