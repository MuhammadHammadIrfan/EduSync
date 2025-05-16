// Setup type definitions for Supabase Runtime API
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

console.log("Starting invoice generation function");

// Format date function helper
function formatDate(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

Deno.serve(async (req) => {
  try {
    // Get current environment
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    
    if (!supabaseUrl || !supabaseKey) {
      return new Response(
        JSON.stringify({ error: "Missing environment variables" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
    
    // Initialize Supabase client with service role key
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Get the current date for generating invoice metadata
    const today = new Date();
    const currentMonth = today.getMonth() + 1; // 1-12
    const currentYear = today.getFullYear();
    
    // Format as YYYY-MM-DD
    const todayFormatted = formatDate(today);
    
    // Set due date to 22nd of current month
    const dueDate = new Date(currentYear, today.getMonth(), 22);
    
    // If today is after the 22nd, set due date to 22nd of next month
    if (today.getDate() > 22) {
      dueDate.setMonth(dueDate.getMonth() + 1);
    }
    
    const dueDateFormatted = formatDate(dueDate);
    
    console.log(`Generating invoices for ${todayFormatted}, due on ${dueDateFormatted}`);
    
    // Fetch all students
    const { data: students, error: studentError } = await supabase
      .from("Student")
      .select("id, departmentId, classId, sectionId")
      .order("id");
    
    if (studentError) {
      console.error("Error fetching students:", studentError);
      return new Response(
        JSON.stringify({ error: "Failed to fetch students", details: studentError }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
    
    console.log(`Found ${students?.length || 0} students`);
    
    // Determine semester based on month
    let semester;
    if (currentMonth >= 9 || currentMonth <= 1) {
      // Sep-Jan
      semester = "Fall";
    } else if (currentMonth >= 2 && currentMonth <= 5) {
      // Feb-May
      semester = "Spring";
    } else {
      // Jun-Aug
      semester = "Summer";
    }
    
    // Generate invoices for all students
    const invoices = students?.map((student, index) => {
      // Calculate amount based on department/program
      // You can add complex logic here based on department, class, etc.
      const baseAmount = 15000; // Base tuition
      
      // Generate unique invoice number
      const invoiceNumber = `INV-${currentYear}${currentMonth.toString().padStart(2, "0")}-${(index + 1).toString().padStart(4, "0")}`;
      
      return {
        invoice_number: invoiceNumber,
        studentId: student.id,
        amount: baseAmount,
        generated_at: new Date().toISOString(),
        due_date: dueDate.toISOString(),
        paid: false,
        description: `${semester} ${currentYear} - Monthly Tuition Fee`,
      };
    }) || [];
    
    // Insert the invoices into the database
    const { data: insertedInvoices, error: insertError } = await supabase
      .from("Invoice")
      .insert(invoices)
      .select();
    
    if (insertError) {
      console.error("Error inserting invoices:", insertError);
      return new Response(
        JSON.stringify({ error: "Failed to insert invoices", details: insertError }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
    
    console.log(`Successfully inserted ${insertedInvoices?.length || 0} invoices`);
    
    return new Response(
      JSON.stringify({
        success: true,
        message: `Generated ${insertedInvoices?.length || 0} invoices for ${todayFormatted}`,
        invoiceCount: insertedInvoices?.length || 0,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Unexpected error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error", details: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});