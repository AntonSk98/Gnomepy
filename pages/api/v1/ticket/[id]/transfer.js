const { prisma } = require("../../../../../prisma/prisma");

export default async function TransferTicket(req, res) {
  const { id } = req.query;
  const { user } = req.body;

  try {
    await prisma.ticket.update({
      where: { id: Number(id) },
      data: {
        updatedAt: new Date().toISOString(),
        assignedTo: {
          connect: { id: Number(user.id) },
        },
      },
    });

    res.status(200).json({ message: "Ticket Transferred" });
  } catch (error) {
    console.error(error);
    return res.status(500);
  }
}
