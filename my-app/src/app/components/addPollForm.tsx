"use client";
import { useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHatWizard, faTrash } from "@fortawesome/free-solid-svg-icons";
import ImagePicker from "./imagePicker";

interface Poll {
  title: string;
  options: string[];
}

interface AddPollFormProps {
  onNewPoll: (data: Poll) => void;
  onClose: () => void;
}

const AddPollForm: React.FC<AddPollFormProps> = ({ onNewPoll, onClose }) => {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [error, setError] = useState("");

  const handleOptionChange = (index: number, value: string) => {
    const updated = [...options];
    updated[index] = value;
    setOptions(updated);
  };

  const handleAddOption = () => {
    if (options.length >= 4) return;
    setOptions([...options, ""]);
  };

  const handleDeleteOption = (index: number) => {
    if (options.length <= 2) return;
    const updated = options.filter((_, i) => i !== index);
    setOptions(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const cleanedOptions = options.filter((opt) => opt.trim() !== "");
    if (cleanedOptions.length < 2) {
      setError("Please provide at least 2 valid options.");
      return;
    }

    const poll: Poll = {
      title: question,
      options: cleanedOptions,
    };

    console.log("Poll Created:", poll);

    setQuestion("");
    setOptions(["", ""]);
    setError("");
    onNewPoll(poll);
    onClose();
  };

  const generatePoll = async () => {
    try {
      let r = await fetch(`http://localhost:3000/api/ai/suggest_poll`, {
        method: 'GET'
      })
      let response = await r.json();
      setQuestion(response.title);
      setOptions(response.options);
    } catch (e: any) {
      setError(e.message);
    }
  };

  return (
    <>
      <ImagePicker></ImagePicker>
      <form
        onSubmit={handleSubmit}
        className="w-full text-white p-6 font-mono relative"
      >

        <h2 className="text-2xl mb-6">Create/Edit Poll</h2>

        <div className="flex items-center mb-6 gap-2">
          <input
            type="text"
            placeholder="What’s your question?"
            className="d-block flex-1 p-3 text-black bg-gray-300 rounded placeholder:text-black"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />
          <button className="pol-button mt-0" onClick={async (e) => {
            e.preventDefault();
            generatePoll();
          }}><FontAwesomeIcon icon={faHatWizard}></FontAwesomeIcon> Generate</button>
        </div>

        {options.map((opt, idx) => (
          <div key={idx} className="flex items-center mb-4 gap-2">
            <span className="w-6">{String.fromCharCode(65 + idx)}.</span>
            <input
              type="text"
              value={opt}
              placeholder={idx === 1 ? "Start typing your next option here.." : ""}
              onChange={(e) => handleOptionChange(idx, e.target.value)}
              className="flex-1 p-3 text-black bg-gray-300 rounded placeholder:text-black"
            />
            {options.length > 2 && (
              <button
                type="button"
                onClick={() => handleDeleteOption(idx)}
                className="text-gray-300 hover:text-white"
                title="Remove option"
              >
                <FontAwesomeIcon icon={faTrash} />
              </button>
            )}
          </div>
        ))}

        {error && (
          <p className="text-red-400 mb-4 font-semibold">{error}</p>
        )}

        <div className="flex justify-between items-center mt-4">
          {options.length < 4 && (
            <button
              type="button"
              onClick={handleAddOption}
              className="text-white border border-white px-4 py-1 rounded hover:bg-white hover:text-[#1E4147]"
            >
              + Add Option
            </button>
          )}

          <button
            type="submit"
            className="bg-[#355F63] hover:bg-[#43797F] text-white px-6 py-2 rounded"
          >
            Submit
          </button>
        </div>
      </form>
    </>
  );
};

export default AddPollForm;
