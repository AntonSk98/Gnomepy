const { prisma } = require("../../../../../../prisma/prisma");

import { IncomingForm } from "formidable";
import fs from "fs";
import { createNecessaryDirectoriesSync } from "filesac";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function UploadFile(req, res) {

  const { id } = req.query;

  const uploadPath = `./storage/tickets/${id}`;
  await createNecessaryDirectoriesSync(`${uploadPath}/x`);

  try {
    const form = new IncomingForm({
      uploadDir: `./storage`,
      keepExtensions: true,
    });

    form.parse(req, (err, fields, files) => {
      const f = files.file;
      const u = `${uploadPath}/${f.originalFilename}`;

      fs.rename(`./storage/${f.newFilename}`, u, async function (err) {
        if (err) throw err;

        try {
          await prisma.ticketFile
            .create({
              data: {
                filename: f.originalFilename,
                ticketId: Number(id),
                path: u,
              },
            })
            .catch((err) => console.error(err));
          return res.status(200).json({ message: "File Uploaded", success: true });
        } catch (error) {
          console.error(error);
          return res.status(500).json({ message: error, success: false });
        }
      });
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error });
  }
}
