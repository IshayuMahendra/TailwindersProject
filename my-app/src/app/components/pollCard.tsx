"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Modal from './modal';
import AddPollForm, { LocalPoll } from "./addPollForm";
import { Poll } from "./addPollForm";

interface PollCardProps {
  poll: Poll;
  onDelete: () => void;
}

//Main feed page that displaus all the polls
const PollCard: React.FC<PollCardProps> = ({poll, onDelete}: PollCardProps) => {
  const [isBeingEdited, setIsBeingEdited] = useState(false);
  const [alertMsg, setAlertMsg] = useState<undefined|string>(undefined);

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

  //Main central page
  return (
    <>
          <div
            className="bg-[#234] py-4 px-6 rounded text-lg font-mono"
          >
            <div className="mb-4">
              
            {alertMsg && (
          <p className="text-red-400 mb-4 font-semibold">{alertMsg}</p>
        )}
              {poll.imageURL &&
                <Image
                  src={poll.imageURL}
                  alt={`Image for poll`}
                  width={150}
                  height={150}
                  className="rounded-md"
                />
              }
            </div>
            <div>{poll.title}</div>
            {/*Edit Button */}
            <button
              className="mt-2 bg-[#355F63] hover:bg-[#43797F] text-white px-4 py-1 rounded"
              onClick={() => {
                setAlertMsg(undefined);
                setIsBeingEdited(true);
              }}
            >
              Edit
            </button>

            {/*Delete button */}
            <button
              className="ml-4 mt-2 bg-[#355F63] hover:bg-[#43797F] text-white px-4 py-1 rounded"
              onClick={() => {
                handleDeletePoll()
              }}
            >
              Delete
            </button>

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
            }} pollToEdit={poll} />
          </div>
        </Modal>
      )}
    </>
  );
};

export default PollCard;
