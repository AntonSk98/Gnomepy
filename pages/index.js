import {useState, useEffect} from "react";
import {CheckCircleIcon} from "@heroicons/react/solid";
import { Upload } from "antd";
import { useSession } from "next-auth/react";
import Link from "next/link";

import ListTodo from "../components/ListTodo";
import ListUserFiles from "../components/ListUserFiles";
import {useRouter} from "next/router";
import {errorNotification, successNotification} from "../notifications/notifications";
import {RotatingLines} from "react-loader-spinner";
import {UploadIcon} from "@heroicons/react/outline";

export default function Dashboard() {
  const { data: session } = useSession();

  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [pendingIssues, setPendingIssues] = useState(0);
  const [resolvedIssues, setResolvedIssues] = useState(0);
  const [uploaded, setUploaded] = useState(false);

  let file = [];

  async function getPendingIssues() {
    try {
      const response = await fetch(`/api/v1/data/count/open-tickets`, {
        method: "get",
        headers: {
          ContentType: "application/json",
        },
      });
      const pendingIssues = await response.json();
      setPendingIssues(pendingIssues.result);
    } catch (error) {
      errorNotification('Unexpected error occurred while getting pending issues');
    }
  }

  async function getResolvedIssues() {
    try {
      const response = await fetch(`/api/v1/data/count/completed-tickets`, {
        method: "get",
        headers: {
          ContentType: "application/json",
        },
      });

      const resolvedIssues = await response.json();
      setResolvedIssues(resolvedIssues.result);
    } catch (error) {
      errorNotification('Unexpected error occurred while getting resolved issues');
    }

  }

  const stats = [
    { name: "Pending Issues", stat: pendingIssues, href: "/ticket" },
    { name: "Completed Tickets", stat: resolvedIssues, href: "/history" },
  ];

  const uploadProperties = {
    name: "file",
    action: `/api/v1/users/file/upload`,
    data: () => {
      let data = new FormData();
      data.append("file", file);
      data.append("filename", file.name);
    },
    onChange(info) {
      if (info.file.status === "done") {
        successNotification(`${info.file.name} file uploaded successfully`)
        setUploaded(true);
      } else if (info.file.status === "error") {
        errorNotification(`${info.file.name} file upload failed.`);
      }
    },
    showUploadList: false,
    progress: {
      strokeColor: {
        "0%": "#1F2937",
        "100%": "#065F46",
      },
      strokeWidth: 3,
      format: (percent) => `${parseFloat(percent.toFixed(2))}%`,
    },
  };

  useEffect(() => {
    setIsLoading(true);
    Promise.all([ getPendingIssues(),  getResolvedIssues()]).finally(() => setIsLoading(false));
  }, [router.query]);

  return (
    <div>
      <main className="p-1">
        {/* Page header */}
        <div className="bg-white shadow border-emerald-800 rounded-xl">
          <div className="px-4 sm:px-6 lg:max-w-6xl lg:px-8">
            <div className="py-6 md:flex md:items-center md:justify-between">
              <div className="flex-1 min-w-0">
                {/* Profile */}
                <div className="flex items-center">
                  <span className="hidden sm:inline-flex items-center justify-center h-12 w-12 rounded-full bg-green-600">
                    <span className="text-lg font-medium leading-none text-white uppercase">
                      {session.user.name[0]}
                    </span>
                  </span>
                  <div>
                    <div className="flex items-center">
                      <h1 className="ml-3 text-2xl font-bold leading-7 text-emerald-800 sm:leading-9 sm:truncate cursor-default">
                        Hello {session.user.name}!
                      </h1>
                    </div>
                    <dl className="mt-6 flex flex-col sm:ml-3 sm:mt-1 sm:flex-row sm:flex-wrap">
                      <dt className="sr-only">Account status</dt>
                      <dd className="mt-3 flex items-center text-sm text-gray-800 font-medium sm:mr-6 sm:mt-0 capitalize cursor-default">
                        <CheckCircleIcon className="flex-shrink-0 mr-1 h-5 w-5 text-emerald-800" aria-hidden="true"/>
                        {session.user.isAdmin ? "Admin" : "user"}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
            {stats.map((item) => (
              <Link href={item.href}>
                <div key={item.name} className="px-4 py-5 bg-white shadow rounded-lg overflow-hidden sm:p-6 cursor-pointer hover:bg-slate-200 duration-300">
                  <dt className="text-sm font-bold text-emerald-800 truncate">
                    {item.name}
                  </dt>
                  <dd className="mt-2 text-3xl font-semibold text-gray-800">
                    {isLoading ? <RotatingLines
                        strokeColor="rgb(31 41 55)"
                        strokeWidth="5"
                        animationDuration="1"
                        width="30"
                        visible={true}
                    />: <span>{item.stat}</span> }
                  </dd>
                </div>
              </Link>
            ))}
          </dl>
        </div>

        <div className="flex sm:flex-row mt-5 flex-nowrap flex-col gap-4">
          <div className="flex w-full sm:w-3/5">
            <div className="bg-white shadow w-full h-full sm:rounded-lg">
              <div className="px-2 sm:px-6 lg:max-w-6xl lg:mx-auto lg:px-4">
                <div className="px-2 py-5 sm:p-6">
                  <div>
                    <h1 className="font-bold leading-7 text-emerald-800 cursor-default">Task scheduler...</h1>
                  </div>
                  <ListTodo />
                </div>
              </div>
            </div>
          </div>

          <div className="flex w-full sm:w-2/5">
            <div className="bg-white shadow w-full h-full sm:rounded-lg">
              <div className="px-2 py-5 sm:p-6 flex flex-row">
                <h2 className="font-bold leading-7 text-emerald-800 cursor-default" id="recent-hires-title">
                  Private files
                </h2>
                <Upload
                  {...uploadProperties}
                  className="px-3 flex align-middle items-center -mt-3"
                >
                  <button><UploadIcon className="h-5 w-5 mt-2 text-emerald-800 hover:text-gray-800 duration-300" aria-hidden="true"/></button>
                </Upload>
              </div>
              <ListUserFiles uploaded={uploaded} setUploaded={() => setUploaded()} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
