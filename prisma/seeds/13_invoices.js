const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seedInvoices() {
  // Clear existing invoices to avoid duplicates
  await prisma.invoice.deleteMany({});
  console.log('✅ Cleared existing invoices');

  const students = await prisma.student.findMany();
  const invoicesData = [];

  const today = new Date();
  const currentMonth = today.getMonth(); // 0-indexed: 0 = January, 4 = May
  const currentYear = today.getFullYear();

  // Get the current academic year (e.g. 2024-2025)
  const academicYear =
    today.getMonth() > 6
      ? `${currentYear}-${currentYear + 1}`
      : `${currentYear - 1}-${currentYear}`;

  console.log(`Generating invoices for ${students.length} students`);

  let invoiceCounter = 1; // Counter for unique invoice numbers

  for (const student of students) {
    // Generate invoices for the 5 previous months
    for (let i = 1; i <= 5; i++) {
      const dueDate = new Date(currentYear, currentMonth - i, 22);
      const randomAmount = Math.floor(Math.random() * 5000) + 10000;
      const monthName = new Date(
        currentYear,
        currentMonth - i,
        1
      ).toLocaleString('default', { month: 'short' });

      // Format: INV-2024-2025-CS-12345-MAY
      const invoiceNumber = `INV-${academicYear}-${student.id
        .toString()
        .padStart(5, '0')}-${monthName.toUpperCase()}`;

      invoicesData.push({
        invoice_number: invoiceNumber,
        studentId: student.id,
        amount: randomAmount,
        due_date: dueDate,
        paid: Math.random() < 0.9, // 90% chance paid
      });

      invoiceCounter++;
    }

    // Generate invoice for the current month
    const dueDateCurrent = new Date(currentYear, currentMonth, 22);
    const randomAmountCurrent = Math.floor(Math.random() * 5000) + 10000;
    const currentMonthName = today.toLocaleString('default', {
      month: 'short',
    });

    // Format: INV-2024-2025-CS-12345-JUN
    const currentInvoiceNumber = `INV-${academicYear}-${student.id
      .toString()
      .padStart(5, '0')}-${currentMonthName.toUpperCase()}`;

    invoicesData.push({
      invoice_number: currentInvoiceNumber,
      studentId: student.id,
      amount: randomAmountCurrent,
      due_date: dueDateCurrent,
      paid: Math.random() < 0.3, // 30% chance paid
    });

    invoiceCounter++;
  }

  // Insert in batches to avoid memory issues with large datasets
  const batchSize = 1000;
  for (let i = 0; i < invoicesData.length; i += batchSize) {
    const batch = invoicesData.slice(i, i + batchSize);
    await prisma.invoice.createMany({
      data: batch,
      skipDuplicates: true,
    });
    console.log(
      `✅ Inserted batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(
        invoicesData.length / batchSize
      )}`
    );
  }

  console.log(`✅ Invoices seeded: ${invoicesData.length} total.`);
}

seedInvoices()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
