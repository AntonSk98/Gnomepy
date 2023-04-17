const { prisma } = require("../../../../../prisma/prisma");

export default async function getById(req, res) {
  const { id } = req.query;

  try {
    await prisma.ticket
      .findUnique({
        where: {
          id: Number(id),
        },
        include: {
          assignedTo: {
            select: { id: true, name: true, email: true },
          },
        },
      })
      .then((tickets) => {
        res.status(200).json({ tickets });
      });
  } catch (error) {
    console.error(error);
    return res.status(404);
  }
}
