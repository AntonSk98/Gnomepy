import React, { useState, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XIcon } from "@heroicons/react/outline";
import { useRouter } from "next/router";
import {errorNotification, successNotification} from "../../notifications/notifications";

export default function CreateUser() {
  const [open, setOpen] = useState(false);

  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [admin, setAdmin] = useState(false);

  const router = useRouter();

  async function createUser() {
    const response = await fetch("/api/v1/admin/user/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        password,
        email,
        name,
        admin,
      }),
    });
    if (response.ok) {
      successNotification('Successfully created a new user!');
      await router.replace(router.pathname + '?instant=' + Date.now(), router.pathname);
    } else {
      errorNotification('Unexpected error occurred!');
    }
    setOpen(false);
  }

  const roles = [
    { id: "user", title: "user" },
    { id: "admin", title: "admin" },
  ];

  return (
    <div>
      <button
        onClick={() => setOpen(true)}
        type="button"
        className="inline-flex items-center p-2 border border-transparent rounded-xl shadow-sm text-white bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-800 hover:bg-green-600 duration-500"
      >
        New User
      </button>

      <Transition.Root show={open} as={Fragment}>
        <Dialog
          as="div"
          className="fixed z-10 inset-0 overflow-y-auto"
          onClose={setOpen}
        >
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
              <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
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
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <Dialog.Title
                      as="h3"
                      className="text-lg leading-6 font-bold text-emerald-800"
                    >
                      Fill out the form...
                    </Dialog.Title>
                    <div className="mt-5 space-y-4">
                      <input
                        type="text"
                        className="shadow-sm focus:ring-emerald-800 focus:border-emerald-800 block sm:text-sm border-gray-300 rounded-xl shadow-md w-full"
                        placeholder="Name..."
                        name="name"
                        onChange={(e) => setName(e.target.value)}
                      />

                      <input
                        type="email"
                        required
                        className="shadow-sm focus:ring-emerald-800 focus:border-emerald-800 block sm:text-sm border-gray-300 rounded-xl shadow-md w-full"
                        placeholder="Email..."
                        onChange={(e) => setEmail(e.target.value)}
                      />

                      <input
                        type="password"
                        className="shadow-sm focus:ring-emerald-800 focus:border-emerald-800 block sm:text-sm border-gray-300 rounded-xl shadow-md w-full"
                        placeholder="Password..."
                        onChange={(e) => setPassword(e.target.value)}
                      />

                      <div className="text-base font-bold text-emerald-800">
                        Role:
                      </div>
                      <div className="space-y-4 sm:flex sm:items-center sm:space-y-0 sm:space-x-10 my-0">
                        {roles.map((notificationMethod) => (
                          <div
                            key={notificationMethod.id}
                            className="flex items-center"
                          >
                            <input
                              id={notificationMethod.id}
                              name="notification-method"
                              type="radio"
                              defaultChecked={notificationMethod.id === "user"}
                              className="focus:ring-emerald-800 h-5 w-5 text-emerald-800 border-gray-300"
                              value={notificationMethod.id}
                              onChange={(e) =>
                                e.target.value === "admin"
                                  ? setAdmin(true)
                                  : setAdmin(false)
                              }
                            />
                            <label
                              htmlFor={notificationMethod.id}
                              className="ml-3 block text-sm font-medium text-gray-700"
                            >
                              {notificationMethod.title}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    className="w-full inline-flex justify-center rounded-xl border border-transparent shadow-sm px-4 py-2 bg-emerald-800 text-base font-medium text-white hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-800 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={() => {
                      createUser();
                    }}
                  >
                    Save
                  </button>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
    </div>
  );
}
