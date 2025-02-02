import { Role, User } from '@prisma/client';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import * as path from 'path';
import { number, string, z } from 'zod';
const prisma = new PrismaClient();

const createUserSchema = z.object({
  firstName: string().min(2),
  lastName: string().min(2),
  email: string().email(),
  password: string().min(6),
  role: z.nativeEnum(Role).optional(),
  title: string().optional(),
  userLevel: number().int().min(1).max(9).optional(),
  avatar:   string().url().optional(),
});

const updateUserSchema = createUserSchema.partial();

// User business logic
class UserService {
  async createUser(data: z.infer<typeof createUserSchema>): Promise<User> {
    const validatedData = createUserSchema.parse(data);
      const hashedPassword = await bcrypt.hash(validatedData.password, 10);

    return prisma.user.create({
        data: {
          ...validatedData,
          password: hashedPassword,
        },
      });
    }

  async updateUser(id: string, data: z.infer<typeof updateUserSchema>): Promise<User> {
    const validatedData = updateUserSchema.parse(data);
    const hashedPassword = data.password ? await bcrypt.hash(data.password, 10) : undefined;

    return prisma.user.update({
      where: { id },
      data: { ...validatedData, password: hashedPassword },
    });
  }

  async deleteUser(id: string): Promise<User> {
    return prisma.user.delete({ where: { id } });
  }


  async login(email: string, password?: string): Promise<Omit<User, 'password'>> {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new Error('Invalid credentials');
    }

    if (password) {
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        throw new Error('Invalid credentials');
      }
    }

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async getUserById(id: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { id } });
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { email } });
  }
  async getUsers(): Promise<User[]> {
    return prisma.user.findMany();
  }

  async exportUsersToCSV(): Promise<string> {
    const users = await this.getUsers();
    const filePath = path.join(__dirname, '..', '..', 'public', 'users.csv');
    const csvWriter = createObjectCsvWriter({
      path: filePath,
      header: Object.keys(users[0] ?? {}).map((key) => ({ id: key, title: key })),
    });
    csvWriter.writeRecords(users);
    return filePath;
    }
  }

export default UserService;

