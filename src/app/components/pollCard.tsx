"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Modal from './modal';
import AddPollForm, { LocalPoll, PollOption } from "./addPollForm";
import { Poll } from "./addPollForm";
import UnvotedOptions from "./unvotedOptions";
import VotedOptions from "./votedOptions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useUser } from "../provider/userProvider";
import { useRouter } from "next/navigation";

interface PollCardProps {
  poll: Poll;
  onDelete: () => void;
}

//Main feed page that displaus all the polls
const PollCard: React.FC<PollCardProps> = ({ poll, onDelete}: PollCardProps) => {
  const [isBeingEdited, setIsBeingEdited] = useState(false);
  const [hasVoted, setHasVoted] = useState(poll.hasVoted);
  const [hasVotes, setHasVotes] = useState<boolean>(poll.hasVotes);
  const [alertMsg, setAlertMsg] = useState<undefined | string>(undefined);
  const user = useUser();
  const router = useRouter();

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
    if(!user.isLoggedIn) {
      const errorParams = new URLSearchParams();
      errorParams.set("login", "true");
      errorParams.set("error", "You must be logged in to do that.")
      router.push(`/home?${errorParams.toString()}`);
      return;
    }
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
          poll.hasVotes = true;
          setHasVoted(true);
          setHasVotes(true);
        } else {
          setAlertMsg(jsonData.message);
        }
      }).catch((error: Error) => {
        setAlertMsg(error.message);
      })
  }

  useEffect(() => setHasVoted(poll.hasVoted), [poll.hasVoted]);
  useEffect(() => setHasVotes(poll.hasVotes), [poll.hasVotes]);

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
        {hasVoted && poll.results && poll.results.length > 0 ? 
        <VotedOptions options={poll.results}></VotedOptions>
        :
        <UnvotedOptions options={poll.options} onVote={(index) => submitVote(index)}></UnvotedOptions>
      }
        </ul>
        {poll.isOwnPoll && (
          <div className="mt-4 ml-3">
            {
            /*Edit Button */
            }
            {!hasVotes &&
            <button
              className=" mr-4 text-2xl pol-iconbtn"
              onClick={() => {
                setAlertMsg(undefined);
                setIsBeingEdited(true);
              }}
            >
              <FontAwesomeIcon icon={faPencil}></FontAwesomeIcon>
            </button>
            }

            {/*Delete button */}
            <button
              className="pol-iconbtn text-white"
              onClick={() => {
                handleDeletePoll()
              }}
            >
              <FontAwesomeIcon icon={faTrash}></FontAwesomeIcon>
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
              }
            }} pollToEdit={poll} />
          </div>
        </Modal>
      )}
    </>
  );
};

export default PollCard;
