const { prisma } = require("../../../../../prisma/prisma");

export default async function completeTicket(req, res) {
  const { id } = req.query;

  const { status } = req.body;

  try {
    await prisma.ticket.update({
      where: { id: Number(id) },
      data: {
        updatedAt: new Date().toISOString(),
        isComplete: status,
      },
    });

    res.status(200).json({ message: "Status updated successfully!" });
  } catch (error) {
    console.error("Unexpected error occurred: ", error.message);
    return res.status(500).json({status: "Error", message: error.message});
  }
}
