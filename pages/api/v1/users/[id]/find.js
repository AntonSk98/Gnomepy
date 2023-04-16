import {prisma} from "../../../../../prisma/prisma";

export default async function FindUserById(req, res) {
    try {
        const { id } = req.query;

        const user = await prisma.user.findUnique({
            where: {
                id: Number(id)
            }
        });

        return res.json({ user, failed: false });
    } catch (error) {
        console.error('Unexpected error occurred while getting user by id:', error)
        return res.status(500).json({status: 'failed', message: 'Unexpected error occurred while fetching the user...'})
    }

}