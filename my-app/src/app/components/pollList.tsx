"use client";

import React, { useEffect, useState } from "react";
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

  useEffect(() => {
    fetch("http://localhost:3000/api/poll", {
      method: "GET"
    }).then(async (res: Response) => {
      const jsonData = await res.json();
      if (res.status == 200) {
        const polls: Poll[] = jsonData;
        setPolls(polls);
      } else {
        console.log("Unable to list polls");
      }
    }).catch((error: Error) => {
      console.log(error);
    });
  }, []);

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
      .then(async (res: Response) => {
        if (res.status == 200) {
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
    <>
    <div className="w-full h-full bg-[#12282C] text-[#ffffff] flex flex-col">
      <div className="flex-1 space-y-4 p-6 pol-feed-container">
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
                <button
            className="pol-button"
            style={{ bottom: 0, position: "absolute"}}
            onClick={() => setShowModal(true)}
          >
            <span className="text-4xl">+</span>
          </button>
      </div>

      {/*This is the create modal*/}
      {showModal && (
        <Modal
          key="createModal"
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
          key="editModel"
          onDismiss={() => setEditingPoll(null)}
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
    </>
  );
};

export default PollList;
