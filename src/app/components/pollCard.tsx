"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Modal from './modal';
import AddPollForm, { LocalPoll, PollOption } from "./addPollForm";
import { Poll } from "./addPollForm";
import UnvotedOptions from "./unvotedOptions";
import VotedOptions from "./votedOptions";

interface PollCardProps {
  poll: Poll;
  onDelete: () => void;
}

//Main feed page that displaus all the polls
const PollCard: React.FC<PollCardProps> = ({ poll, onDelete }: PollCardProps) => {
  const [isBeingEdited, setIsBeingEdited] = useState(false);
  const [hasVoted, setHasVoted] = useState(poll.hasVoted);
  const [results, setResults] = useState<PollOption[]|undefined>(poll.results);
  const [alertMsg, setAlertMsg] = useState<undefined | string>(undefined);

  //Delete poll function 
  const handleDeletePoll = () => {
    setAlertMsg(undefined);
    fetch(`http://localhost:3000/api/poll/${poll.id}`, {
      method: 'DELETE'
    })
      .then(async (res: Response) => {
        const jsonData = await res.json();
        if (res.status == 200) {
          onDelete();
        } else {
          setAlertMsg(jsonData.message);
        }
      }).catch((error: Error) => {
        setAlertMsg(error.message);
      })
  }

  const submitVote = (index: number) => {
    setAlertMsg("");
    fetch(`http://localhost:3000/api/poll/${poll.id}/vote`, {
      method: 'POST',
      body: JSON.stringify({
        optionIndex: index
      })
    })
      .then(async (res: Response) => {
        const jsonData = await res.json();
        if (res.status == 200) {
          const pollResults: PollOption[] = jsonData.results;
          poll.results = pollResults;
          poll.hasVoted = true;
          setHasVoted(true);
          setResults(pollResults);
        } else {
          setAlertMsg(jsonData.message);
        }
      }).catch((error: Error) => {
        setAlertMsg(error.message);
      })
  }

  return (
    <>
      <div
        className="bg-[#1E4147] pb-4 rounded text-lg font-mono border-solid border-1 border-[#AAC789]"
      >
          <div className="pol-poll-header rounded px-7" style={{backgroundImage: poll.imageURL ? `
             linear-gradient(
      rgba(0, 0, 0, 0.65),
      rgba(0, 0, 0, 0.65)
    ),
            url(${poll.imageURL})
            `:''}}>
            <span className="text-xl">{poll.title}</span>
          </div>
          <div className="px-6">
          <div className="mb-4">
          {alertMsg && (
            <p className="text-red-400 mb-4 font-semibold">{alertMsg}</p>
          )}
        </div>
        <ul className="space-x-0 space-y-3 mt-3">
        {hasVoted == true && results ? 
        <VotedOptions options={results}></VotedOptions>
        :
        <UnvotedOptions options={poll.options} onVote={(index) => submitVote(index)}></UnvotedOptions>
      }
        </ul>
        {poll.isOwnPoll && (
          <div className="mt-4">
            {/*Edit Button */}
            <button
              className="bg-[#355F63] hover:bg-[#43797F] text-white px-4 py-1 rounded"
              onClick={() => {
                setAlertMsg(undefined);
                setIsBeingEdited(true);
              }}
            >
              Edit
            </button>

            {/*Delete button */}
            <button
              className="ml-4 bg-[#355F63] hover:bg-[#43797F] text-white px-4 py-1 rounded"
              onClick={() => {
                handleDeletePoll()
              }}
            >
              Delete
            </button>
          </div>
        )}
          </div>

      </div>

      {/*This is the editing modal */}
      {isBeingEdited && (
        <Modal
          onDismiss={() => setIsBeingEdited(false)}
          transitionSeconds={0.3}
          bgColor="#1E4147"
          fgColor="#FFF"
        >
          <div className="pol-modal-large">
            <AddPollForm onCompletion={(editedPoll) => {
              setIsBeingEdited(false);
              poll.title = editedPoll.title;
              poll.options = editedPoll.options;
              poll.imageURL = editedPoll.imageURL;
              if(editedPoll.results) {
                poll.results = editedPoll.results;
                setResults(editedPoll.results);
              }
            }} pollToEdit={poll} />
          </div>
        </Modal>
      )}
    </>
  );
};

export default PollCard;
