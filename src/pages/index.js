import Link from 'next/link';
import Head from 'next/head';
import { Button } from '@/components/ui/button';
import {
  BookOpen,
  Users,
  ClipboardList,
  ArrowRight,
  Calendar,
  MessageSquare,
  Bell,
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className='flex min-h-screen flex-col container mx-auto'>
      <Head>
        <title>EduSync - Automating Education, Simplifying Management</title>
        <meta
          name='description'
          content='EduSync is a SaaS platform that streamlines academic operations for universities'
        />
      </Head>

      <header className='sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
        <div className='container flex h-16 items-center justify-between'>
          <div className='flex items-center gap-2'>
            <BookOpen className='h-6 w-6 text-primary' />
            <span className='text-xl font-bold'>EduSync</span>
          </div>
          <Link href='/login'>
            <Button>Login</Button>
          </Link>
        </div>
      </header>
      <main className='flex-1'>
        {/* Hero Section */}
        <section className='w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-b from-background to-muted'>
          <div className='container px-4 md:px-6'>
            <div className='flex flex-col items-center space-y-4 text-center'>
              <div className='space-y-2'>
                <h1 className='text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none'>
                  EduSync
                </h1>
                <p className='mx-auto max-w-[700px] text-muted-foreground md:text-xl'>
                  Automating Education, Simplifying Management
                </p>
              </div>
              <div className='space-x-4'>
                <Link href='/login'>
                  <Button size='lg' className='mt-4'>
                    Login <ArrowRight className='ml-2 h-4 w-4' />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Roles Section */}
        <section className='w-full py-12 md:py-24 lg:py-32 bg-background'>
          <div className='container px-4 md:px-6 mx-auto w-fit'>
            <div className='flex flex-col items-center justify-center space-y-4 text-center'>
              <div className='space-y-2'>
                <h2 className='text-3xl font-bold tracking-tighter sm:text-5xl'>
                  Streamlined for Every Role
                </h2>
                <p className='mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed'>
                  Our platform is designed to meet the unique needs of
                  administrators, faculty, and students.
                </p>
              </div>
            </div>
            <div className='mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12'>
              {/* Admin Card */}
              <div className='rounded-xl border bg-card p-6 shadow-sm transition-all hover:shadow-md'>
                <div className='mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10'>
                  <Users className='h-6 w-6 text-primary' />
                </div>
                <h3 className='text-xl font-bold'>Administrators</h3>
                <p className='mt-2 text-muted-foreground'>
                  Upload CSVs, manage faculty and students, automate invoices
                  and events.
                </p>
                <ul className='mt-4 space-y-2 text-sm'>
                  <li className='flex items-center'>
                    <ClipboardList className='mr-2 h-4 w-4 text-primary' />
                    <span>Streamlined data management</span>
                  </li>
                  <li className='flex items-center'>
                    <Users className='mr-2 h-4 w-4 text-primary' />
                    <span>User role administration</span>
                  </li>
                  <li className='flex items-center'>
                    <Bell className='mr-2 h-4 w-4 text-primary' />
                    <span>Automated notifications</span>
                  </li>
                </ul>
              </div>

              {/* Faculty Card */}
              <div className='rounded-xl border bg-card p-6 shadow-sm transition-all hover:shadow-md'>
                <div className='mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10'>
                  <BookOpen className='h-6 w-6 text-primary' />
                </div>
                <h3 className='text-xl font-bold'>Faculty</h3>
                <p className='mt-2 text-muted-foreground'>
                  View schedules, mark attendance, apply for leaves with
                  AI-assisted messaging.
                </p>
                <ul className='mt-4 space-y-2 text-sm'>
                  <li className='flex items-center'>
                    <Calendar className='mr-2 h-4 w-4 text-primary' />
                    <span>Intuitive scheduling</span>
                  </li>
                  <li className='flex items-center'>
                    <ClipboardList className='mr-2 h-4 w-4 text-primary' />
                    <span>Attendance tracking</span>
                  </li>
                  <li className='flex items-center'>
                    <MessageSquare className='mr-2 h-4 w-4 text-primary' />
                    <span>AI-assisted communication</span>
                  </li>
                </ul>
              </div>

              {/* Student Card */}
              <div className='rounded-xl border bg-card p-6 shadow-sm transition-all hover:shadow-md'>
                <div className='mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10'>
                  <Calendar className='h-6 w-6 text-primary' />
                </div>
                <h3 className='text-xl font-bold'>Students</h3>
                <p className='mt-2 text-muted-foreground'>
                  Get schedules, receive automated event/invoice notifications.
                </p>
                <ul className='mt-4 space-y-2 text-sm'>
                  <li className='flex items-center'>
                    <Calendar className='mr-2 h-4 w-4 text-primary' />
                    <span>Personal schedule access</span>
                  </li>
                  <li className='flex items-center'>
                    <Bell className='mr-2 h-4 w-4 text-primary' />
                    <span>Event notifications</span>
                  </li>
                  <li className='flex items-center'>
                    <ClipboardList className='mr-2 h-4 w-4 text-primary' />
                    <span>Invoice management</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className='w-full py-12 md:py-24 lg:py-32 bg-muted'>
          <div className='container px-4 md:px-6'>
            <div className='flex flex-col items-center justify-center space-y-4 text-center'>
              <div className='space-y-2'>
                <h2 className='text-3xl font-bold tracking-tighter sm:text-5xl'>
                  Why Choose EduSync?
                </h2>
                <p className='mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed'>
                  Our platform is built with modern education needs in mind.
                </p>
              </div>
            </div>
            <div className='mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3'>
              {/* Feature 1 */}
              <div className='flex flex-col items-center space-y-2 rounded-lg p-4 text-center'>
                <div className='flex h-12 w-12 items-center justify-center rounded-full bg-primary/10'>
                  <BookOpen className='h-6 w-6 text-primary' />
                </div>
                <h3 className='text-xl font-bold'>Intuitive Interface</h3>
                <p className='text-muted-foreground'>
                  Clean design that's easy to navigate for all users.
                </p>
              </div>

              {/* Feature 2 */}
              <div className='flex flex-col items-center space-y-2 rounded-lg p-4 text-center'>
                <div className='flex h-12 w-12 items-center justify-center rounded-full bg-primary/10'>
                  <Bell className='h-6 w-6 text-primary' />
                </div>
                <h3 className='text-xl font-bold'>Automated Workflows</h3>
                <p className='text-muted-foreground'>
                  Reduce manual tasks with intelligent automation.
                </p>
              </div>

              {/* Feature 3 */}
              <div className='flex flex-col items-center space-y-2 rounded-lg p-4 text-center'>
                <div className='flex h-12 w-12 items-center justify-center rounded-full bg-primary/10'>
                  <MessageSquare className='h-6 w-6 text-primary' />
                </div>
                <h3 className='text-xl font-bold'>Seamless Communication</h3>
                <p className='text-muted-foreground'>
                  Connect all stakeholders on a single platform.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className='border-t bg-background'>
        <div className='container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0'>
          <div className='flex items-center gap-2'>
            <BookOpen className='h-5 w-5 text-primary' />
            <p className='text-sm text-muted-foreground'>
              © 2024 EduSync. All rights reserved.
            </p>
          </div>
          <div className='flex gap-4 text-sm text-muted-foreground'>
            <Link href='#' className='hover:underline'>
              Terms
            </Link>
            <Link href='#' className='hover:underline'>
              Privacy
            </Link>
            <Link href='#' className='hover:underline'>
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
