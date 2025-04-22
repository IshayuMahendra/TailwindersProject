"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Modal from './modal';
import AddPollForm, { LocalPoll } from "./addPollForm";
import { Poll } from "./addPollForm";
import PollCard from "./pollCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

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

  //Main central page
  return (
    <>
    <div className="w-full h-full bg-[#12282C] text-[#ffffff] flex flex-col items-center">
      <div className="w-full md:w-2/3 lg:w-full xl:w-2/3 space-y-6 p-6">
        {polls.map((poll, index) => (
          <PollCard poll={poll} key={index} onDelete={() => {
            setPolls((prev) => {
              let newPolls = [...prev];
              newPolls.splice(index, 1);
              return newPolls;
            });
          }}></PollCard>
        ))}
      </div>
      <div className="flex w-full">
          <div className="ml-auto">
          <button
            className="pol-button rounded-full text-center"
            style={{position: "fixed", bottom: 0, marginBottom: 20, marginLeft: -100, width: 60, height: 60, fontSize: 20, padding: 0, border: 0}}
            onClick={() => setShowModal(true)}
          ><FontAwesomeIcon icon={faPlus}></FontAwesomeIcon></button>
          </div>
        </div>

      {/*This is the create modal*/}
      {showModal && (
        <Modal
          onDismiss={() => setShowModal(false)}
          transitionSeconds={0.3}
          bgColor="#1E4147"
          fgColor="#FFF"
        >
          <div className="pol-modal-large">
            <AddPollForm onCompletion={(newPoll) => {
              setPolls((prev) => [...prev, newPoll])
              setShowModal(false);
            }}  />
          </div>
        </Modal>
      )}
    </div>
    </>
  );
};

export default PollList;
