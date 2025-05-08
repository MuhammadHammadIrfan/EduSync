/*
  Warnings:

  - A unique constraint covering the columns `[courseClassId,sectionId]` on the table `CourseSection` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `courseClassId` to the `CourseSection` table without a default value. This is not possible if the table is not empty.
  - Added the required column `classId` to the `LeaveRequest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `courseId` to the `LeaveRequest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `departmentId` to the `LeaveRequest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sectionId` to the `LeaveRequest` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "CourseSection_courseId_sectionId_key";

-- AlterTable
ALTER TABLE "CourseSection" ADD COLUMN     "courseClassId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "LeaveRequest" ADD COLUMN     "classId" INTEGER NOT NULL,
ADD COLUMN     "courseId" INTEGER NOT NULL,
ADD COLUMN     "departmentId" INTEGER NOT NULL,
ADD COLUMN     "sectionId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "CourseSection_courseClassId_sectionId_key" ON "CourseSection"("courseClassId", "sectionId");

-- AddForeignKey
ALTER TABLE "LeaveRequest" ADD CONSTRAINT "LeaveRequest_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeaveRequest" ADD CONSTRAINT "LeaveRequest_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeaveRequest" ADD CONSTRAINT "LeaveRequest_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "Section"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeaveRequest" ADD CONSTRAINT "LeaveRequest_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseSection" ADD CONSTRAINT "CourseSection_courseClassId_fkey" FOREIGN KEY ("courseClassId") REFERENCES "CourseClass"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
