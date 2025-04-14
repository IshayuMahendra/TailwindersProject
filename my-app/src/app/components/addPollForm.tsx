"use client";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

const AddPollForm = () => {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [error, setError] = useState("");

  const handleOptionChange = (index: number, value: string) => {
    const updated = [...options];
    updated[index] = value;
    setOptions(updated);
  };

  const handleAddOption = () => {
    setOptions([...options, ""]);
  };

  const handleDeleteOption = (index: number) => {
    if (options.length <= 2) return; // prevent dropping below 2
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

    const data = {
      question,
      options: cleanedOptions,
    };

    console.log("Poll Created:", data);

    // Clear everything
    setQuestion("");
    setOptions(["", ""]);
    setError("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-[#1E4147] w-full max-w-lg text-white p-6 rounded shadow-xl font-mono relative"
    >
      <h2 className="text-2xl mb-6">Create/Edit Poll</h2>

      <input
        type="text"
        placeholder="What’s your question?"
        className="w-full mb-6 p-3 text-black bg-gray-300 rounded placeholder:text-black"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />

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
        <button
          type="button"
          onClick={handleAddOption}
          className="text-white border border-white px-4 py-1 rounded hover:bg-white hover:text-[#1E4147]"
        >
          + Add Option
        </button>

        <button
          type="submit"
          className="bg-[#355F63] hover:bg-[#43797F] text-white px-6 py-2 rounded"
        >
          Submit
        </button>
      </div>
    </form>
  );
};

export default AddPollForm;
