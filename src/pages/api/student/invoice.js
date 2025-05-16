import { prisma } from '../../../lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';


export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get authenticated session
    const session = await getServerSession(req, res, authOptions);

    if (!session || !session.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Check role
    if (session.user.role !== 'student' && session.user.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden - Not authorized' });
    }

    // Get userId from query or session
    const userId = parseInt(req.query.userId || session.user.id, 10);

    // Verify the user is accessing their own data
    if (
      session.user.id.toString() !== userId.toString() &&
      session.user.role !== 'admin'
    ) {
      return res
        .status(403)
        .json({ error: 'Forbidden - Not authorized to access this data' });
    }

    const invoices = await prisma.invoice.findMany({
      where: { studentId: userId },
      include: {
        student: {
          select: {
            name: true,
            department: {
              select: {
                name: true,
              },
            },
            class: {
              select: {
                name: true,
              },
            },
            section: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      orderBy: { due_date: 'desc' },
    });

    // Transform invoices for frontend
    const transformedInvoices = invoices.map((invoice) => {
      // Create academic year string based on due date
      const dueDate = new Date(invoice.due_date);
      const month = dueDate.getMonth();
      const year = dueDate.getFullYear();

      // Calculate academic year (e.g., "2023-2024")
      let academicYear;
      if (month >= 8) {
        // If due date is between Sep-Dec
        academicYear = `${year}-${year + 1}`;
      } else {
        academicYear = `${year - 1}-${year}`;
      }

      // Determine semester
      let semester;
      if (month >= 8 || month <= 0) {
        // Sep-Jan
        semester = 'Fall';
      } else if (month >= 1 && month <= 4) {
        // Feb-May
        semester = 'Spring';
      } else {
        // Jun-Aug
        semester = 'Summer';
      }

      return {
        id: invoice.id,
        invoiceNumber: invoice.invoice_number,
        amount: invoice.amount,
        status: invoice.paid ? 'Paid' : 'Unpaid',
        dueDate: invoice.due_date.toISOString(),
        issueDate: invoice.generated_at.toISOString(),
        student: {
          name: invoice.student.name,
          department: invoice.student.department?.name || 'N/A',
          class: invoice.student.class?.name || 'N/A',
          section: invoice.student.section?.name || 'N/A',
        },
        academicYear,
        semester,
        description: `${semester} ${year} - Tuition Fee`,
      };
    });

    res.status(200).json(transformedInvoices);
  } catch (error) {
    console.error('Error fetching student invoices:', error);
    res
      .status(500)
      .json({ error: 'Internal server error', details: error.message });
  } finally {
    await prisma.$disconnect();
  }
}
