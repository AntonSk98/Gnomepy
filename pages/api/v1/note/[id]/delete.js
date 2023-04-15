import {prisma} from "../../../../../prisma/prisma";

export default async function DeleteNotebook(req, res) {
  const id = req.query.id;

  try {
    await prisma.notes.delete({
      where: { id: Number(id) }
    });

    return res.status(200).json({status: 'Success', message: 'Successfully removed the notebook!'});
  } catch (error) {
    console.error('Unexpected error occurred', error);
    return res.status(500).json({status: 'Fail', message: 'Try again later. We are having some troubles...'});
  }
}