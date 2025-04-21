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
        <aside className="w-64 min-h-screen p-6 bg-[#17393F] text-[#AAC789]">
            <div className="mt-10 text-lg font-semibold text-center mb-6">Top Contributors</div>
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
