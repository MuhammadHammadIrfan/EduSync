const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seedClassEnrollment() {
  const classes = await prisma.class.findMany();
  const courseClasses = await prisma.courseClass.findMany();

  const classEnrollmentData = [];

  for (const cls of classes) {
    const relevantCourses = courseClasses.filter((cc) => cc.classId === cls.id);

    for (const course of relevantCourses) {
      classEnrollmentData.push({
        classId: cls.id,
        courseId: course.courseId,
      });
    }
  }

  await prisma.classEnrollment.createMany({
    data: classEnrollmentData,
    skipDuplicates: true,
  });

  console.log('✅ Class enrollments seeded successfully.');
}

seedClassEnrollment()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
