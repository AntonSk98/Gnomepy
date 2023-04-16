import React, {useEffect, useState} from "react";
import {useSession} from "next-auth/react";
import {errorNotification, successNotification} from "../../notifications/notifications";

export default function UserProfile() {

    const {data: session} = useSession();

    const [name, setName] = useState();
    const [email, setEmail] = useState();

    async function getUserData() {
        const response = await fetch(`/api/v1/users/${session.user.id}/find`)
        const data = await response.json()
        setName(data.user.name);
        setEmail(data.user.email);
    }

    async function postData() {
        const nameToBePersisted = name ? name : session.user.name;
        const emailToBePersisted = email ? email : session.user.email;

        const response = await fetch(`/api/v1/users/update_profile`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                id: session.user.id,
                name: nameToBePersisted,
                email: emailToBePersisted,
            }),
        });
        if (response.ok) {
            await getUserData();
            console.log({name, email})
            await response.json();
            successNotification('Successfully updated profile data!');
        } else {
            errorNotification('Sorry... Something went wrong during update.');
        }
    }

    useEffect(() => {
        console.log('hi!')
        getUserData();
    }, []);

    return (
        <div>
            <div className="py-6 px-4 sm:p-6 lg:pb-8">
                <div>
                    <h2 className="text-lg leading-6 font-bold text-emerald-800">Profile</h2>
                    <p className="  text-sm text-gray-500">
                        This information will be displayed publicly so be careful what you
                        share.
                    </p>
                </div>

                <div className="mt-6 flex flex-col lg:flex-row">
                    <div className="flex-grow space-y-6">
                        <div>
                            <label
                                className="text-base font-bold text-emerald-800"
                            >
                                Name
                            </label>
                            <div className="mt-1 rounded-xl shadow-sm flex">
                                <input
                                    type="text"
                                    name="name"
                                    id="name"
                                    autoComplete="name"
                                    placeholder="Name..."
                                    className="shadow-sm focus:ring-emerald-800 focus:border-emerald-800 block sm:text-sm border-gray-300 rounded-xl shadow-md w-full"
                                    defaultValue={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
                        </div>
                        <div>
                            <label
                                className="text-base font-bold text-emerald-800"
                            >
                                Email
                            </label>
                            <div className="mt-1 rounded-xl shadow-sm flex">
                                <input
                                    type="email"
                                    name="email"
                                    autoComplete="email"
                                    placeholder="Email..."
                                    className="shadow-sm focus:ring-emerald-800 focus:border-emerald-800 block sm:text-sm border-gray-300 rounded-xl shadow-md w-full"
                                    defaultValue={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            <div className="mt-4 py-4 px-4 flex justify-end sm:px-6">
                <button
                    onClick={async () => {
                        await postData()
                    }}
                    type="submit"
                    className="w-full inline-flex justify-center rounded-xl border border-transparent shadow-sm px-4 py-2 bg-emerald-800 text-base font-semibold text-white hover:bg-green-600 duration-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-800 sm:ml-3 sm:w-auto sm:text-sm"
                >
                    Save
                </button>
            </div>
        </div>
    )
}