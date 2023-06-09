const { prisma } = require("../../../../../prisma/prisma");
import { getSession } from "next-auth/react";


export default async function GetResolvedIssues(req, res) {
  const session = await getSession({ req });


  try {
    const result = await prisma.ticket.count({
      where: { isComplete: true, userId: Number(session.user.id) },
    });

    res.status(200).json({ result });
  } catch (error) {
    console.error('Unexpected error occurred while getting resolved issues!');
    res.status(500).json({ error });
  }
}
