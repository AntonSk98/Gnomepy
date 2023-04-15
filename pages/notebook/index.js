import Link from "next/link";
import { useQuery } from "react-query";
import moment from "moment";
import {RotatingLines} from "react-loader-spinner";
import {errorNotification, successNotification} from "../../notifications/notifications";

export default function GetNoteBook() {
  const { data, status, refetch } = useQuery("getUsersNotebooks", getNotebooks);

  async function getNotebooks() {
    const res = await fetch("/api/v1/note/get-notes");
    return res.json();
  }

  async function removeNotebook(notebookId) {
    try {
      const res = await fetch(`/api/v1/note/${notebookId}/delete`);
      if (res.ok) {
        successNotification('Successfully removed the notebook!');
        await refetch();
      } else {
        errorNotification('Something went wrong while removing the notebook...');
      }
    } catch (error) {
      errorNotification('We are having some unexpected troubles right now...')
    }
  }

  return (
    <div>
      <div className="flex flex-col">
        <div className="flex gap-8 items-end flex-wrap">
          <div className="text-emerald-800 font-bold text-2xl cursor-default">Personal Notebook Space</div>
          <Link href="/notebook/new">
            <button
                type="button"
                className="xs:bg-red-200 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-xl shadow-sm text-white bg-emerald-800 hover:bg-emerald-600 duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Add notebook
            </button>
          </Link>
        </div>
        <div className="mt-2 text-gray-500 italic font-semibold text-base cursor-default">
          Keep everything that is important to you in one place...
        </div>
      </div>
      {status === "loading" && (
        <div className="absolute inset-1/2 inset-x-1/2 translate-x-1/2 translate-y-1/2">
          <RotatingLines
              strokeColor="rgb(6 95 70)"
              strokeWidth="5"
              animationDuration="1"
              width="40"
              visible={true}
          />
        </div>
      )}

      {status === "success" && (
        <div className="mt-5">
          {!data?.notebooks?.length && (
              <div className="text-lg font-semibold cursor-default">You do not have any notebooks yet. Create one!</div>)
          }
          <ul
            role="list"
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {data.notebooks.map((book) => (
              <li
                key={book.id}
                className="col-span-1 bg-white rounded-lg shadow drop-shadow-lg divide-y divide-gray-400"
              >
                <div className="w-full flex items-center justify-between p-6 space-x-6">
                  <div className="flex-1 truncate">
                    <div className="flex items-center space-x-3">
                      <h3 className="text-emerald-800 text-sm font-bold truncate">
                        {book.title}
                      </h3>
                    </div>
                    <div className="mt-1 text-gray-500 text-base truncate font-semibold">
                      Introduction date: {moment(book.createdAt).format("DD.MM.YYYY")}
                    </div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-around my-4 flex-wrap gap-y-2">
                    <Link href={`/notebook/${book.id}`}>
                      <div className="rounded-xl px-4 py-1 cursor-pointer border-2 border-emerald-800 text-emerald-800 font-semibold hover:bg-emerald-800 duration-500 focus:bg-emerald-800 hover:text-white">
                        View
                      </div>
                    </Link>
                    <Link href={`/notebook/${book.id}/edit`}>
                      <div className="rounded-xl px-4 py-1 cursor-pointer border-2 border-emerald-800 text-emerald-800 font-semibold hover:bg-emerald-800 duration-500 focus:bg-emerald-800 hover:text-white">
                        Edit
                      </div>
                    </Link>
                    <div className="border-2 border-red-800 text-red-800 font-semibold rounded-xl px-4 py-1 cursor-pointer hover:bg-red-800 duration-500 focus:bg-red-800 hover:text-white" onClick={() => removeNotebook(book.id)}>
                      Remove
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
