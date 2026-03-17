const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding data...');

  // Create an Admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  await prisma.user.upsert({
    where: { email: 'admin@expertlyyours.com' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@expertlyyours.com',
      password: adminPassword,
      role: 'ADMIN',
    },
  });

  // Create Seeker
  const seekerPassword = await bcrypt.hash('seeker123', 10);
  const seeker = await prisma.user.upsert({
    where: { email: 'seeker@example.com' },
    update: {},
    create: {
      name: 'Sarah Chen',
      email: 'seeker@example.com',
      password: seekerPassword,
      role: 'SEEKER',
    },
  });

  // Create Experts
  const expertData = [
    {
      name: 'Jane Smith',
      email: 'jane@example.com',
      title: 'B2B SaaS Growth Strategist',
      expertise: 'Growth Strategy, B2B, SaaS, Marketing',
      hourlyRate: 150,
      usefulnessScore: 95,
      linkedin: 'https://linkedin.com/in/janesmith',
    },
    {
      name: 'Michael Chen',
      email: 'michael@example.com',
      title: 'Enterprise Sales Consultant',
      expertise: 'Enterprise Sales, B2B, Negotiation',
      hourlyRate: 200,
      usefulnessScore: 88,
      linkedin: 'https://linkedin.com/in/michaelchen',
      behance: 'https://behance.net/michaelchen'
    },
    {
      name: 'Alex Rivera',
      email: 'alex@example.com',
      title: 'UI/UX Design Director',
      expertise: 'UI/UX, Product Design, Design Systems',
      hourlyRate: 120,
      usefulnessScore: 92,
      linkedin: 'https://linkedin.com/in/alexrivera',
    }
  ];

  for (const data of expertData) {
    const password = await bcrypt.hash('expert123', 10);
    
    // Check if user exists
    let user = await prisma.user.findUnique({ where: { email: data.email } });
    
    if (!user) {
      user = await prisma.user.create({
        data: {
          name: data.name,
          email: data.email,
          password: password,
          role: 'EXPERT',
        },
      });

      await prisma.expertProfile.create({
        data: {
          userId: user.id,
          title: data.title,
          expertise: data.expertise,
          status: 'active',
          hourlyRate: data.hourlyRate,
          usefulnessScore: data.usefulnessScore,
          approvedDate: new Date(),
          linkedinUrl: data.linkedin,
          behanceUrl: data.behance,
          allowsDirectBooking: true,
        },
      });
    }
  }

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
