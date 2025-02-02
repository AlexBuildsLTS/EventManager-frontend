import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  try {
    // Connect to the database
    await prisma.$connect()
    console.log('Connected to the database')

    // Perform database operations here
    const users = await prisma.user.findMany()
    console.log(users);


  } catch (error) {
    console.error('Error:', error)
  } finally {
    // Disconnect from the database
    await prisma.$disconnect()
    console.log('Disconnected from the database')
  }
}


main()
  .catch((e) => {
    throw e
  })
  .finally(async () => {
    await prisma.$disconnect()
  })