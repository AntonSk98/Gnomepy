import React, { useState, useEffect } from "react";
import {Upload } from "antd";
import moment from "moment";
import { useRouter } from "next/router";

import rehypeSanitize from "rehype-sanitize";
import MDEditor from "@uiw/react-md-editor";

import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import TicketFiles from "../TicketFiles";
import TransferTicket from "../TransferTicket";
import {errorNotification, successNotification} from "../../notifications/notifications";
import {TrashIcon, UploadIcon} from "@heroicons/react/outline";
import {CheckCircleIcon, PaperAirplaneIcon, PencilAltIcon} from "@heroicons/react/solid";

export default function TicketDetail(details) {

  const callback = details.callback;

  const router = useRouter();

  const [createdAt, setCreatedAt] = useState();
  const [updatedAt, setUpdatedAt] = useState();
  const [assignedToId, setAssignedToId] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [assignedToEmail, setAssignedToEmail] = useState();
  const [isTicketComplete, setIsTicketComplete] = useState();
  const [ticketId, setTicketId] = useState();
  const [priority, setPriority] = useState();
  const [note, setNote] = useState("");
  const [issue, setIssue] = useState("");
  const [title, setTitle] = useState("");
  const [email, setEmail] = useState("");
  const [uploaded, setUploaded] = useState(false);

  const [badge, setBadge] = useState("");
  const [edit, setEdit] = useState(false);

  const { id } = router.query;

  let file = [];

  const setBadgeClasses = () => {
    if (priority === "Low") {
      setBadge(low);
    }
    if (priority === "Normal") {
      setBadge(normal);
    }
    if (priority === "High") {
      setBadge(high);
    }
  }

  const setTicketDetails = () => {
    setTicketId(details.ticket.id);
    setCreatedAt(details.ticket.createdAt);
    setUpdatedAt(details.ticket.updatedAt)
    setPriority(details.ticket.priority);
    setNote(details.ticket.note);
    setIssue(details.ticket.details);
    setTitle(details.ticket.title);
    setEmail(details.ticket.email);
    setAssignedTo(details.ticket.assignedTo.name);
    setIsTicketComplete(details.ticket.isComplete);
    setAssignedToEmail(details.ticket.assignedTo.email);
    setAssignedToId(details.ticket.assignedTo.id);
  }


  useEffect(() => {
    setTicketDetails();
    setBadgeClasses();
  }, [details]);

  async function update() {
    await fetch(`/api/v1/ticket/${id}/update`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        detail: issue,
        note,
        title,
      }),
    })
        .then((res) => res.json())
        .then(() => successNotification('Issue updated!'))
        .catch(() => errorNotification('Something went wrong...'));
  }

  async function updateStatus() {
    await fetch(`/api/v1/ticket/${id}/update-status`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        status: !isTicketComplete,
      }),
    })
        .then((res) => res.json())
        .then(() => {
          callback();
          successNotification('Successfully updated the status of the issue!')
        })
        .catch(error => {
          errorNotification('Unexpected error occurred...')
        });
  }

  async function deleteTicket() {
    const response = await fetch(`/api/v1/ticket/${id}/delete`);
    if (response.ok) {
      successNotification('Successfully removed the ticket!');
      router.replace('/ticket');
      return;
    };
    errorNotification('Unexpected error occurred while removing the ticket...');
  }

  const propsUpload = {
    name: "file",
    showUploadList: false,
    action: `/api/v1/ticket/${id}/file/upload`,
    data: () => {
      let data = new FormData();
      data.append("file", file);
      data.append("filename", file.name);
    },
    onChange(info) {
      if (info.file.status === "done") {
        successNotification(`File uploaded successfully!`);
        setUploaded(true);
      } else if (info.file.status === "error") {
        errorNotification(`File upload failed....`);
      }
    }
  };

  const high = "bg-red-100 text-red-800";
  const low = "bg-blue-100 text-blue-800";
  const normal = "bg-green-100 text-green-800";

  return (
    <div>
      <div className="relative">
        <div className="py-8 xl:py-10">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 xl:max-w-5xl xl:grid xl:grid-cols-3 2xl:max-w-full">
            <div className="xl:col-span-2 xl:pr-8 xl:border-r-4 border-emerald-800">
              <div>
                <div>
                  <div className="md:flex md:items-center md:justify-between md:space-x-4 xl:border-b-4 xl:pb-6 border-emerald-800">
                    <div className="w-1/2">
                      <h1
                        className={
                          edit ? "hidden" : "text-2xl font-semibold text-gray-900"
                        }
                      >
                        <span className="text-emerald-800 font-bold cursor-default">Title</span> {title}
                      </h1>
                      <input
                        type="text"
                        maxLength={64}
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className={
                          edit
                            ? "shadow-sm block w-full sm:text-sm border-green-600 rounded-xl border-2 duration-500 focus:ring-emerald-800 focus:border-emerald-800 focus:ring-2"
                            : "hidden"
                        }
                      />
                      <div className="mt-2 text-sm font-bold text-emerald-800 cursor-default">
                        Reported by: <span className="font-semibold text-black">{email}</span></div>
                    </div>
                  </div>

                  <div className="flex flex-row p-1 mt-2 gap-5 flex-wrap">
                    <div className="mt-4 flex space-x-3 md:mt-0">
                      <Upload {...propsUpload}>
                        <button
                          type="button"
                          className="text-emerald-800 duration-500 inline-flex justify-center px-4 py-2 border border-emerald-800 ring-emerald-800 ring-2 shadow-sm text-sm font-medium rounded-xl bg-white hover:bg-emerald-800 hover:text-white duration-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-800"
                        >
                          <UploadIcon className="h-5 w-5 mr-2" aria-hidden="true"/>
                          <span>Upload</span>
                        </button>
                      </Upload>
                    </div>
                    <div
                      className={
                        edit ? "hidden" : "mt-4 flex space-x-3 md:mt-0"
                      }
                    >
                      <button
                        onClick={() => setEdit(true)}
                        type="button"
                        className="text-emerald-800 inline-flex justify-center px-4 py-2 border border-emerald-800 ring-emerald-800 ring-2 shadow-sm text-sm font-medium rounded-xl bg-white hover:bg-emerald-800 hover:text-white duration-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-800"
                      >
                        <PencilAltIcon className="h-5 w-5 mr-2" aria-hidden="true"/>
                        <span>Edit</span>
                      </button>
                    </div>
                    <div
                      className={
                        edit ? "mt-4 flex space-x-3 md:mt-0" : "hidden"
                      }
                    >
                      <button
                        onClick={async () => {
                          setEdit(false);
                          await update();
                        }}
                        type="button"
                        className="text-emerald-800 inline-flex justify-center px-4 py-2 border border-emerald-800 ring-emerald-800 ring-2 shadow-sm text-sm font-medium rounded-xl bg-white hover:bg-emerald-800 hover:text-white duration-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-800"
                      >
                        <CheckCircleIcon className="h-5 w-5 mr-2" aria-hidden="true"/>
                        <span>Save</span>
                      </button>
                    </div>
                    <div className="mt-4 flex space-x-3 md:mt-0">
                      {!isTicketComplete ? (
                        <button
                          onClick={async () => {
                            await updateStatus();
                          }}
                          type="button"
                          className="text-emerald-800 inline-flex justify-center px-4 py-2 border border-emerald-800 ring-emerald-800 ring-2 shadow-sm text-sm font-medium rounded-xl bg-white hover:bg-emerald-800 hover:text-white duration-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-800"
                        >
                          <CheckCircleIcon className="h-5 w-5 mr-2" aria-hidden="true"/>
                          <span>Complete</span>
                        </button>
                      ) : (
                        <button
                          onClick={async () => {
                            await updateStatus();
                          }}
                          type="button"
                          className="text-emerald-800 inline-flex justify-center px-4 py-2 border border-emerald-800 ring-emerald-800 ring-2 shadow-sm text-sm font-medium rounded-xl bg-white hover:bg-emerald-800 hover:text-white duration-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-800"
                        >
                          <PaperAirplaneIcon className="h-5 w-5 mr-2" aria-hidden="true"/>
                          <span>Reopen</span>
                        </button>
                      )}
                    </div>
                    <div className="mt-4 flex space-x-3 md:mt-0">
                      <TransferTicket ticketId={ticketId} responsibleId={assignedToId} callback={callback}/>
                    </div>

                    <div className="mt-4 flex space-x-3 md:mt-0">
                      <button
                          type="button"
                          className="text-red-800 inline-flex justify-center px-4 py-2 border border-red-800 ring-red-800 ring-2 shadow-sm text-sm font-medium rounded-xl bg-white hover:bg-red-800 hover:text-white duration-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-800"
                          onClick={deleteTicket}
                      >
                        <TrashIcon className="h-5 w-5 mr-2" aria-hidden="true"/>
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>

                  <div className="py-3 xl:pt-6 xl:pb-0 ">
                    <h1 className="text-xl font-bold text-emerald-800">Issue</h1>
                    <div className={edit ? "hidden" : "prose max-w-none"}>
                      {issue ? (
                        <MDEditor.Markdown
                          source={issue}
                          rehypePlugins={[[rehypeSanitize]]}
                        />
                      ) : (
                        <span className="font-semibold">
                          No details are provided for this issue...
                        </span>
                      )}
                    </div>
                    <div className={edit ? "prose max-w-none" : "hidden"}>
                      <div className="hidden sm:block">
                        <MDEditor
                          value={issue || ""}
                          onChange={setIssue}
                          previewOptions={{
                            rehypePlugins: [[rehypeSanitize]],
                          }}
                        />
                      </div>
                      <div className="sm:hidden">
                        <MDEditor
                          value={issue || ""}
                          onChange={setIssue}
                          previewOptions={{
                            rehypePlugins: [[rehypeSanitize]],
                          }}
                          preview="edit"
                          hideToolbar={true}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <section
                aria-labelledby="activity-title"
                className="mt-8 xl:mt-10"
              >
                <div className="pb-4">
                  <h2
                    id="activity-title"
                    className="text-lg font-bold text-emerald-800"
                  >
                    Activity
                  </h2>
                  <div className="flow-root -mt-4"></div>
                </div>
                <div className={edit ? "hidden" : "mt-3"}>
                  {note ? (
                    <MDEditor.Markdown
                      source={note}
                      rehypePlugins={[[rehypeSanitize]]}
                    />
                  ) : (
                    <span className="font-semibold">No activity was submitted yet...</span>
                  )}
                </div>
                <div className={edit ? "mt-3" : "hidden"}>
                  <div className="hidden sm:block">
                    <MDEditor
                      value={note || ""}
                      onChange={setNote}
                      previewOptions={{
                        rehypePlugins: [[rehypeSanitize]],
                      }}
                    />
                  </div>
                  <div className="sm:hidden">
                    <MDEditor
                      value={note || ""}
                      onChange={setNote}
                      previewOptions={{
                        rehypePlugins: [[rehypeSanitize]],
                      }}
                      preview="edit"
                      hideToolbar={true}
                    />
                  </div>
                </div>
              </section>
            </div>

            <aside className="hidden xl:block xl:pl-8">
              <h2 className="sr-only">Details</h2>
              <div className="space-y-5">
                <div className="flex items-center">
                  {isTicketComplete ? (
                    <div className="flex flex-row space-x-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-emerald-800"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="font-bold text-emerald-800 text-sm cursor-default">
                        Status: <span className="text-sm font-semibold">Resolved</span>
                      </span>
                    </div>
                  ) : (
                    <div className="flex-row flex space-x-2">
                      <svg
                        className="h-5 w-5 text-blue-500"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path d="M10 2a5 5 0 00-5 5v2a2 2 0 00-2 2v5a2 2 0 002 2h10a2 2 0 002-2v-5a2 2 0 00-2-2H7V7a3 3 0 015.905-.75 1 1 0 001.937-.5A5.002 5.002 0 0010 2z" />
                      </svg>
                      <span className="font-bold text-blue-500 text-sm cursor-default">
                        Status: <span className="text-sm font-semibold">Issued</span>
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex items-center space-x-2 cursor-default">
                  <span className="text-emerald-800 font-bold">Priority: <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badge}`}
                      >{priority}
                    </span>
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <svg
                    className="h-5 w-5 text-emerald-800"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-emerald-800 text-sm font-semibold cursor-default">
                    <span>Created at:</span> <span className="font-semibold text-black">{moment(createdAt).format("DD.MM.YYYY")}</span>
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <svg
                    className="h-5 w-5 text-emerald-800"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-emerald-800 text-sm font-semibold cursor-default">
                    <span>Last updated at:</span> <span className="font-semibold text-black">{moment(updatedAt).format("DD.MM.YYYY")}</span>
                  </span>
                </div>
              </div>
              <div className="mt-6 border-t-4 border-gray-200 py-4 space-y-8">
                <div className="cursor-default">
                  <h2 className="text-sm text-emerald-800 font-bold">
                    Responsible
                  </h2>
                  <ul className="mt-3 space-y-3 mb-0">
                    <li className="flex justify-start">
                      <div href="#" className="flex items-center space-x-3">
                        <div className="text-sm font-medium text-gray-900">
                          <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-emerald-800">
                            <span className="font-medium leading-none text-white">
                              {assignedTo[0]}
                            </span>
                          </span>
                        </div>
                        <span className="font-semibold">{assignedTo}</span>
                      </div>
                    </li>
                  </ul>
                  {/*<Divider className="bg-gray-200" />*/}
                </div>
              </div>

              <div className="border-t-4 border-gray-200 py-4">
                <div className="flex flex-col">
                  <TicketFiles
                    id={id}
                    uploaded={uploaded}
                    setUploaded={setUploaded}
                  />
                </div>
              </div>
              <div className="py-4 border-t-4 border-gray-200 cursor-default">
                <div>
                  <h2 className="text-sm font-bold text-emerald-800">
                    Contact details
                  </h2>
                  <div className="flex flex-col">
                    <span className="font-semibold"><span className="font-bold text-emerald-800">Name:</span> {assignedTo}</span>
                    <span className="font-semibold"><span className="font-bold text-emerald-800">Email:</span> {assignedToEmail} </span>
                  </div>
                </div>
              </div>
            </aside>

            <aside className="mt-8 xl:hidden">
              <h2 className="sr-only">Details</h2>
              <div className="space-y-5">
                <div className="flex items-center space-x-2">
                  {isTicketComplete ? (
                      <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-emerald-800"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                      >
                        <path
                            fillRule="evenodd"
                            d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                            clipRule="evenodd"
                        />
                      </svg> ) : (
                      <svg
                          className="h-5 w-5 text-blue-500"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          aria-hidden="true"
                      >
                        <path d="M10 2a5 5 0 00-5 5v2a2 2 0 00-2 2v5a2 2 0 002 2h10a2 2 0 002-2v-5a2 2 0 00-2-2H7V7a3 3 0 015.905-.75 1 1 0 001.937-.5A5.002 5.002 0 0010 2z" />
                      </svg>
                  )}

                  <span className={isTicketComplete ? "font-bold text-emerald-800 text-sm cursor-default" : "font-bold text-blue-500 text-sm cursor-default"}>
                        Status:
                    <span className= {isTicketComplete ? "text-sm font-semibold" : "text-sm font-semibold text-blue-500"}>
                      {isTicketComplete ? " Resolved" : " Issued"}
                    </span>
                  </span>
                </div>
                <div className="flex items-center space-x-2 cursor-default">
                  <span className="text-emerald-800 font-bold">Priority: <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badge}`}
                  >{priority}
                    </span>
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <svg
                    className="h-5 w-5 text-emerald-800"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-emerald-800 text-sm font-semibold cursor-default">
                    <span>Created at:</span> <span className="font-semibold text-black">{moment(createdAt).format("DD.MM.YYYY")}</span>
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <svg
                    className="h-5 w-5 text-emerald-800"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-emerald-800 text-sm font-semibold cursor-default">
                    <span>Last updated at:</span> <span className="font-semibold text-black">{moment(updatedAt).format("DD.MM.YYYY")}</span>
                  </span>
                </div>
              </div>
              <div className="mt-6 border-t-4 border-gray-200 py-4 space-y-8 mb-0 pb-2">
                <div>
                  <h2 className="text-sm font-bold text-emerald-800">
                    Responsible
                  </h2>
                  <ul className="mt-3 space-y-3">
                    <li className="flex justify-start">
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-emerald-800">
                            <span className="font-medium leading-none text-white">
                              {assignedTo
                                ? assignedTo[0]
                                : ""}
                            </span>
                          </span>
                        </div>
                        <div className="text-sm font-semibold">
                          <span> {assignedTo}</span>
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="border-t-4 border-gray-200 py-4">
                <div className="flex flex-col">
                  <TicketFiles
                    id={id}
                    uploaded={uploaded}
                    setUploaded={setUploaded}
                  />
                </div>
              </div>
              <div className="py-4 border-t-4 border-gray-200 cursor-default">
                <div>
                  <h2 className="text-sm font-bold text-emerald-800">
                    Contact details
                  </h2>
                  <div className="flex flex-col">
                    <span className="font-semibold"><span className="font-bold text-emerald-800">Name:</span> {assignedTo}</span>
                    <span className="font-semibold"><span className="font-bold text-emerald-800">Email:</span> {assignedToEmail} </span>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}
