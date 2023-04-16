import React, { useState } from "react";
import { useSession, signOut } from "next-auth/react";

import UserProfile from "../components/UserProfile";
import {errorNotification, successNotification} from "../notifications/notifications";

export default function Settings() {
  const { data: session } = useSession();

  const linkStyles = {
    active:
      "w-full bg-emerald-800 border-emerald-600 text-white hover:text-white hover:bg-gray-800 hover:border-gray-800 group border-l-4 px-3 py-2 flex items-center text-sm font-semibold duration-500",
    inactive:
      "w-full text-emerald-800 border-transparent group mt-1 border-l-4 px-3 hover:text-white py-2 flex items-center text-sm font-semibold hover:bg-gray-800 hover:border-gray-800 duration-500",
  };

  const [showProfile, setShowProfile] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [check, setCheck] = useState("");

  const updatePassword = async () => {
    const id = session.id;
    if (check === password) {
      await fetch(`/api/v1/users/resetpassword`, {
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
            successNotification('Password was successfully updated!');
          } else {
            errorNotification('Something went wrong while updating the password...');
          }
          setPassword("");
          setCheck("");
          setShowPassword(false);
          setShowProfile(true);
        });
    } else {
      errorNotification('Sorry...Try again a bit later...')
    }
  };

  return (
    <div>
      <main className="relative">
        <div className="max-w-screen-xl mx-auto pb-6 px-4 sm:px-6 lg:pb-16 lg:px-8">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="divide-y divide-gray-200 lg:grid lg:grid-cols-12 lg:divide-y-0 lg:divide-x">
              <aside className="py-6 lg:col-span-3">
                <nav>
                  <button
                    onClick={() => {
                      setShowProfile(true);
                      setShowPassword(false);
                    }}
                    className={
                      showProfile ? linkStyles.active : linkStyles.inactive
                    }
                    aria-current="page"
                  >
                    <svg
                      className="group-hover:text-white flex-shrink-0 -ml-1 mr-3 h-6 w-6"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span className="truncate">Profile</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowProfile(false);
                      setShowPassword(true);
                    }}
                    className={
                      showPassword ? linkStyles.active : linkStyles.inactive
                    }
                  >
                    <svg
                      className="flex-shrink-0 -ml-1 mr-3 h-6 w-6"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                      />
                    </svg>
                    <span className="truncate">Password</span>
                  </button>
                  <button
                    onClick={() => signOut({redirect: true, callbackUrl: "/"})}
                    className={linkStyles.inactive}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="flex-shrink-0 -ml-1 mr-3 h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      />
                    </svg>
                    <span className="truncate">Log Out</span>
                  </button>
                </nav>
              </aside>
              <div className="divide-y divide-gray-200 lg:col-span-9">
                <div className={`${showProfile ? "" : "hidden"}`}>
                  <div>
                    <UserProfile />
                  </div>
                </div>
                <div className={`${showPassword ? "" : "hidden"}`}>
                  <div>
                    <h2 className="px-4 mx-2 my-5 text-lg leading-6 font-bold text-emerald-800">Change password</h2>
                  </div>
                  <div className="m-2 space-y-4 p-4">
                    <input
                      type="password"
                      className="shadow-sm focus:ring-emerald-800 focus:border-emerald-800 block sm:text-sm border-gray-300 rounded-xl shadow-md w-full"
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="New password..."
                    />
                    <input
                      type="password"
                      className="shadow-sm focus:ring-emerald-800 focus:border-emerald-800 block sm:text-sm border-gray-300 rounded-xl shadow-md w-full"
                      onChange={(e) => setCheck(e.target.value)}
                      placeholder="Confirm password..."
                    />
                    <div className="mt-4 py-4 px-4 flex justify-end sm:px-6">
                      <button
                          type="button"
                          className="w-full inline-flex justify-center rounded-xl border border-transparent shadow-sm px-4 py-2 bg-emerald-800 text-base font-semibold text-white hover:bg-green-600 duration-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-800 sm:ml-3 sm:w-auto sm:text-sm"
                          onClick={() => updatePassword()}
                      >
                        Update password
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
