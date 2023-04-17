import { useQuery } from "react-query";
import TicketDetail from "../../components/TicketDetail";
import { useRouter } from "next/router";
import {RotatingLines} from "react-loader-spinner";
import {errorNotification} from "../../notifications/notifications";

export default function Ticket() {
  const router = useRouter();

  const fetchTicketById = async () => {
    try {
      const id = router.query.id;
      const res = await fetch(`/api/v1/ticket/${id}`);
      !res.ok && errorNotification('Unexpected error occurred while fetching the ticket details');
      return res.json();
    } catch (e) {
      errorNotification('Please, try again later...')
    }

  };

  const { data, status, refetch } = useQuery("fetchTicketById", fetchTicketById);

  function getTicket() {
    return data.tickets;
  }

  const handleClick = () => {
    refetch();
  };

  return (
    <div>
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
          <h2 className="text-2xl font-bold text-emerald-800"> Error occurred while fetching data. Looks like we are down... </h2>
      )}

      {status === "success" && (
        <div>
          <TicketDetail ticket={getTicket()} callback={handleClick}/>
        </div>
      )}
    </div>
  );
}
