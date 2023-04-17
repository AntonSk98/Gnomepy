-- DropForeignKey
ALTER TABLE "TicketFile" DROP CONSTRAINT "TicketFile_ticketId_fkey";

-- AddForeignKey
ALTER TABLE "TicketFile" ADD CONSTRAINT "TicketFile_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "Ticket"("id") ON DELETE CASCADE ON UPDATE CASCADE;
