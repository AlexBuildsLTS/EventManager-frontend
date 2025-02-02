import { InvitationStatus } from '@prisma/client';
import { Invitation, User, Event } from "@prisma/client";
import { Request, Response } from 'express';
import { createTransport } from "nodemailer";
import { prisma } from "../utils/prisma";
import { z } from 'zod';

const InvitationSchema = z.object({
   eventId: z.string(),
   userId: z.string(),
   status: z.enum(['PENDING', 'ACCEPTED', 'DECLINED']).optional(),
   comment: z.string().optional(),
   responseDate: z.date().optional(),
}).strict();

type InvitationInput = z.infer<typeof InvitationSchema>;

  export async function createInvitation(data: InvitationInput) {
    const validatedData = InvitationSchema.parse(data);
    return prisma.invitation.create({
      data: validatedData,
    });
  }

  export interface InvitationWithRelations extends Omit<Invitation, 'eventId' | 'userId'> {
  id: any;
  user: User;
  event: Event & { creator: User };
}

export async function getInvitationById(id: string): Promise<InvitationWithRelations | null> {
  return await prisma.invitation.findUnique({
    where: { id },
    include: {
      user: true, event: { include: { creator: true } }
    }
  })
}


export class InvitationService {
  async createInvitation(data: {
    eventId: string;
    userId: string;
    status?: InvitationStatus;
    comment?: string;
  }) {
    const invitation = await prisma.invitation.create({
      data: {
        ...data,
        event: { connect: { id: data.eventId } },
        user: { connect: { id: data.userId } },
      },
    });
    return invitation;
  }

  async getInvitationsByEventId(eventId: string) {
    return prisma.invitation.findMany({
      where: { eventId },
      include: {
        user: { select: { id: true, name: true, email: true } },
        event: { select: { id: true, title: true } },
      },
    });
  }

  async updateInvitation(id: string, data: Partial<Invitation>) {
    const invitation = await prisma.invitation.update({
      where: { id },
      data,
      include: {
        user: { select: { id: true, name: true, email: true } },
        event: { select: { id: true, title: true } },
      },
    });
    return invitation;
  }

  async deleteInvitation(id: string) {
    await prisma.invitation.delete({ where: { id } });
  }


} 
async InvitationStatus(id: string, status: InvitationStatus) {
    const invitation = await this.getInvitationById(id);
    if (!invitation) {
      throw new Error('Invitation not found');
    }
    const updatedInvitation = await prisma.invitation.update({
      where: { id },
      data: { status, responseDate: new Date() },
      include: {
        user: true,
        event: { include: { creator: true } },
      },
    });
    return updatedInvitation;
  }

  async getInvitationsByUser(userId: string) {
    return prisma.invitation.findMany({
      where: { userId },
      include: {
        user: { select: { id: true, name: true, email: true } },
        event: { select: { id: true, title: true } },
      },
    })
  }

  async getInvitationsByEvent(eventId: string) {
    return prisma.invitation.findMany({
      where: { eventId },
      include: {
        user: { select: { id: true, name: true, email: true } },
        event: { select: { id: true, title: true } },
      },
    });
  }
}
export const invitationService = new InvitationService();

const transporter = createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export class EmailService {
  async sendInvitationEmail(invitation: InvitationWithRelations):Promise<void> {
    try {
      await transporter.sendMail({
        from: process.env.SMTP_FROM,
        to: invitation.user.email,
        subject: `Invitation: ${invitation.event.title}`,
        html: `
          <h1>You're Invited!</h1>
          <p>Hello ${invitation.user.name},</p>
          <p>You have been invited to ${invitation.event.title}.</p>
          <p><strong>Date:</strong> ${new Date(invitation.event.date).toLocaleString()}</p>
          <p><strong>Location:</strong> ${invitation.event.location}</p>
          <p><strong>Description:</strong> ${invitation.event.description}</p>
          <p>Please respond to this invitation by clicking one of the following links:</p>
          <p>
            <a href="${process.env.FRONTEND_URL}/respond/${
            invitation.id
        }/accept">Accept</a> |
            <a href="${process.env.FRONTEND_URL}/respond/${
            invitation.id
        }/decline">Decline</a>
          </p>
        `,
      });


      await prisma.invitation.update({
        where: { id: invitation.id },
        data: {
          emailStatus: "SENT",
        },
      });
    } catch (error: any) {
      console.log("error sending email", error);
      await prisma.invitation.update({
        where: { id: invitation.id },
        data: {
          emailStatus: "ERROR",
        },
      });
    }
  }

  async sendStatusUpdateEmail(invitation: InvitationWithRelations):Promise<void> {


    try {
      await transporter.sendMail({
        from: process.env.SMTP_FROM,
        to: invitation.event.creator.email,
        subject: `Response Update: ${invitation.event.title}`,
        html: `
        <h1>Invitation Response Update</h1>
        <p>Hello ${invitation.event.creator.name},</p>
        <p>${
            invitation.user.name
        } has ${invitation.status.toLowerCase()} your invitation to ${
            invitation.event.title
        }.</p>
        <p>View the event details and responses <a href="${
            process.env.FRONTEND_URL
        }/events/${invitation.event.id}">here</a>.</p>
        `,
      });

    } catch (error: any) {
      console.log("error sending email", error);
      await prisma.invitation.update({
        where: { id: invitation.id },
        data: {
          emailStatus: "ERROR",
        },
      });
    }
  }
}

export const emailService = new EmailService();

async sendInvitationEmail(invitation: InvitationWithRelations):Promise<void> {
    try {
      await transporter.sendMail({
        from: process.env.SMTP_FROM,
        to: invitation.user.email,
        subject: `Invitation to ${invitation.event.title}`,
        html: `
        <h1>Event Invitation</h1>
        <p>Hello ${invitation.user.name},</p>
        <p>You have been invited to ${invitation.event.title} by ${invitation.event.creator.name}.</p>
        <p>View the event details and respond to the invitation <a href="${
          process.env.FRONTEND_URL
          }/events/${invitation.event.id}">here</a>.</p>
        `,
