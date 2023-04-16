const { prisma } = require("../../../../prisma/prisma");

export default async function allTickets(req,res) {
  try {
    await prisma.ticket
      .findMany({
        include: {
          assignedTo: {
            select: { id: true, name: true },
          },
        },
      })
      .then((tickets) => {
        res.status(200).json({ tickets });
      });
  } catch (error) {
    console.error(error);
    res.status(500);
  }
}
