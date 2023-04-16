const { prisma } = require("../../../../../prisma/prisma");

export default async function updateTicket(req,res) {

  const { id } = req.query

  const  { note, detail } = req.body

  try {
    await prisma.ticket.update({
      where: { id: Number(id) },
      data: {
        updatedAt: new Date().toISOString(),
        details: detail,
        note
      },
    });
    res.status(201).json({ success: true, message: "Issue was successfully updated!" });
  } catch (error) {
    console.error(error);
    return res.status(500);
  }
}
