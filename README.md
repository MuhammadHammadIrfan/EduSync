# EduSync - Academic Management System

EduSync is a comprehensive educational management platform designed to streamline academic operations for universities. This SaaS application connects administrators, faculty members, and students in a unified system for efficient academic management.

![EduSync Logo](public/images/logo.png)

## 🌟 Features

### For Administrators
- **User Management**: Easily add, edit, and manage faculty and students with bulk CSV uploads
- **Department Management**: Organize academic structure with departments, classes, and sections
- **Course Administration**: Manage course catalogs and assign to departments
- **Analytics Dashboard**: View performance metrics, revenue data, and attendance statistics
- **Leave Request Management**: Review and process faculty leave requests
- **Event Management**: Create and distribute campus events to target audiences
- **Messaging System**: Communicate with faculty and students

### For Faculty
- **Class Management**: View assigned courses and class schedules
- **Attendance Tracking**: Mark and manage student attendance
- **Leave Requests**: Submit leave applications with AI-assisted messaging
- **Approve Leaves**: Department heads can approve/reject leave requests
- **Messaging**: Communicate with students and administration
- **Events**: Stay updated on academic and campus events

### For Students
- **Course Access**: View enrolled courses and schedules
- **Attendance Records**: Track attendance across all courses
- **Invoice Management**: View and manage tuition payments
- **Messaging**: Communicate with faculty and administration
- **Events**: Stay updated on relevant campus events

## 🛠️ Technology Stack

- **Frontend**: Next.js, React, TailwindCSS
- **Backend**: Next.js API routes
- **Database**: PostgreSQL (Supabase)
- **ORM**: Prisma
- **Authentication**: NextAuth.js
- **State Management**: React Hooks
- **UI Components**: Shadcn/UI
- **AI Integration**: GoogleAI (Gemini) for enhanced messaging

## 📋 Installation

1. **Clone the repository**
    git clone https://github.com/yourusername/edusync.git cd edusync


2. **Install dependencies**
    npm install


3. **Set up environment variables**
    Create a `.env.local` file with the following variables:
    DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@[YOUR-SUPABASE-URL]:5432/postgres" 
    NEXTAUTH_SECRET="your-nextauth-secret" 
    NEXTAUTH_URL="http://localhost:3000" 
    GOOGLE_AI_API_KEY="your-gemini-api-key"


4. **Initialize the database**
    npx prisma migrate dev npx prisma db seed


5. **Run the development server**
   npm run dev


6. **Access the application**
Open [http://localhost:3000](http://localhost:3000) in your browser

## 📱 User Roles and Access

- **Admin**: Full access to all features including user management, analytics, and system configuration
- **Faculty**: Access to class schedules, attendance management, and leave requests
- **Student**: Access to course information, attendance records, and invoices

## 🔄 Deployment

This application can be easily deployed to Vercel:
    npx vercel


## 📊 Database Schema

The application uses a relational database with the following core entities:
- Users (Admin, Faculty, Student)
- Departments
- Classes and Sections
- Courses
- Attendance Records
- Leave Requests
- Events
- Messages
- Invoices

## 📝 License

[MIT](LICENSE)

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request