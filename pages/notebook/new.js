import dynamic from "next/dynamic";
import React, { useState } from "react";
import { useRouter } from "next/router";

import rehypeSanitize from "rehype-sanitize";

import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import {successNotification} from "../../notifications/notifications";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

export default function ViewNoteBook() {
  const [value, setValue] = useState("Place for your ideas...");
  const [title, setTitle] = useState("Provide here some title...");

  const router = useRouter();

  async function postMarkdown() {
    await fetch("/api/v1/note/create-note", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        value,
        title
      }),
    }).then((res) => res.json())
    .then((res) => {
      successNotification('Successfully create a new notebook!')
      router.push(`/notebook`)
    })
  }

  return (
    <div className="">
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-bold text-xl text-emerald-800"
        >
          Title
        </label>
        <div className="mt-1">
          <input
            type="text"
            name="title"
            id="title"
            className="shadow-sm focus:ring-emerald-800 focus:border-emerald-800 block w-full sm:text-sm border-green-600 focus:border-2 rounded-xl focus:ring-2"
            placeholder="Notebook title goes here..."
            onChange={(e) => setTitle(e.target.value)}
            value={title}
          />
        </div>
      </div>

      <div className="mt-4">
        <div>
          <div className="hidden sm:block">
            <MDEditor
                value={value}
                onChange={setValue}
                previewOptions={{
                  rehypePlugins: [[rehypeSanitize]],
                }}
                height="70vh"
                preview="edit"
            />
          </div>
          <div className="sm:hidden">
            <MDEditor
                value={value || ""}
                onChange={setValue}
                previewOptions={{
                  rehypePlugins: [[rehypeSanitize]],
                }}
                preview="edit"
                hideToolbar={true}
            />
          </div>
        </div>

        <div className="mt-4 float-right">
          <button
            onClick={() => postMarkdown()}
            type="button"
            className="my-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-xl shadow-sm text-white bg-emerald-800 hover:bg-green-600 duration-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
