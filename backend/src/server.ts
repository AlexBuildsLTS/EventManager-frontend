import { Prisma, Role, User } from '@prisma client';
import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';
dotenv.config();
import { z } from 'zod';
import { writeToPath } from 'csv';
import * as bcrypt from 'bcryptjs';
import cors from 'cors';

const prisma = new PrismaClient();
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

