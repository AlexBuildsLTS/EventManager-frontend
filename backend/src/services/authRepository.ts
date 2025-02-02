import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createUser = async (userData) => {
  return await prisma.user.create({
    data: userData,
  });
};


export const findUserByEmail = async (email) => {
    return await prisma.user.findUnique({
        where: {
            email
        }
    })
}
