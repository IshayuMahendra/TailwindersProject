"use client";

import React from "react";
import {PollOption } from "./addPollForm";

interface VotedOptionsProps {
  options: PollOption[];
}

//Main feed page that displaus all the polls
const VotedOptions: React.FC<VotedOptionsProps> = ({ options }: VotedOptionsProps) => {
  return (
    <>
          {options.map((option, index) => (
            <li key={index} className="inline-block flex-1"><div className="pol-button w-full h-full text-left">{option.text}</div></li>
            ))}
    </>
  );
};

export default VotedOptions;
