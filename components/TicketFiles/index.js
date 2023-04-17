import React, { useState, useEffect } from "react";
import fileDownload from "js-file-download";
import axios from "axios";
import { TrashIcon, DocumentDownloadIcon } from "@heroicons/react/solid";
import {errorNotification, successNotification} from "../../notifications/notifications";

export default function TicketFiles({ id, uploaded, setUploaded }) {
  const [files, setFiles] = useState([]);

  async function getFiles() {
    await fetch(`/api/v1/ticket/${id}/file/get`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((res) => {
        setFiles(res.files);
        setUploaded(false);
      });
  }

  async function deleteFile(file) {
    await fetch(`/api/v1/ticket/${id}/file/delete`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: file.id,
        path: file.path,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        getFiles();
        successNotification('Successfully removed the file!')
      }).catch(() => errorNotification('Unexpected error occurred while removing the file...'));
  }

  function download(file) {
    const url = `/api/v1/ticket/${id}/file/download?filepath=${file.path}`;
    let data = new FormData();
    axios
      .post(url, data, {
        headers: {
          "Content-Type": "application/json",
        },
        responseType: "blob",
      })
      .then((res) => {
        fileDownload(res.data, file.filename);
        successNotification('The file was successfully downloaded!')
      }).catch(() => errorNotification('Unexpected error occurred while downloading the file...'));
  }

  useEffect(() => {
    getFiles();
  }, [uploaded]);

  return (
    <div>
      <h3 className="text-sm text-emerald-800 font-bold cursor-default">Ticket Files</h3>
      <div className="flow-root mx-auto">
        {files.length >= 1 ? (
          files.map((file) => {
            return (
              <div className="w-full" key={file.id}>
                <ul>
                  <li>
                    <span className="font-semibold cursor-default">{file.filename}</span>
                    <button
                      onClick={() => download(file)}
                      type="button"
                      className="float-right border border-transparent rounded-full shadow-sm hover:text-emerald-800 duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-800"
                    >
                      <DocumentDownloadIcon
                        className="h-5 w-5"
                        aria-hidden="true"
                      />
                    </button>
                    <button
                      onClick={() => deleteFile(file)}
                      type="button"
                      className="mr-1 float-right border border-transparent rounded-full shadow-sm text-red-600 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-800 duration-300"
                    >
                      <TrashIcon className="h-5 w-5" aria-hidden="true" />
                    </button>
                  </li>
                </ul>
              </div>
            );
          })
        ) : (
          <div className="font-semibold cursor-default">No files attached to this issue... </div>
        )}
      </div>
    </div>
  );
}
