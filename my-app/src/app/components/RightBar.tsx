"use client";

import React from "react";
import Image from "next/image";

//Right side bar displaying the account options
const RightSidebar: React.FC = () => {
    /*Just added the basic image I saw online since I couldn't get the figma ones */
    const contributors = [
        { name: "John Doe", points: 15, image: "/img/avatar.webp" },
        { name: "John Doe", points: 10, image: "/img/avatar.webp"  },
        { name: "John Doe", points: 10, image: "/img/avatar.webp"  },
        { name: "John Doe", points: 10, image: "/img/avatar.webp"  },
    ];

    return (
        <aside className="pol-sidebar h-full w-full py-4 px-8 border-[#667753] border-l-0 lg:border-l-1">
            <div className="text-md font-semibold mb-6 mt-2">Top Contributors</div>
            <ul className="space-y-5">
                {/*Mapping the array to a list -Ishayu */}
                {contributors.map((contributor, index) => (
                    <li key={index} className="flex items-center space-x-4">
                        <img
                            src={contributor.image}
                            alt={contributor.name}
                            className="w-12 h-12 rounded-full object-cover border border-[#AAC789]"
                        />
                        <div className="flex flex-col">
                            <span className="font-medium">{contributor.name}</span>
                            <span className="text-sm text-[#88a27b]">{contributor.points} points</span>
                        </div>
                    </li>
                ))}
            </ul>
        </aside>
    );
};

export default RightSidebar;
