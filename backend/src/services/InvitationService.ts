// src/services/InvitationService.ts
import { Prisma, User, Invitation } from '@prisma/client'; // Import User
import { prisma } from '../database/db.js';
import { AppError } from '../utils/appError';
export class InvitationService {
  createInvitation(eventId: string, userId: string, rest: { status: "PENDING" | "ACCEPTED" | "DECLINED" | "MAYBE"; comment?: string | undefined; responseDate?: Date | undefined; emailStatus?: "SENT" | "ERROR" | undefined; drinkSelections?: any; }) {
    throw new Error('Method not implemented.');
  }
  prisma = prisma; // Initialize prisma

  sendEmailToOrganizer(newInvitation: Invitation) {
    throw new Error('Method not implemented.');
  }

  sendEmail(newInvitation: Invitation) {
    throw new Error('Method not implemented.');
  }

  updateInvitationStatus(id: string, status: any) {
    throw new Error('Method not implemented.');
  }

  async getInvitationById(id: string): Promise<Invitation | null> {
    try {
      const invitation = await prisma.invitation.findUnique({
        where: { id }, include: { user: true }
      });
      return invitation;
    } catch (error) {
      console.error('Error fetching invitation by ID:', error);
      throw new AppError(500, 'Failed to fetch invitation by ID');
    }
  }

  findMany() {
    throw new Error('Method not implemented.');
  }

  async getInvitationsByEventId(eventId: string): Promise<Invitation[]> {
    try {
      const invitations = await prisma.invitation.findMany({
        where: { eventId },
        include: { user: true, event: true }
      });
      return invitations as unknown as Invitation[];
    } catch (error) {
      console.error('Error fetching invitations by eventId:', error);
      throw new AppError(500, 'Failed to fetch invitations by eventId');
    }
  }

  async getUserById(userId: string): Promise<User | null> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });
      return user;
    } catch (error) {
      console.error("Error fetching user by ID:", error);
      return null;
    }
  }

  async updateInvitation(invitationId: string, updateData: Prisma.InvitationUpdateInput): Promise<Invitation> {
    try {
      const updated = await prisma.invitation.update({
        where: { id: invitationId }, data: updateData, include: { user: true }
      });
      return updated;
    } catch (error) {
      console.error('Error updating invitation:', error);
      throw new AppError(500, 'Failed to update invitation');
    }
  }

  async getInvitationsByUser(userId: string): Promise<Invitation[]> {
    try {
      const invitations = await prisma.invitation.findMany({
        where: { userId },
        include: { event: true, user: true }
      });
      return invitations as unknown as Invitation[];
    } catch (error) {
      console.error('Error fetching invitations by user:', error);
      throw new AppError(500, 'Failed to fetch invitations by user');
    }
  }

  async getInvitationsByEvent(eventId: string): Promise<Invitation[]> {
    try {
      const invitations = await prisma.invitation.findMany({
        where: { eventId },
        include: { user: true, event: true }
      });
      return invitations;
    } catch (error) {
      console.error('Error fetching invitations by event:', error);
      throw new AppError(500, 'Failed to fetch invitations by event');
    }
  }

}

