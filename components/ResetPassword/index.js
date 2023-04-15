import React, { useState, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XIcon } from "@heroicons/react/outline";
import {errorNotification, successNotification} from "../../notifications/notifications";

export default function ResetPassword({ user }) {

  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [check, setCheck] = useState("");

  const updatePassword = async () => {
    const id = user.id;
    if (check === password) {
      await fetch(`/api/v1/admin/user/resetpassword`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          password,
          id,
        }),
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.failed === false) {
            successNotification('Successfully updated the password');
          } else {
            errorNotification('Something went wrong while resetting the password...');
          }
        });
    } else {
      errorNotification("Passwords do not match!");
    }
  };

  const onPasswordReset = async () => {
    await updatePassword();
    setOpen(false);
  };

  return (
    <div>
      <button
        onClick={() => setOpen(true)}
        type="button"
        className="inline-flex items-center px-2.5 py-1.5 border border-emerald-800 shadow-sm text-xs font-medium rounded-xl text-emerald-800 bg-white hover:bg-emerald-800 hover:text-white duration-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-800"
      >
        Reset Password
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
                      Reset password...
                    </Dialog.Title>
                    <div className="mt-5 space-y-4">
                      <input
                        type="password"
                        className="shadow-sm focus:ring-emerald-800 focus:border-emerald-800 block sm:text-sm border-gray-300 rounded-xl shadow-md w-full"
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="New password"
                      />

                      <input
                        type="password"
                        className="shadow-sm focus:ring-emerald-800 focus:border-emerald-800 block sm:text-sm border-gray-300 rounded-xl shadow-md w-full"
                        onChange={(e) => setCheck(e.target.value)}
                        placeholder="Confirm password"
                      />
                    </div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    className="w-full inline-flex justify-center rounded-xl border border-transparent shadow-sm px-4 py-2 bg-emerald-800 text-base font-medium text-white hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-800 sm:ml-3 sm:w-auto sm:text-sm duration-500"
                    onClick={() => onPasswordReset()}
                  >
                    Update
                  </button>
                  <button
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-xl border border-emerald-800 shadow-sm px-4 py-2 text-base font-medium text-emerald-800 hover:bg-gray-600 hover:text-white duration-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
                    onClick={() => setOpen(false)}
                  >
                    Cancel
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
