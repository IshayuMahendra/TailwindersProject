"use client";

import React from "react";
import {PollOption } from "./addPollForm";

interface UnvotedOptionsProps {
  options: string[];
  onVote: (optionIndex: number) => void;
}

//Main feed page that displaus all the polls
const UnvotedOptions: React.FC<UnvotedOptionsProps> = ({ options, onVote }: UnvotedOptionsProps) => {
  return (
    <>
          {options.map((option, index) => (
            <li key={index} className="inline-block flex-1"><button className="pol-button w-full h-full text-left" onClick={() => onVote(index)}>{option}</button></li>
            ))}
    </>
  );
};

export default UnvotedOptions;
