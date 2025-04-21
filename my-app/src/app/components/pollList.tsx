"use client";

import React, { useState } from "react";
import Image from "next/image";
import Modal from './modal';
import AddPollForm from "./addPollForm";

const PollList: React.FC = () => {
  const [showModal, setShowModal] = useState(false);

  const [polls, setPolls] = useState([
    { title: "sample poll", imageUrl: "/img/image1.webp" },
    { title: "sample poll", imageUrl: "/img/image2.jpeg" },
    { title: "sample poll", imageUrl: "/img/image3.webp" }
  ]);

  return (
    <div className="h-[600px] w-full max-w-5xl mx-auto p-6 bg-[#17393F] text-[#ffffff] rounded-lg flex flex-col">
      <div className="flex-1 space-y-4 overflow-auto pr-1">
        {polls.map((poll, index) => (
          <div
            key={index}
            className="bg-[#234] py-4 px-6 rounded text-lg font-mono"
          >
            <div className="mb-4">
              <Image
                src={poll.imageUrl}
                alt={`Image for poll ${index + 1}`}
                width={150}
                height={150}
                className="rounded-md"
              />
            </div>
            <div>{poll.title}</div>
          </div>
        ))}
      </div>

      <button
        className="mt-6 bg-[#2e5f4e] hover:bg-[#3d7b64] text-white px-6 py-1 rounded self-end"
        onClick={() => setShowModal(true)}
      >
        <h2>+</h2>
      </button>

      {showModal && (
        <Modal
          onDismiss={() => setShowModal(false)}
          transitionSeconds={0.3}
          bgColor="#1E4147"
          fgColor="#FFF"
        >
          <div className="pol-modal-large">
            <AddPollForm onNewPoll={(poll) => setPolls((prev) => [...prev, {
              title: poll.title,
              imageUrl: poll.imageURL!
            }])}onClose={() => setShowModal(false)} />
          </div>
        </Modal>
      )}
    </div>
  );
};

export default PollList;
