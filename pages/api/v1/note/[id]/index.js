const { prisma } = require("../../../../../prisma/prisma");

export default async function handler(req, res) {

  const id = req.query.id;

  try {
    const data = await prisma.notes.findUnique({
      where: { id: Number(id) },
    });

    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error });
  }
}
