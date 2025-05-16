import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Gemini API with the API key from environment variables
// Make sure your API key is in quotes in the .env file
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Generate a professional leave request notification message based on leave request details
export async function generateLeaveRequestMessage(leaveRequestData) {
  try {
    // Use the gemini-1.5-pro model (updated from gemini-pro)
    // This may need to be adjusted based on the latest available models
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

    const {
      faculty,
      department,
      className,
      section,
      course,
      leaveDate,
      reason,
      status,
    } = leaveRequestData;

    // Format date for better readability
    const formattedDate = new Date(leaveDate).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    console.log('Creating prompt for Gemini with data:', {
      faculty,
      department,
      className,
      section,
      course,
    });

    // Create the prompt for Gemini
    const prompt = `
    Write a professional message for a leave request notification with the following details:
    - Faculty member: ${faculty.name}
    - Department: ${department.name}
    - Class: ${className}
    - Section: ${section}
    - Course: ${course.name} (${course.code})
    - Leave Date: ${formattedDate}
    - Reason: ${reason}
    - Status: ${status}
    
    Write the message in a professional tone suitable for an academic institution. The message should be concise but complete.
    Return only the message content with no additional explanation or formatting. Use appropriate paragraph breaks.
    `;

    console.log('Prompt being sent to Gemini:\n', prompt);

    // Generate content
    const result = await model.generateContent(prompt);
    console.log('Gemini API call complete, getting response');

    const response = result.response;
    // text() is not a Promise in the latest version, so no need for await
    const text = response.text();
    console.log('Generated text from Gemini:', text.substring(0, 100) + '...');

    return {
      subject: `Leave Request: ${faculty.name} for ${course.code} on ${formattedDate}`,
      body: text.trim(),
    };
  } catch (error) {
    console.error('Error generating leave request message with Gemini:', error);
    console.log('Error details:', error.message);
    console.log(
      'Error object:',
      JSON.stringify({
        status: error.status,
        statusText: error.statusText,
        errorDetails: error.errorDetails,
      })
    );

    // Fallback message if Gemini API fails
    return {
      subject: `Leave Request Notification`,
      body: `Dear Section Advisor,

I would like to inform you that ${
        leaveRequestData.faculty.name
      } has submitted a leave request for ${leaveRequestData.course.code} (${
        leaveRequestData.course.name
      }) on ${new Date(leaveRequestData.leaveDate).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })}.

Department: ${leaveRequestData.department.name}
Class: ${leaveRequestData.className}
Section: ${leaveRequestData.section}
Reason: ${leaveRequestData.reason}
Status: ${leaveRequestData.status}

Please review this request at your earliest convenience.

Regards,
Academic Management System`,
    };
  }
}


// Generate a status update message when leave request status changes
export async function generateLeaveStatusUpdateMessage(leaveRequestData) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

    const {
      faculty,
      department,
      className,
      section,
      course,
      leaveDate,
      reason,
      status,
      comments,
    } = leaveRequestData;

    // Format date for better readability
    const formattedDate = new Date(leaveDate).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    // Create prompt for status update
    const prompt = `
    Write a professional message notifying about a leave request status update with the following details:
    - Faculty member: ${faculty.name}
    - Department: ${department.name}
    - Class: ${className}
    - Section: ${section}
    - Course: ${course.name} (${course.code})
    - Leave Date: ${formattedDate}
    - New Status: ${status}
    ${comments ? `- Comments: ${comments}` : ''}
    
    Write the message in a professional tone suitable for an academic institution. The message should be concise but complete.
    Return only the message content with an additional line of explanation if needed but no formatting. Use appropriate paragraph breaks.
    `;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    return {
      subject: `Leave Request ${status}: ${faculty.name} for ${course.code}`,
      body: text.trim(),
    };
  } catch (error) {
    console.error('Error generating status update message with Gemini:', error);

    // Fallback message if Gemini API fails
    return {
      subject: `Leave Request Status Update`,
      body: `The leave request submitted by ${
        leaveRequestData.faculty.name
      } for ${leaveRequestData.course.code} on ${new Date(
        leaveRequestData.leaveDate
      ).toLocaleDateString()} has been ${leaveRequestData.status.toLowerCase()}.`,
    };
  }
}

// New function to generate notification for students about approved leave
export async function generateStudentLeaveNotification(leaveRequestData) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

    const {
      faculty,
      department,
      className,
      section,
      course,
      leaveDate,
      reason,
      status,
    } = leaveRequestData;

    // Format date for better readability
    const formattedDate = new Date(leaveDate).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    // Create prompt for student notification
    const prompt = `
    Write a professional message to inform students about a faculty leave with the following details:
    - Faculty member: ${faculty.name}
    - Department: ${department.name}
    - Class: ${className}
    - Section: ${section}
    - Course: ${course.name} (${course.code})
    - Leave Date: ${formattedDate}
    
    Write the message in a professional tone appropriate for students. The message should be concise but complete.
    Explain that class won't be held on that day. Return only the message content with no additional explanation or formatting.
    Use appropriate paragraph breaks.
    `;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    return {
      subject: `Class Cancellation: ${course.code} on ${formattedDate}`,
      body: text.trim(),
    };
  } catch (error) {
    console.error('Error generating student notification with Gemini:', error);

    // Fallback message if Gemini API fails
    return {
      subject: `Class Cancellation Notice`,
      body: `Please note that the class for ${
        leaveRequestData.course.code
      } with ${leaveRequestData.faculty.name} on ${new Date(
        leaveRequestData.leaveDate
      ).toLocaleDateString()} has been cancelled due to faculty leave.`,
    };
  }
}
