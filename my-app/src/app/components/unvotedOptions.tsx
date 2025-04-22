"use client";

import React from "react";
import {PollOption } from "./addPollForm";

interface UnvotedOptionsProps {
  options: PollOption[];
  onVote: (optionIndex: number) => void;
}

//Main feed page that displaus all the polls
const UnvotedOptions: React.FC<UnvotedOptionsProps> = ({ options, onVote }: UnvotedOptionsProps) => {
  return (
    <>
          {options.map((option, index) => (
            <li key={index} className="inline-block flex-1"><button className="pol-button w-full h-full" onClick={() => onVote(index)}>{option.text}</button></li>
            ))}
    </>
  );
};

export default UnvotedOptions;
