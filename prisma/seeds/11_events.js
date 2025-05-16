const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const today = new Date('2025-05-12');

  const pastEvents = [
    {
      title: 'Tech Talk: Future of AI',
      description:
        'A deep dive into upcoming trends in Artificial Intelligence.',
      event_date: new Date('2025-03-10'),
    },
    {
      title: 'Web Dev Bootcamp Recap',
      description: 'Final session wrap-up and project demos.',
      event_date: new Date('2025-03-15'),
    },
    {
      title: 'Data Science Meetup',
      description: 'Community meetup on data modeling and visualization.',
      event_date: new Date('2025-04-02'),
    },
    {
      title: 'Cybersecurity Awareness Workshop',
      description: 'Best practices for protecting your digital identity.',
      event_date: new Date('2025-04-09'),
    },
    {
      title: 'Hackathon Awards Ceremony',
      description: 'Announcing winners of our annual 48-hour coding challenge.',
      event_date: new Date('2025-04-14'),
    },
    {
      title: 'ReactJS Crash Course',
      description: 'Beginner’s guide to building UIs with React.',
      event_date: new Date('2025-04-17'),
    },
    {
      title: 'LinkedIn Optimization Session',
      description: 'Tips to make your profile stand out to recruiters.',
      event_date: new Date('2025-04-23'),
    },
    {
      title: 'Machine Learning Model Review',
      description: 'Peer review and critique of ML models built by students.',
      event_date: new Date('2025-04-25'),
    },
    {
      title: 'Alumni Networking Night',
      description: 'Connect with graduates and industry professionals.',
      event_date: new Date('2025-05-05'),
    },
    {
      title: 'Semester Feedback Forum',
      description:
        'Open discussion with students and faculty on course feedback.',
      event_date: new Date('2025-05-10'),
    },
  ];

  const futureEvents = [
    {
      title: 'Startup Pitch Night',
      description: 'Students pitch their startup ideas to a panel of judges.',
      event_date: new Date('2025-06-05'),
    },
    {
      title: 'Cloud Computing Basics',
      description: 'An intro session on AWS, Azure, and cloud infrastructure.',
      event_date: new Date('2025-06-09'),
    },
    {
      title: 'Women in Tech Panel',
      description: 'Celebrating women making waves in the tech industry.',
      event_date: new Date('2025-06-13'),
    },
    {
      title: 'DevOps Workshop',
      description: 'Hands-on session on CI/CD and deployment pipelines.',
      event_date: new Date('2025-06-16'),
    },
    {
      title: 'Figma UI/UX Design Session',
      description: 'Design beautiful and functional interfaces with Figma.',
      event_date: new Date('2025-06-19'),
    },
    {
      title: 'AI Ethics Discussion',
      description: 'Exploring the ethics of AI in modern society.',
      event_date: new Date('2025-06-24'),
    },
    {
      title: 'Resume Building Workshop',
      description: 'Create compelling resumes tailored for tech roles.',
      event_date: new Date('2025-06-27'),
    },
    {
      title: 'Kubernetes in Practice',
      description: 'Deploying and managing containers at scale.',
      event_date: new Date('2025-07-02'),
    },
    {
      title: 'Mobile App Showcase',
      description: 'Demos of student-built mobile applications.',
      event_date: new Date('2025-07-13'),
    },
    {
      title: 'Graduation Ceremony 2025',
      description: 'Celebrating the accomplishments of our graduating batch.',
      event_date: new Date('2025-07-14'),
    },
  ];

  const eventsData = [...pastEvents, ...futureEvents].map((event) => ({
    ...event,
    created_by_admin: 1,
    created_at: new Date(),
    updated_at: new Date(),
  }));

  await prisma.event.createMany({
    data: eventsData,
    skipDuplicates: true,
  });

  console.log('✅ 20 real events seeded (10 past, 10 upcoming).');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
