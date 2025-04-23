"use client";

import React from "react";
import {PollOption } from "./addPollForm";

interface VotedOptionsProps {
  options: PollOption[];
}

//Main feed page that displaus all the polls
const VotedOptions: React.FC<VotedOptionsProps> = ({ options }: VotedOptionsProps) => {
  let totalVotes = 0;
  for(let option of options) {
    totalVotes += option.votes
  }

  const getVotesPercentage = (option: PollOption) => {
    return Math.round((option.votes / totalVotes)*100);
  }

  return (
    <>
          {options.map((option, index) => (
            <li key={index} className="flex-1"><div className="pol-result w-full h-full text-left">
              <div className="flex w-full h-full">
                <div className="pol-result-bar" style={{width: `${getVotesPercentage(option)}%`}}>
                  {option.text}
                  </div>
              </div>
              </div></li>
            ))}
    </>
  );
};

export default VotedOptions;
