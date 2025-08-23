import { useState } from "react";

export default function BookEdit({ book, onSubmit }) {
  const [title, setTitle] = useState(book.title);

  const onHandleSubmit = (event) => {
    event.preventDefault();
    if (title.trim() === "") return;
    onSubmit(book.id, title);
  };

  const changeHandle = (event) => {
    setTitle(event.target.value);
  };

  return (
    <form
      onSubmit={onHandleSubmit}
      className="bg-green-100 border-2 border-green-300 p-2 rounded shadow-md"
    >
      <label className="block font-medium mb-1">Edit Title:</label>
      <input
        onChange={changeHandle}
        value={title}
        className="w-full border border-black px-3 py-2 rounded mb-2"
        placeholder="Enter new title"
      />
      <button className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700">
        Save
      </button>
    </form>
  );
}
