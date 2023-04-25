import dynamic from "next/dynamic";
import React, {useEffect, useState} from "react";
import { useRouter } from "next/router";
import { useQuery } from "react-query";

import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import {successNotification} from "../../../notifications/notifications";
import rehypeSanitize from "rehype-sanitize";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

export default function ViewNoteBook() {
  const router = useRouter();

  const { id } = router.query;

  async function getMarkdown() {
    const res = await fetch(`/api/v1/note/${id}`);
    return res.json();
  }
  const { data, status, error, refetch } = useQuery("edit", getMarkdown);

  const [title, setTitle] = useState('');
  const [note, setNote] = useState('');

  async function save() {
    await fetch(`/api/v1/note/${id}/update`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        note,
      }),
    });
    await refetch();
  }

  useEffect(() => {
    setNote(data?.data?.note);
    setTitle(data?.data?.title);
  }, [data]);

  return (
    <div>
      <div className="mt-4">
        {status === "success" && (
          <div>
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-bold text-xl text-emerald-800"
              >
                Title
              </label>
              <div className="mt-1 mb-4">
                <input
                  type="text"
                  name="title"
                  id="title"
                  className="shadow-sm focus:ring-emerald-800 focus:border-emerald-800 block w-full sm:text-sm border-green-600 focus:border-2 rounded-xl focus:ring-2"
                  placeholder="Enter title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
            </div>
            <div>
              <div className="hidden sm:block">
                <MDEditor
                    value={note}
                    onChange={setNote}
                    previewOptions={{
                      rehypePlugins: [[rehypeSanitize]],
                    }}
                    height="70vh"
                    preview="edit"
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
            <button
              onClick={async () => {
                await save();
                successNotification('Successfully updated the notebook!')
                await router.push(`/notebook`)
              }}
              type="button"
              className="my-4 float-right inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-xl shadow-sm text-white bg-emerald-800 hover:bg-green-600 duration-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Save
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
