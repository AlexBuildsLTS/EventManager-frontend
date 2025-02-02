import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import * as client from "@prisma/client";
import { z } from "zod";

const prisma = new client.PrismaClient();

const createUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2),
  password: z.string().min(6),
  role: z.enum(["ADMIN", "USER"]).optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

const registerUser = async (req: Request, res: Response) => {
  const { name, email, password, role } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
      },
    });
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: "User registration failed" });
  }
};

const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid password" });
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      "your_jwt_secret",
      { expiresIn: "1h" }
    );
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ error: "Login failed" });
  }
};

export class UserController {
  async register(req: Request, res: Response) {
    try {
      const data = createUserSchema.parse(req.body);
      const user = await prisma.user.create({ data });
      res.status(201).json(user);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: (error as z.ZodError).errors });
      } else {
        res.status(500).json({ error: "Failed to create user" });
      }
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { email, password } = loginSchema.parse(req.body);
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ error: "Invalid password" });
      }

      const token = jwt.sign(
        { userId: user.id, role: user.role },
        "your_jwt_secret",
        { expiresIn: "1h" }
      );
      res.status(200).json({ token });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors });
      } else {
        res.status(401).json({ error: "Invalid credentials" });
      }
    }
  }

  async getUsers(_req: Request, res: Response) {
    try {
      const users = await prisma.user.findMany();
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch users" });
    }
  }

  async getUserById(req: Request, res: Response) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: req.params.id },
      });
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch user" });
    }
  }

  async updateUser(req: Request, res: Response) {
    try {
      const data = createUserSchema.parse(req.body);
      const user = await prisma.user.update({
        where: { id: req.params.id },
        data,
      });
      res.json(user);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors });
      } else {
        res.status(500).json({ error: "Failed to update user" });
      }
    }
  }

  async deleteUser(req: Request, res: Response) {
    try {
      await prisma.user.delete({ where: { id: req.params.id } });
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete user" });
    }
  }
}

export const userController = new UserController();
