import prisma from '../../../lib/prisma';

export default async function handler(req, res) {
  // Check if user is authenticated (implement proper auth check)
  // const isAuthenticated = true; // Replace with actual auth check
  // if (!isAuthenticated) {
  //   return res.status(401).json({ error: 'Unauthorized' });
  // }

  try {
    switch (req.method) {
      case 'GET':
        return await getInvoices(req, res);
      case 'POST':
        return await createInvoice(req, res);
      case 'PUT':
        return await updateInvoice(req, res);
      case 'DELETE':
        return await deleteInvoice(req, res);
      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Error in invoices API:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

// Get invoices with optional filters
async function getInvoices(req, res) {
  const { studentId, status, date_from, date_to } = req.query;
  
  // Build filter conditions
  const where = {};
  
  if (studentId) {
    where.studentId = parseInt(studentId);
  }
  
  if (status) {
    where.paid = status === 'paid';
  }
  
  // Date range filter
  if (date_from || date_to) {
    where.due_date = {};
    
    if (date_from) {
      where.due_date.gte = new Date(date_from);
    }
    
    if (date_to) {
      where.due_date.lte = new Date(date_to);
    }
  }
  
  try {
    const invoices = await prisma.invoice.findMany({
      where,
      include: {
        student: true
      },
      orderBy: {
        due_date: 'desc'
      }
    });
    
    return res.status(200).json(invoices);
  } catch (error) {
    console.error('Error fetching invoices:', error);
    return res.status(500).json({ error: 'Failed to fetch invoices' });
  }
}

// Create a new invoice
async function createInvoice(req, res) {
  const { 
    studentId, 
    amount, 
    due_date, 
    paid = false 
  } = req.body;
  
  // Validate required fields
  if (!studentId || !amount || !due_date) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  
  try {
    // Check if student exists
    const student = await prisma.student.findUnique({
      where: { id: parseInt(studentId) }
    });
    
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }
    
    // Generate invoice number
    const invoiceCount = await prisma.invoice.count();
    const invoiceNumber = `INV-${new Date().getFullYear()}-${String(invoiceCount + 1).padStart(3, '0')}`;
    
    // Create the invoice
    const invoice = await prisma.invoice.create({
      data: {
        invoice_number: invoiceNumber,
        studentId: parseInt(studentId),
        amount: parseFloat(amount),
        due_date: new Date(due_date),
        paid: paid === true || paid === 'true'
      },
      include: {
        student: true
      }
    });
    
    return res.status(201).json(invoice);
  } catch (error) {
    console.error('Error creating invoice:', error);
    return res.status(500).json({ error: 'Failed to create invoice' });
  }
}

// Update an existing invoice
async function updateInvoice(req, res) {
  const { id } = req.query;
  const { 
    studentId, 
    amount, 
    due_date, 
    paid 
  } = req.body;
  
  if (!id) {
    return res.status(400).json({ error: 'Invoice ID is required' });
  }
  
  const invoiceId = parseInt(id);
  
  try {
    // Check if invoice exists
    const existingInvoice = await prisma.invoice.findUnique({
      where: { id: invoiceId }
    });
    
    if (!existingInvoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }
    
    // Prepare update data
    const updateData = {};
    
    if (studentId) updateData.studentId = parseInt(studentId);
    if (amount) updateData.amount = parseFloat(amount);
    if (due_date) updateData.due_date = new Date(due_date);
    if (paid !== undefined) updateData.paid = paid === true || paid === 'true';
    
    // Update the invoice
    const updatedInvoice = await prisma.invoice.update({
      where: { id: invoiceId },
      data: updateData,
      include: {
        student: true
      }
    });
    
    return res.status(200).json(updatedInvoice);
  } catch (error) {
    console.error('Error updating invoice:', error);
    return res.status(500).json({ error: 'Failed to update invoice' });
  }
}

// Delete an invoice
async function deleteInvoice(req, res) {
  const { id } = req.query;
  
  if (!id) {
    return res.status(400).json({ error: 'Invoice ID is required' });
  }
  
  const invoiceId = parseInt(id);
  
  try {
    // Check if invoice exists
    const existingInvoice = await prisma.invoice.findUnique({
      where: { id: invoiceId }
    });
    
    if (!existingInvoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }
    
    // Delete the invoice
    await prisma.invoice.delete({
      where: { id: invoiceId }
    });
    
    return res.status(200).json({ message: 'Invoice deleted successfully' });
  } catch (error) {
    console.error('Error deleting invoice:', error);
    return res.status(500).json({ error: 'Failed to delete invoice' });
  }
}

// API Route for marking invoice as paid
export async function markInvoicePaid(req, res) {
  const { id } = req.query;
  
  if (!id) {
    return res.status(400).json({ error: 'Invoice ID is required' });
  }
  
  const invoiceId = parseInt(id);
  
  try {
    // Update invoice to mark as paid
    const updatedInvoice = await prisma.invoice.update({
      where: { id: invoiceId },
      data: { paid: true },
      include: {
        student: true
      }
    });
    
    return res.status(200).json(updatedInvoice);
  } catch (error) {
    console.error('Error marking invoice as paid:', error);
    return res.status(500).json({ error: 'Failed to mark invoice as paid' });
  }
}
