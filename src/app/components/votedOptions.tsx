"use client";

import React, { useEffect, useState } from "react";
import { PollOption } from "./addPollForm";

interface VotedOptionsProps {
  options: PollOption[];
}

interface VotedOption extends PollOption {
  percentage: number;
}

//Main feed page that displaus all the polls
const VotedOptions: React.FC<VotedOptionsProps> = ({ options }: VotedOptionsProps) => {
  const [votedOptions, setVotedOptions] = useState<VotedOption[]>([]);
  useEffect(() => {
    let totalVotes = 0;
    for (let option of options) {
      totalVotes += option.votes
    }

    setVotedOptions(options.map((option) => {
      let newOption = {
        text: option.text,
        votes: option.votes,
        percentage: Math.round((option.votes / totalVotes) * 100)
      }
      return newOption
    }));
  }, [options]);

  return (
    <>
      {votedOptions.map((option, index) => (
        <li key={index}><div className="pol-result w-full h-full text-left">
          <div className="pol-result-content flex">
            <span className="pol-result-text w-full xl:w-3/4">{option.text}</span>
            <span className="pol-result-text text-right flex-1 hidden xl:block">{option.votes} votes</span>
          </div>
          <div className="pol-result-bar" style={{ width: `${option.percentage}%` }}>
          </div>
        </div></li>
      ))}
    </>
  );
};

export default VotedOptions;
