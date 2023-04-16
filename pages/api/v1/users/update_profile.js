import {prisma} from "../../../../prisma/prisma";

export default async function UpdateUserProfile(req, res) {
    const { id, name, email } = req.body;

    try {
        await prisma.user.update({
            where: { id: Number(id) },
            data: {
                name,
                email
            },
        });
        res
            .status(200)
            .json({ status: 'success', message: 'Profile data successfully updated!' });
    } catch (error) {
        console.error('Unexpected error occurred while updating profile data');
        res.status(500).json({ status: 'fail', message: 'Unexpected error occurred while updating profile data!' });
    }
}