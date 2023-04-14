import React, { useState } from "react";
import { Pagination } from "antd";
import {ArrowRightIcon, CheckCircleIcon} from "@heroicons/react/solid";
import { useQuery } from "react-query";
import {errorNotification, successNotification} from "../../notifications/notifications";

async function getTasks() {
  const res = await fetch("/api/v1/todo/get");
  return res.json();
}

export default function ListTodo() {
  const { status, error, data, refetch } = useQuery("repoData", getTasks);

  const [minValue, setMinValue] = useState(0);
  const [maxValue, setMaxValue] = useState(7);
  const [inputTaskValue, setInputTaskValue] = useState("");

  function handleChange(value) {
    if (value <= 1) {
      setMinValue(0);
      setMaxValue(7);
    } else {
      setMinValue(maxValue);
      setMaxValue(value * 7);
    }
  }

  async function createNewTask() {
    await fetch("/api/v1/todo/create", {
      method: "POST",
      body: JSON.stringify({
        todo: inputTaskValue,
      }),
    }).then(() => {
      successNotification('Successfully created a new task!');
      refetch();
      setInputTaskValue("");
    }).catch(() => errorNotification('Unexpected error occurred while creating the list of tasks...'));
  }

  async function deleteTask(id) {
    await fetch(`api/v1/todo/delete/${id}`, {
      method: "POST",
    }).then(() => {
      successNotification('Done!');
      refetch();
    }).catch(() => errorNotification('Unexpected error while removing a task...'));
  }

  async function markDone(id) {
    await fetch(`api/v1/todo/mark-done/${id}`, {
      method: "POST",
    }).then(() => refetch());
  }

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      createNewTask();
    }
  };

  return (
    <div>
      <div className="flex flex-row w-full">
        <div className="mt-1 relative shadow-sm w-full space-x-2">
          <input
            type="text"
            name="text"
            id="text"
            className="w-full text-gray-900 border-none focus:outline-none focus:ring-emerald-800 focus:border-emerald-800 focus:rounded-xl sm:text-sm "
            placeholder="Enter a new task here..."
            onChange={(e) => {
              setInputTaskValue(e.target.value);
            }}
            onKeyDown={handleKeyDown}
            value={inputTaskValue}
          />
        </div>
        <button type="button" onClick={() => createNewTask()} className="ml-4">
          <ArrowRightIcon className="h-6 w-6 text-emerald-800 hover:text-gray-800 duration-300" />
        </button>
      </div>

      {status === "success" && (
        <div>
          <div className="mt-4">
            {data.todos ? (
              data.todos.slice(minValue, maxValue).map((todo) => {
                return (
                  <div className="flex flex-col" key={todo.id}>
                    <ul>
                      <li>
                        <span className={todo.done ? "line-through" : ""}>
                          {todo.text}
                        </span>
                        <button
                          onClick={() => deleteTask(todo.id)}
                          type="button"
                          className="float-right border border-transparent rounded-full shadow-sm text-emerald-800 hover:text-gray-800 duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          <CheckCircleIcon className="h-7 w-7" aria-hidden="true" />
                        </button>
                      </li>
                    </ul>
                  </div>
                );
              })
            ) : (
              <p>None Found</p>
            )}
          </div>
          <Pagination
            className={data.todos.length > 7 ? "mt-2" : "hidden"}
            defaultCurrent={1}
            total={12}
            onChange={handleChange}
          />
        </div>
      )}
    </div>
  );
}
