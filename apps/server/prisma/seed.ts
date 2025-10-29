import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const data = [
    // Paris
    { name: 'Paris', country: 'France' },
    { name: 'Paris', country: 'United States' },
    { name: 'Paris', country: 'Canada' },

    // London
    { name: 'London', country: 'United Kingdom' },
    { name: 'London', country: 'Canada' },
    { name: 'London', country: 'United States' },

    // Dublin
    { name: 'Dublin', country: 'Ireland' },
    { name: 'Dublin', country: 'United States' },
    { name: 'Dublin', country: 'Australia' },

    // Cambridge
    { name: 'Cambridge', country: 'United Kingdom' },
    { name: 'Cambridge', country: 'United States' },
    { name: 'Cambridge', country: 'New Zealand' },

    // Sydney
    { name: 'Sydney', country: 'Australia' },
    { name: 'Sydney', country: 'Canada' },
    { name: 'Sydney', country: 'United States' },

    // Manchester
    { name: 'Manchester', country: 'United Kingdom' },
    { name: 'Manchester', country: 'United States' },
    { name: 'Manchester', country: 'Jamaica' },

    // Kingston
    { name: 'Kingston', country: 'Jamaica' },
    { name: 'Kingston', country: 'Canada' },
    { name: 'Kingston', country: 'United States' },

    // Hamilton
    { name: 'Hamilton', country: 'Canada' },
    { name: 'Hamilton', country: 'New Zealand' },
    { name: 'Hamilton', country: 'United States' },

    // Birmingham
    { name: 'Birmingham', country: 'United Kingdom' },
    { name: 'Birmingham', country: 'United States' },
    { name: 'Birmingham', country: 'New Zealand' },

    // Venice
    { name: 'Venice', country: 'Italy' },
    { name: 'Venice', country: 'United States' },

    // Naples
    { name: 'Naples', country: 'Italy' },
    { name: 'Naples', country: 'United States' },

    // Florence
    { name: 'Florence', country: 'Italy' },
    { name: 'Florence', country: 'United States' },

    // Rome
    { name: 'Rome', country: 'Italy' },
    { name: 'Rome', country: 'United States' },

    // Berlin
    { name: 'Berlin', country: 'Germany' },
    { name: 'Berlin', country: 'United States' },

    // Lisbon
    { name: 'Lisbon', country: 'Portugal' },
    { name: 'Lisbon', country: 'United States' },

    // Santiago
    { name: 'Santiago', country: 'Chile' },
    { name: 'Santiago', country: 'Spain' },
    { name: 'Santiago', country: 'Dominican Republic' },

    // Alexandria
    { name: 'Alexandria', country: 'Egypt' },
    { name: 'Alexandria', country: 'United States' },

    // Lima
    { name: 'Lima', country: 'Peru' },
    { name: 'Lima', country: 'United States' },

    // Cairo
    { name: 'Cairo', country: 'Egypt' },
    { name: 'Cairo', country: 'United States' },

    // Granada
    { name: 'Granada', country: 'Spain' },
    { name: 'Granada', country: 'Nicaragua' },
    { name: 'Granada', country: 'Colombia' },

    // San Jose
    { name: 'San Jose', country: 'Costa Rica' },
    { name: 'San Jose', country: 'United States' },
    { name: 'San Jose', country: 'Philippines' },

    // Victoria
    { name: 'Victoria', country: 'Australia' },
    { name: 'Victoria', country: 'Canada' },
    { name: 'Victoria', country: 'Seychelles' },

    // Georgetown
    { name: 'Georgetown', country: 'Guyana' },
    { name: 'Georgetown', country: 'United States' },
    { name: 'Georgetown', country: 'Malaysia' },

    // St. John’s
    { name: "St. John's", country: 'Antigua and Barbuda' },
    { name: "St. John's", country: 'Canada' },

    // Santa Cruz
    { name: 'Santa Cruz', country: 'Bolivia' },
    { name: 'Santa Cruz', country: 'United States' },
    { name: 'Santa Cruz', country: 'Chile' },

    // Valencia
    { name: 'Valencia', country: 'Spain' },
    { name: 'Valencia', country: 'Venezuela' },
    { name: 'Valencia', country: 'Philippines' },

    // Bucharest
    { name: 'Bucharest', country: 'Romania' },
  ];

  for (const city of data) {
    // Upsert by unique tuple (name, state, country) would be ideal; here we simply create if not exists by name+country heuristic
    const existing = await prisma.city.findFirst({
      where: { name: city.name, country: city.country },
    });
    if (!existing) {
      await prisma.city.create({ data: city });
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
