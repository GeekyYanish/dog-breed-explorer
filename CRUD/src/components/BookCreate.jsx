import { useState } from "react";

export default function BookCreate({ onCreate }) {
  const [title, setTitle] = useState("");

  const formOnSubmit = (event) => {
    event.preventDefault();
    if (title.trim() === "") return;
    onCreate(title);
    setTitle("");
  };

  const changeHandle = (event) => {
    setTitle(event.target.value);
  };

  return (
    <div className="fixed bottom-0 w-full bg-green-200 shadow-md p-4 border-t-2 border-green-300">
      <form onSubmit={formOnSubmit} className="flex flex-col sm:flex-row items-center">
        <label className="text-lg font-semibold mr-4">Title:</label>
        <input
          onChange={changeHandle}
          value={title}
          placeholder="Enter book title"
          className="border-2 border-black rounded-lg px-4 py-2 flex-1 mr-4"
        />
        <button
          type="submit"
          className="bg-green-600 text-white font-bold px-4 py-2 rounded-lg hover:bg-green-700"
        >
          Add Book
        </button>
      </form>
    </div>
  );
}
