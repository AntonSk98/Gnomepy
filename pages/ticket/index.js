import React, {useEffect} from "react";
import { useQuery } from "react-query";
import { useTable, useFilters, useGlobalFilter, usePagination } from "react-table";
import Link from "next/link";
import Loader from "react-spinners/ClipLoader";

import MarkdownPreview from "../../components/MarkdownPreview";
import TicketsMobileList from "../../components/TicketsMobileList";
import {useRouter} from "next/router";
import {ArrowCircleLeftIcon, ArrowCircleRightIcon} from "@heroicons/react/solid";

async function getUserTickets() {
  const res = await fetch("/api/v1/ticket/user/open");
  return res.json();
}

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
      // Add a new fuzzyTextFilterFn filter type.
      // fuzzyText: fuzzyTextFilterFn,
      // Or, override the default text filter to use
      // "startWith"
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
      // Let's set up our default Filter UI
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
      defaultColumn, // Be sure to pass the defaultColumn option
      filterTypes,
      initialState: {
        pageIndex: 0,
      },
    },
    useFilters, // useFilters!
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

export default function Tickets() {

  const router = useRouter();
  const { data, status, error, refetch } = useQuery("pendingIssues", getUserTickets);

  const high = "text-red-900 ring-red-900 bg-red-100 ring-2 w-16 text-center";
  const low = "bg-blue-100 text-blue-800 ring-blue-800 ring-2 w-16 text-center";
  const normal = "bg-green-100 text-emerald-800 ring-emerald-800 ring-2 w-16 text-center";

  const columns = React.useMemo(() => [
    {
      Header: "Title",
      accessor: "title",
      id: "Title",
      Cell: ({ value }) => {
        return (
            <div className="truncate">
              <MarkdownPreview data={value} />
            </div>
        );
      },
    },
    {
      Header: "Priority",
      accessor: "priority",
      id: "priority",
      Cell: ({ row, value }) => {
        let p = value;
        let badge;

        if (p === "Low") {
          badge = low;
        }
        if (p === "Normal") {
          badge = normal;
        }
        if (p === "High") {
          badge = high;
        }

        return (
          <>
            <span
              className={`inline-block items-center px-2.5 py-1 rounded-full text-xs font-medium ${badge}`}
            >
              {value}
            </span>
          </>
        );
      },
    },
    {
      Header: "",
      id: "actions",
      Cell: ({ row, value }) => {
        return (
          <>
            <Link href={`/ticket/${row.original.id}`}>
              <button className="bg-emerald-800 px-4 py-2 text-white font-semibold rounded-xl hover:bg-gray-800 duration-300">To ticket</button>
            </Link>
          </>
        );
      },
    },
  ]);

  useEffect(() => {
    refetch();

  }, [router.query])

  return (
    <div>
      {status === "loading" && (
        <div className="flex flex-col justify-center items-center h-screen">
          <Loader color="green" size={100} />
        </div>
      )}

      {status === "success" && (
        <>
          <div className="hidden sm:block">
            <Table columns={columns} data={data.tickets} />
          </div>

          <div className="sm:hidden">
            <TicketsMobileList tickets={data.tickets} />
          </div>
        </>
      )}
    </div>
  );
}
