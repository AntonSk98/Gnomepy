import React, { useState, useEffect } from "react";
import fileDownload from "js-file-download";
import axios from "axios";
import { TrashIcon, DocumentDownloadIcon } from "@heroicons/react/solid";
import {errorNotification, successNotification} from "../../notifications/notifications";

export default function ListUserFiles({ uploaded, setUploaded }) {
  const [files, setFiles] = useState([]);

  async function getFiles() {
    await fetch(`/api/v1/users/file/all`, {
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
    await fetch(`/api/v1/users/file/delete`, {
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
      .then(() => {
        successNotification('Successfully removed the file!');
        getFiles();
      }).catch(() => errorNotification('Unexpected error occurred while removing the file...'));
  }

  function downloadFile(file) {
    const url = `/api/v1/users/file/download?filepath=${file.path}`;
    let data = new FormData();
    axios
      .post(url, data, {
        headers: {
          "Content-Type": "application/json",
        },
        responseType: "blob",
      })
      .then((res) => {
        successNotification('Successfully downloaded the file!')
        fileDownload(res.data, file.filename);
      })
        .catch(() => errorNotification('Something went wrong while downloading...'));
  }

  useEffect(() => {
    getFiles();
  }, [uploaded]);

  return (
    <div>
      <div className="flow-root p-5 mx-auto -mt-5 ml-1">
        {files ? (
          files.map((file) => {
            return (
              <div className="w-full" key={file.id}>
                <ul>
                  <li key={file.id}>
                    <span>{file.filename}</span>
                    <button
                      onClick={() => downloadFile(file)}
                      type="button"
                      className="float-right border border-transparent rounded-full shadow-sm hover:text-emerald-800 duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-800"
                    >
                      <DocumentDownloadIcon
                        className="h-5 w-5"
                        aria-hidden="true"
                      />
                    </button>
                    <button
                      onClick={() => deleteFile(file)} type="button"
                      className="mr-1 float-right border border-transparent rounded-full shadow-sm text-red-600 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-800 duration-300">
                      <TrashIcon className="h-5 w-5" aria-hidden="true" />
                    </button>
                  </li>
                </ul>
              </div>
            );
          })
        ) : (
          <p>No files found</p>
        )}
      </div>
    </div>
  );
}
