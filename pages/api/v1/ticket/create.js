const { prisma } = require("../../../../prisma/prisma");

export default async function CreateNewIssue(req, res) {
  const { title, responsible, email, details, priority } = req.body;
  try {
    await prisma.ticket.create({
      data: {
        title,
        details,
        priority,
        email,
        assignedTo: {
          connect: { id: Number(responsible.id) },
        },
        isComplete: Boolean(false)
      },
    });
    res.status(201).json({ message: "New issue created successfully" });
  } catch (error) {
    console.error("Unexpected error occurred while creating a new issue: ", error.message);
    res.status(500).json({ status: "Error", message: error.message });
  }
}
