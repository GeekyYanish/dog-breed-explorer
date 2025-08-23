import { useState } from "react";
import BookEdit from "./BookEdit";

export default function BookShow({ book, onDelete, onEdit }) {
  const [showEdit, setShowEdit] = useState(false);

  const handleSubmit = (id, newTitle) => {
    onEdit(id, newTitle);
    setShowEdit(false);
  };

  const clickDeleteHandle = () => {
    onDelete(book.id);
  };

  const clickEditHandle = () => {
    setShowEdit(!showEdit);
  };

  let content = <h3 className="text-lg font-semibold">{book.title}</h3>;
  if (showEdit) {
    content = <BookEdit book={book} onSubmit={handleSubmit} />;
  }

  return (
    <div className="relative rounded-lg mx-4 my-4 p-4 bg-yellow-100 border-2 border-pink-800 w-[250px] min-h-[150px] flex flex-col justify-start gap-2 shadow-md">
      <button
        onClick={clickEditHandle}
        className="absolute top-1 right-10 text-blue-700 font-bold text-xl hover:text-blue-900"
      >
        ✏️
      </button>

      <button
        onClick={clickDeleteHandle}
        className="absolute top-1 right-2 text-red-700 font-bold text-xl hover:text-red-900"
      >
        &times;
      </button>

      {content}
    </div>
  );
}
