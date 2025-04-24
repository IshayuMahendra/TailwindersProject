"use client";

import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { useUser } from "../provider/userProvider";
import AddPollForm, { Poll } from "./addPollForm";
import Modal from './modal';
import PollCard from "./pollCard";

interface PollListProps {
  collectionType: "profile"|"home"
}

//Main feed page that displaus all the polls
const PollList: React.FC<PollListProps> = ({collectionType}) => {
  const [showModal, setShowModal] = useState(false);

  //State for the polls
  const [polls, setPolls] = useState<Poll[]>([

  ]);
  const user = useUser();

  const updatePolls = () => {
    let fetchURL = "http://localhost:3000/api/poll"

    if(collectionType == "profile") {
      fetchURL = "http://localhost:3000/api/profile"
    }

    fetch(fetchURL, {
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
  };
  
  useEffect(updatePolls, [user.isLoggedIn]);

  //Main central page
  return (
    <>
    <div className="w-full h-full bg-[#12282C] text-[#ffffff] flex flex-col items-center">
      <div className="w-full md:w-2/3 lg:w-full xl:w-2/3 space-y-6 p-6">
        {polls.map((poll) => (
          <PollCard poll={poll} key={poll.id} onDelete={() => {
            setPolls((prev) => prev.filter((entry) => entry.id != poll.id));
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
              setPolls((prev) => [newPoll, ...prev])
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
