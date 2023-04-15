import React, {useEffect} from "react";
import { useQuery } from "react-query";
import { useTable, useFilters, useGlobalFilter, usePagination } from "react-table";
import ResetPassword from "../../components/ResetPassword";
import CreateUser from "../../components/CreateUserModal";
import UpdateUserModal from "../../components/UpdateUserModal";
import {ArrowCircleLeftIcon, ArrowCircleRightIcon} from "@heroicons/react/solid";
import {errorNotification, successNotification} from "../../notifications/notifications";
import {useSession} from "next-auth/react";
import {RotatingLines} from "react-loader-spinner";
import {useRouter} from "next/router";

function DefaultColumnFilter({ column: { filterValue, setFilter } }) {
  return (
    <input
      className="shadow-sm focus:ring-emerald-800 focus:border-emerald-800 block w-full sm:text-sm border-gray-300 ring-gray-300 rounded-xl"
      type="text"
      value={filterValue || ""}
      onChange={(e) => {
        setFilter(e.target.value || undefined); // Set undefined to remove the filter entirely
      }}
      placeholder="Type to filter"
    />
  );
}

function Table({ columns, data }) {
  const filterTypes = React.useMemo(
    () => ({
      text: (rows, id, filterValue) =>
        rows.filter((row) => {
          const rowValue = row.values[id];
          return rowValue !== undefined
            ? String(rowValue)
                .toLowerCase()
                .startsWith(String(filterValue).toLowerCase())
            : true;
        }),
    }),
    []
  );

  const defaultColumn = React.useMemo(
    () => ({
      Filter: DefaultColumnFilter,
    }),
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    canPreviousPage,
    canNextPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageSize },
  } = useTable(
    {
      columns,
      data,
      defaultColumn,
      filterTypes,
      initialState: {
        pageIndex: 0,
      },
    },
    useFilters,
    useGlobalFilter,
    usePagination
  );

  return (
    <div className="overflow-x-auto md:-mx-6 lg:-mx-8">
      <div className="py-2 align-middle inline-block min-w-full md:px-6 lg:px-8">
        <div className="shadow overflow-hidden border-b border-gray-200 md:rounded-lg">
          <table
            {...getTableProps()}
            className="min-w-full divide-y divide-gray-200"
          >
            <thead className="bg-gray-50">
              {headerGroups.map((headerGroup) => (
                <tr
                  {...headerGroup.getHeaderGroupProps()}
                  key={headerGroup.headers.map((header) => header.id)}
                >
                  {headerGroup.headers.map((column) =>
                    column.hideHeader === false ? null : (
                      <th
                        {...column.getHeaderProps()}
                        className="px-6 py-3 text-left text-sm font-bold text-emerald-800 uppercase tracking-wider cursor-default"
                      >
                        {column.render("Header")}
                        {/* Render the columns filter UI */}
                        <div className="mt-2">
                          {column.canFilter ? column.render("Filter") : null}
                        </div>
                      </th>
                    )
                  )}
                </tr>
              ))}
            </thead>
            <tbody {...getTableBodyProps()}>
              {page.map((row, i) => {
                prepareRow(row);
                return (
                  <tr {...row.getRowProps()} className="bg-white">
                    {row.cells.map((cell) => (
                      <td
                        className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
                        {...cell.getCellProps()}
                      >
                        {cell.render("Cell")}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>

          <nav
            className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6"
            aria-label="Pagination"
          >
            <div className="hidden sm:block">
              <div className="flex flex-row flex-nowrap w-full space-x-2">
                <p
                  htmlFor="location"
                  className="block text-sm font-medium text-gray-700 mt-4"
                >
                  Display
                </p>
                <select
                  id="location"
                  name="location"
                  className="block w-full pl-3 pr-10 text-base border-gray-300 focus:outline-none focus:ring-emerald-800 focus:border-emerald-800 sm:text-sm rounded-xl cursor-pointer"
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                  }}
                >
                  {[10, 20, 30, 40, 50].map((pageSize) => (
                    <option key={pageSize} value={pageSize}>
                      {pageSize}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex-1 flex justify-between sm:justify-end items-center">
              <ArrowCircleLeftIcon
                  className="flex-shrink-0 mr-1 h-8 w-8 text-emerald-800 cursor-pointer hover:text-gray-800 duration-300"
                  onClick={() => canPreviousPage ? previousPage() : null}
              ></ArrowCircleLeftIcon>
              <ArrowCircleRightIcon
                  className="flex-shrink-0 mr-1 h-8 w-8 ml-2 text-emerald-800 cursor-pointer hover:text-gray-800 duration-300"
                  onClick={() => canNextPage ? nextPage() : null}
              ></ArrowCircleRightIcon>
            </div>
          </nav>
        </div>
      </div>
    </div>
  );
}

export default function Users() {
  const fetchUsers = async () => {
    const res = await fetch("/api/v1/users/all");
    return res.json();
  };

  const removeUser = async (userId) => {
    try {
      const response = await fetch(`/api/v1/users/${userId}/delete`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        await response.json();
        successNotification('Successfully removed the user and all related data!');
        await refetch();
      } else {
        errorNotification('Unexpected error occurred while removing the user...')
      }
    } catch (error) {
      errorNotification('Unexpected error occurred...')
    }
  }

  const router = useRouter();
  const { data, status, refetch } = useQuery("fetchAuthUsers", fetchUsers);
  const { data: session } = useSession();

  useEffect(() => {
    refetch();
  }, [router.query]);

  const columns = React.useMemo(() => [
    {
      Header: "Name",
      accessor: "name",
      width: 10,
      id: "name",
    },
    {
      Header: "Email",
      accessor: "email",
      id: "email",
    },
    {
      Header: "",
      id: "actions",
      Cell: ({ row, value }) => {
        return (
          <div className="space-x-4 flex flex-row">
            <UpdateUserModal user={row.original} />
            <ResetPassword user={row.original} />
            {session.user.id !== row.original.id &&
                <div
                    className="border-2 border-red-800 text-red-800 font-semibold rounded-xl px-2 py-1 cursor-pointer hover:bg-red-800 duration-500 focus:bg-red-800 hover:text-white"
                    onClick={() => removeUser(row.original.id)}>
                  Purge
                </div>}
          </div>
        );
      },
    },
  ]);

  return (
    <div>
      <main
        className="relative z-0 overflow-y-auto focus:outline-none"
        tabIndex="0"
      >
        <div className="py-6">
          <div className="flex flex-row max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
            <h1 className="text-2xl font-bold text-emerald-800 cursor-default">
              User management
            </h1>
            <div className="ml-4">
              <CreateUser />
            </div>
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
            <div className="py-4">
              {status === "loading" && (
                  <RotatingLines
                      strokeColor="rgb(6 95 70)"
                      strokeWidth="5"
                      animationDuration="1"
                      width="40"
                      visible={true}
                  />
              )}

              {status === "error" && (
                <div className="min-h-screen flex flex-col justify-center items-center py-12 sm:px-6 lg:px-8">
                  <h2 className="text-2xl font-bold">
                    {" "}
                    Error fetching data ...{" "}
                  </h2>
                </div>
              )}

              {status === "success" && (
                <div>
                  <div className="hidden sm:block">
                    <Table columns={columns} data={data.users} />
                  </div>
                  <div className="sm:hidden">
                    {data.users.map((user) => (
                      <div key={user.id} className="flex flex-col text-center bg-white rounded-lg shadow mt-4">
                        <div className="flex-1 flex flex-col p-8">
                          <h3 className=" text-gray-900 text-sm font-medium">{user.name}</h3>
                          <dl className="mt-1 flex-grow flex flex-col justify-between">
                            <dd className="text-gray-500 text-sm">{user.email}</dd>
                            <dd className="mt-3">
                              <span className="px-2 py-1 text-green-800 text-xs font-medium bg-green-100 rounded-full">
                                {user.isAdmin ? "admin" : "user"}
                              </span>
                            </dd>
                          </dl>
                        </div>
                        <div className="space-x-4 flex flex-row justify-center mb-4">
                          <UpdateUserModal user={user} refetch={() => handleRefresh}/>
                          <ResetPassword user={user} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
