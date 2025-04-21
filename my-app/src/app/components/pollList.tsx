"use client";

import React, { useState } from "react";
import Image from "next/image";
import Modal from './modal';
import AddPollForm, { LocalPoll } from "./addPollForm";
import { Poll } from "./addPollForm";

//Main feed page that displaus all the polls
const PollList: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [editingPoll, setEditingPoll] = useState<Poll | null>(null);


  //State for the polls
  const [polls, setPolls] = useState<Poll[]>([

  ]);

  //Function to create new polls
  const handleNewPoll = (poll: LocalPoll) => {
    const formData = new FormData();
    formData.append('question', poll.title);
    poll.options.forEach((option) => formData.append('option', option))
    if (poll.image) {
      formData.append('image', poll.image);
    }
    fetch("http://localhost:3000/api/poll/create", {
      method: "POST",
      body: formData
    }).then(async (res: Response) => {
      const jsonData = await res.json();
      if (res.status == 201) {
        const poll: Poll = jsonData["poll"];
        setPolls((prev) => [...prev, poll])
        setShowModal(false)
      } else {
        console.log("Unable to create poll");
      }
    }).catch((error: Error) => {
      console.log(error);
    });

  };

  //Function to edit the polls
  const handleEditPoll = (poll: LocalPoll) => {
    const formData = new FormData();
    formData.append('question', poll.title);
    poll.options.forEach((option) => formData.append('option', option))
    if (poll.image) {
      formData.append('image', poll.image);
    }
    fetch(`http://localhost:3000/api/poll/${editingPoll?.id}`, {
      method: "PUT",
      body: formData
    }).then(async (res: Response) => {
      const jsonData = await res.json();
      if (res.status == 200) {
        const poll: Poll = jsonData["poll"];
        if (editingPoll) {
          editingPoll.title = poll.title
          editingPoll.options = poll.options
          editingPoll.imageURL = poll.imageURL
          setEditingPoll(editingPoll)
        }
        setEditingPoll(null)
      } else {
        console.log("Unable to create poll");
      }
    }).catch((error: Error) => {
      console.log(error);
    });

  };

  //Delete poll function 
  const handleDeletePoll = (poll: Poll) => {
    fetch(`http://localhost:3000/api/poll/${poll.id}`, {
      method: 'DELETE'
    })
    .then (async( res: Response) => {
      if(res.status == 200) {
        const pollIndex = polls.indexOf(poll);
        setPolls((prev) => {
          let newPolls = [...prev] 
          newPolls.splice(pollIndex, 1)
          return newPolls;
        })
      }
    
    })

  }

  //Main central page
  return (
    <div className="h-[600px] w-full max-w-5xl mx-auto p-6 bg-[#17393F] text-[#ffffff] rounded-lg flex flex-col">
      <div className="flex-1 space-y-4 overflow-auto pr-1">
        {polls.map((poll, index) => (
          <div
            key={index}
            className="bg-[#234] py-4 px-6 rounded text-lg font-mono"
          >
            <div className="mb-4">
              {poll.imageURL &&
                <Image
                  src={poll.imageURL}
                  alt={`Image for poll ${index + 1}`}
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
                setEditingPoll(poll);
              }}
            >
              Edit
            </button>

              {/*Delete button */}
            <button
              className="ml-4 mt-2 bg-[#355F63] hover:bg-[#43797F] text-white px-4 py-1 rounded"
              onClick={() => {
                handleDeletePoll(poll)
              }}
            >
              Delete
            </button>

          </div>
        ))}
      </div>

      <button
        className="mt-6 bg-[#2e5f4e] hover:bg-[#3d7b64] text-white px-6 py-1 rounded self-end"
        onClick={() => setShowModal(true)}
      >
        <h2>+</h2>
      </button>

        {/*This is the createa modal*/}
      {showModal && (
        <Modal
          onDismiss={() => setShowModal(false)}
          transitionSeconds={0.3}
          bgColor="#1E4147"
          fgColor="#FFF"
        >
          <div className="pol-modal-large">
            <AddPollForm onNewPoll={handleNewPoll} />
          </div>
        </Modal>
      )}
      {/*This is the editing modal */}
      {editingPoll && (
        <Modal
          onDismiss={() => setShowModal(false)}
          transitionSeconds={0.3}
          bgColor="#1E4147"
          fgColor="#FFF"
        >
          <div className="pol-modal-large">
            <AddPollForm onNewPoll={handleEditPoll} initialData={editingPoll} />
          </div>
        </Modal>
      )}
    </div>
  );
};

export default PollList;
