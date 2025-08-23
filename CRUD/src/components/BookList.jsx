import BookShow from "./BookShow";

export default function BookList({ books, onDelete, onEdit }) {
  if (books.length === 0) {
    return (
      <p className="text-center text-gray-600 text-lg">
        No books available. Add some using the form below!
      </p>
    );
  }

  const renderedBooks = books.map((book) => (
    <BookShow onDelete={onDelete} key={book.id} book={book} onEdit={onEdit} />
  ));

  return <div className="flex flex-wrap justify-center p-4">{renderedBooks}</div>;
}
