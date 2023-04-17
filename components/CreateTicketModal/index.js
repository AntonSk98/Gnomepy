import {useState, useEffect, Fragment, useRef} from "react";
import { Dialog, Transition, Listbox } from "@headlessui/react";
import { CheckIcon, SelectorIcon } from "@heroicons/react/solid";
import dynamic from "next/dynamic";
import { Radio } from "antd";

import rehypeSanitize from "rehype-sanitize";

import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import {useSession} from "next-auth/react";
import {commands} from "@uiw/react-md-editor";
import {useRouter} from "next/router";
import {RotatingLines} from "react-loader-spinner";
import {errorNotification, successNotification} from "../../notifications/notifications";


function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

export default function CreateTicketModal() {

  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [responsible, setResponsible] = useState("");
  const [email, setEmail] = useState("");
  const [details, setDetails] = useState("");
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("Normal");
  const [users, setUsers] = useState([]);
  const {data: session} = useSession();

  const isSaveButtonEnabled = responsible
      && email?.replace(/ /g,'').length > 0
      && title?.replace(/ /g,'').length > 0
      && priority;

  const cancelButtonRef = useRef(null);

  const resetNewIssueForm = () => {
    setResponsible("");
    setEmail("");
    setDetails("");
    setTitle("");
    setPriority("Normal");
  }

  async function getUsers() {
    try {
      const response = await fetch(`/api/v1/users/all`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const users = await response.json();
      setUsers(users.users);
    } catch (error) {
      console.error("Unexpected error occurred: ", error);
      errorNotification('Something went wrong while fetching the list of responsibles...')
    }
  }

  async function createTicket() {
    try {
      setIsLoading(true);
      const response = await fetch("/api/v1/ticket/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          responsible,
          email,
          details,
          priority,
        }),
      });

      if (response.ok) {
        await router.replace(router.asPath + '?instant=' + Date.now(), router.asPath);
        successNotification('New issue was successfully created!');
      } else {
        errorNotification('Something went wrong while creating a new issue...')
      }
    } catch (error) {
      console.error(error);
      errorNotification('Something went wrong while creating a new issue...');
    } finally {
      setIsLoading(false);
    }
  }

  const setDefaultEmailFromSession = () => {
    if (!session?.user?.email) {
      return;
    }
    setEmail(session.user.email);
  }

  const excludeCommandsFromEditor = (command) => {
      const excludedCommands = [commands.fullscreen, commands.codeLive];
      if (excludedCommands.includes(command)) {
          return false;
      }
      return command;
  }

  const openNewIssueForm = () => {
    setOpen(true);
    resetNewIssueForm();
    setDefaultEmailFromSession();
  }

  useEffect(() => {
    getUsers();
    setDefaultEmailFromSession()
  }, []);

  function closeModal() {
    if (isLoading) {
      return;
    }
    setOpen(false);
  }

  return (
    <div>
      <div>
        <button
          onClick={() => openNewIssueForm()}
          type="button"
          className="group flex items-center px-2 py-2 text-sm font-medium w-full rounded-xl hover:bg-gray-800 hover:text-white outline-none duration-300"
        >

          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 mr-3 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path id="Vector"
                  d="M15 10L11 14L9 12M12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21Z"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"/>
          </svg>
          <span className="text-white ">Report issue</span>
        </button>
      </div>

      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="fixed z-50 inset-0 overflow-y-auto" initialFocus={cancelButtonRef} onClose={ closeModal }>
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            </Transition.Child>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full sm:p-6">
                <div>
                  <div>
                    <h1 className="text-xl text-center m2 p2 font-bold text-emerald-800">New Issue...</h1>
                    <h4 className="text-base font-semibold text-emerald-800">Required fields are colored in green!</h4>

                    <div className="mt-4 space-y-4">
                      <input
                        type="text"
                        name="email"
                        disabled={!!session?.user?.email || isLoading}
                        placeholder= {session?.user?.email ? "Author: " + session?.user?.email : "Enter your email here..."}
                        className="shadow-sm block w-full sm:text-sm border-green-600 rounded-xl border-2 duration-300 focus:ring-emerald-800 focus:border-emerald-800 focus:ring-2"
                      />

                      <input
                        disabled={isLoading}
                        type="text"
                        name="title"
                        placeholder="Enter title for the ticket here, keep it short...."
                        maxLength={64}
                        onChange={(e) => setTitle(e.target.value)}
                        className="shadow-sm focus:ring-emerald-800 focus:border-emerald-800 block w-full sm:text-sm border-green-600 focus:border-2 rounded-xl focus:ring-2"
                      />

                      <Listbox value={responsible} onChange={setResponsible} disabled={isLoading}>
                        {({ open }) => (
                          <>
                            <div className="mt-1 relative">
                              <Listbox.Button className="bg-white relative w-full border border-green-600 border-2 rounded-xl shadow-sm pl-3 pr-10 py-2 text-left cursor-pointer focus:outline-none duration-300 hover:ring-emerald-800 hover:border-emerald-800 sm:text-sm hover:ring-2">
                                <span className="block truncate">
                                  {responsible ? responsible.name : "Please select a responsible"}
                                </span>
                                <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                                  <SelectorIcon className="h-5 w-5 text-gray-400" aria-hidden="true"/>
                                </span>
                              </Listbox.Button>

                              <Transition
                                show={open}
                                as={Fragment}
                                leave="transition ease-in duration-100"
                                leaveFrom="opacity-100"
                                leaveTo="opacity-0"
                              >
                                <Listbox.Options className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-xl py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                                  {users.map((user) => (
                                    <Listbox.Option
                                      key={user.id}
                                      className={({ active }) =>
                                        classNames(
                                          active
                                            ? "text-white bg-emerald-800"
                                            : "text-gray-900",
                                          "cursor-pointer select-none relative py-2 pl-3 pr-9"
                                        )
                                      }
                                      value={user}
                                    >
                                      {({ responsible, active }) => (
                                        <>
                                          <span className={classNames(responsible ? "font-semibold" : "font-normal", "block truncate")}>{user.name}</span>
                                          {responsible ? (
                                            <span className={classNames(active ? "text-white" : "text-indigo-600", "absolute inset-y-0 right-0 flex items-center pr-4")}>
                                              <CheckIcon className="h-5 w-5" aria-hidden="true"/>
                                            </span>
                                          ) : null}
                                        </>
                                      )}
                                    </Listbox.Option>
                                  ))}
                                </Listbox.Options>
                              </Transition>
                            </div>
                          </>
                        )}
                      </Listbox>

                      <MDEditor
                        onChange={setDetails}
                        className={isLoading ? "pointer-events-none opacity-80 cursor-not-allowed":""}
                        value={details}
                        data-color-mode="light"
                        previewoptions={{
                          rehypePlugins: [[rehypeSanitize]],
                        }}
                        commandsFilter={command => excludeCommandsFromEditor(command)}
                        preview="edit"
                        commands={[
                            commands.bold,
                            commands.italic,
                            commands.hr,
                            commands.orderedListCommand,
                            commands.unorderedListCommand
                        ]}
                      />

                      <div className="flex justify-center mx-auto">
                        <Radio.Group
                          disabled={isLoading}
                          buttonStyle="solid"
                          value={priority}
                          onChange={(e) => setPriority(e.target.value)}
                          className="mx-auto justify-center space-x-4"
                        >
                          <Radio.Button value="Low">Low</Radio.Button>
                          <Radio.Button value="Normal">Normal</Radio.Button>
                          <Radio.Button value="High">High</Radio.Button>
                        </Radio.Group>
                      </div>
                    </div>

                    <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense mx-auto ">
                      <button
                        disabled={!isSaveButtonEnabled || isLoading}
                        onClick={() => {
                          createTicket().then(() => setOpen(false));
                        }}
                        type="button"
                        className="w-1/2 mx-auto inline-flex justify-center rounded-xl border border-transparent shadow-sm px-4 py-2 bg-emerald-800 text-base font-medium text-white hover:bg-green-600 duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-600 sm:col-start-2 sm:text-sm disabled:opacity-75 disabled:bg-gray-800 disabled:cursor-not-allowed"
                      >
                        {isLoading ? <RotatingLines
                            strokeColor="rgb(240 253 250)"
                            strokeWidth="5"
                            animationDuration="1"
                            width="20"
                            visible={true}
                        />: <span>Report issue</span> }
                      </button>
                      <button
                        disabled={isLoading}
                        onClick={() => {
                          setOpen(false);
                        }}
                        type="button"
                        className="mt-3 w-1/2  mx-auto inline-flex justify-center rounded-xl border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-800 hover:text-white duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-1 sm:text-sm disabled:cursor-not-allowed">
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
    </div>
  );
}
