const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seedFacultyCourses() {
  const faculty = await prisma.faculty.findMany();
  const courses = await prisma.course.findMany();

  const facultyCoursesData = [];

  for (const fac of faculty) {
    const relevantCourses = courses.filter((course) => course.departmentId === fac.departmentId).slice(0, 3);

    for (const course of relevantCourses) {
      facultyCoursesData.push({
        facultyId: fac.id,
        courseId: course.id,
      });
    }
  }

  await prisma.facultyCourse.createMany({
    data: facultyCoursesData,
    skipDuplicates: true,
  });

  console.log('✅ Faculty courses seeded successfully.');
}

seedFacultyCourses()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });


