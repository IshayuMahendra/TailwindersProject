"use client";

import React from "react";
/*Just some 3 sample polls like we had */
const PollList: React.FC = () => {
    const polls = [
        "sample poll",
        "sample poll",
        "sample poll"
    ];

    return (
        <div className="h-[600px] w-full max-w-5xl mx-auto p-6 bg-[#17393F] text-[#ffffff] rounded-lg flex flex-col">

            <div className="flex-1 space-y-4 overflow-auto pr-1">
                {polls.map((poll, index) => (
                    <div
                        key={index}
                        className="bg-[#234] py-4 px-6 rounded text-lg font-mono"
                    >
                        {poll}
                    </div>
                ))}
            </div>

                {/*Add poll button for Raj*/}
            <button className="mt-6 bg-[#2e5f4e] hover:bg-[#3d7b64] text-white px-6 py-1 rounded self-end">
                <h2>+</h2>
            </button>
        </div>
    );
};

export default PollList;
