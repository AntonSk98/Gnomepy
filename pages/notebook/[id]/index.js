import { useRouter } from "next/router";
import { useQuery } from "react-query";
import dynamic from "next/dynamic";
import Link from "next/link";

import "@uiw/react-markdown-preview/markdown.css";
import {RotatingLines} from "react-loader-spinner";
import {errorNotification} from "../../../notifications/notifications";

const MD = dynamic(() => import("../../../components/MarkdownPreview"), {
  ssr: false,
});

export default function ViewNoteBook() {
  const router = useRouter();

  async function getMarkdown() {
    const res = await fetch(`/api/v1/note/${router.query.id}`);
    if (!res.ok) {
      return Promise.reject();
    }
    return res.json();
  }

  const { data, status, error } = useQuery("viewMarkdown", getMarkdown);

  return (
    <div>
      {status === "success" && (
        <>
          <Link href={`/notebook/${data?.data?.id}/edit`}>
            <button
              type="button"
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-xl shadow-sm text-white bg-emerald-800 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-600 duration-500 "
            >
              Edit
            </button>
          </Link>

          <div className="mt-4">
            <MD data={data?.data?.note} />
          </div>
        </>
      )}

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

      {status === "error" && (
          <div className="font-bold text-xl text-emerald-800">Unexpected error occurred...</div>
      )}
    </div>
  );
}
