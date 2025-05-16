/*
  Warnings:

  - You are about to drop the `StudentCourseEnrollment` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "StudentCourseEnrollment" DROP CONSTRAINT "StudentCourseEnrollment_courseId_fkey";

-- DropForeignKey
ALTER TABLE "StudentCourseEnrollment" DROP CONSTRAINT "StudentCourseEnrollment_studentId_fkey";

-- DropTable
DROP TABLE "StudentCourseEnrollment";

-- CreateTable
CREATE TABLE "ClassEnrollment" (
    "id" SERIAL NOT NULL,
    "classId" INTEGER NOT NULL,
    "courseId" INTEGER NOT NULL,

    CONSTRAINT "ClassEnrollment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ClassEnrollment_classId_courseId_key" ON "ClassEnrollment"("classId", "courseId");

-- AddForeignKey
ALTER TABLE "ClassEnrollment" ADD CONSTRAINT "ClassEnrollment_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassEnrollment" ADD CONSTRAINT "ClassEnrollment_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
