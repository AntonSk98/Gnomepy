import {prisma} from "../../../../../prisma/prisma";

export default async function DeleteTicket(req, res) {
    const id = req.query.id;

    try {
        await prisma.ticket.delete({
            where: { id: Number(id) }
        });

        return res.status(200).json({status: 'Success', message: 'Successfully deleted the ticket!'});
    } catch (error) {
        console.error('Unexpected error occurred', error);
        return res.status(500).json({status: 'Fail', message: 'Try again later. We are having some troubles...'});
    }
}