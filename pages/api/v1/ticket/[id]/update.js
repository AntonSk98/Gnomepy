const { prisma } = require("../../../../../prisma/prisma");

export default async function UpdateTicket(req, res) {

  const { id } = req.query

  const  { title, note, detail } = req.body

  try {
    await prisma.ticket.update({
      where: { id: Number(id) },
      data: {
        updatedAt: new Date().toISOString(),
        details: detail,
        note,
        title
      },
    });
    res.status(201).json({ success: true, message: "Issue was successfully updated!" });
  } catch (error) {
    console.error(error);
    return res.status(500);
  }
}
