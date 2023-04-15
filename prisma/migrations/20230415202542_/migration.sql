-- DropForeignKey
ALTER TABLE "Notes" DROP CONSTRAINT "Notes_userId_fkey";

-- DropForeignKey
ALTER TABLE "Todos" DROP CONSTRAINT "Todos_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserFile" DROP CONSTRAINT "UserFile_userId_fkey";

-- AddForeignKey
ALTER TABLE "UserFile" ADD CONSTRAINT "UserFile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notes" ADD CONSTRAINT "Notes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Todos" ADD CONSTRAINT "Todos_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
