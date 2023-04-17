import React, { useState, useEffect, Fragment } from "react";
import { Dialog, Transition, Listbox } from "@headlessui/react";
import { XIcon } from "@heroicons/react/outline";
import {ChatAlt2Icon, CheckIcon, SelectorIcon} from "@heroicons/react/solid";
import {errorNotification, successNotification} from "../../notifications/notifications";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function TransferTicket({ ticketId, responsibleId, callback }) {
  const [open, setOpen] = useState(false);
  const [users, setUsers] = useState();
  const [selectedResponsible, setSelectedResponsible] = useState();

  const fetchUsers = async () => {
    await fetch(`/api/v1/users/all`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((res) => {
        if (res) {
          setUsers(res.users.filter(user => user.id !== responsibleId));
        }
      });
  };

  async function postData() {
    await fetch(`/api/v1/ticket/${ticketId}/transfer`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user: selectedResponsible,
      }),
    });
  }

  useEffect(() => {
    fetchUsers();
  }, [ticketId, responsibleId]);

  function changeResponsible() {
    postData()
        .then(() => {
          callback();
          setOpen(false);
          successNotification('Successfully changed the responsible!')
        })
        .catch(() => errorNotification('Unexpected error occurred...'))
  }

  return (
    <div>
      <button
        className="text-emerald-800 duration-300 inline-flex justify-center px-4 py-2 border border-emerald-800 ring-emerald-800 ring-2 shadow-sm text-sm font-medium rounded-xl bg-white hover:bg-emerald-800 hover:text-white duration-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-800"
        onClick={() => {
          setOpen(true);
        }}
      >
        <ChatAlt2Icon className="h-5 w-5 mr-2" aria-hidden="true"/>
        Transfer
      </button>

      <Transition.Root show={open} as={Fragment}>
        <Dialog
          as="div"
          className="fixed z-10 inset-0 overflow-y-auto"
          onClose={setOpen}
        >
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
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

            {/* This element is to trick the browser into centering the modal contents. */}
            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 overflow-hidden shadow-xl transform transition-all sm:align-middle sm:max-w-xl sm:w-full">
                <div className="hidden sm:block absolute top-0 right-0 pt-4 pr-4">
                  <button
                    type="button"
                    className="bg-white rounded-xl text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    onClick={() => setOpen(false)}
                  >
                    <span className="sr-only">Close</span>
                    <XIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
                <div className="sm:flex sm:items-start w-full">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <Dialog.Title
                      as="h3"
                      className="text-lg leading-6 font-bold text-emerald-800"
                    >
                      Transfer issue
                    </Dialog.Title>
                    <div className="mt-2 pb-2">
                      <Listbox value={selectedResponsible} onChange={setSelectedResponsible} className="z-50">
                        {({ open }) => (
                          <>
                            <Listbox.Label className="block text-base font-semibold text-emerald-800 mb-2">
                              Assign to:
                            </Listbox.Label>
                            <div className="mt-1 relative">
                              <Listbox.Button className="relative w-full border border-emerald-800 rounded-xl shadow-lg pl-3 py-2 text-left cursor-default ring-2 ring-emerald-800 sm:text-sm">
                                <div className="flex">
                                  <span className="block truncate flex-1 truncate">
                                  {selectedResponsible ? selectedResponsible.name : "Please select a new responsible"}
                                </span>
                                <span className="inset-y-0 right-0 flex-0 flex items-center pr-2 pointer-events-none">
                                  <SelectorIcon
                                      className="h-5 w-5 text-gray-400"
                                      aria-hidden="true"
                                  />
                                </span>
                                </div>
                              </Listbox.Button>

                              <Transition
                                show={open}
                                as={Fragment}
                                leave="transition ease-in duration-100"
                                leaveFrom="opacity-100"
                                leaveTo="opacity-0"
                              >
                                <Listbox.Options className="absolute z-50 mt-1 w-full bg-white shadow-lg max-h-60 rounded-xl py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                                  {users.map((user) => (
                                    <Listbox.Option
                                      key={user.id}
                                      className={({ active }) =>
                                        classNames(
                                          active
                                            ? "text-white bg-emerald-800 text-white"
                                            : "text-emerald-800",
                                          "cursor-default select-none relative py-2 pl-3 pr-9"
                                        )
                                      }
                                      value={user}
                                    >
                                      {({ n, active }) => (
                                        <>
                                          <span
                                            className={classNames(
                                              n
                                                ? "font-semibold"
                                                : "font-normal",
                                              "block truncate"
                                            )}
                                          >
                                            {user.name}
                                          </span>

                                          {n ? (
                                            <span
                                              className={classNames(
                                                active
                                                  ? "text-white"
                                                  : "text-indigo-600",
                                                "absolute inset-y-0 right-0 flex items-center pr-4"
                                              )}
                                            >
                                              <CheckIcon
                                                className="h-5 w-5"
                                                aria-hidden="true"
                                              />
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

                      <button
                        onClick={changeResponsible}
                        type="button"
                        className="float-right mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-xl shadow-sm text-white bg-emerald-800 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-800 duration-500"
                      >
                        Save
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
