import * as createCsvWriter from 'csv-writer';
import { User, Event, Invitation } from '@prisma/client';
import * as path from 'path';
import * as fs from 'fs'; // Import file system module



export class CsvUtils {
  static async exportUsers(users: User[]) {
    const csvWriter = createCsvWriter.createObjectCsvWriter({
      path: path.resolve('exports', 'users.csv'),
      header: [{id: 'id', title: 'ID'}, {id: 'name', title: 'Name'}, {id: 'firstName', title: 'First Name'}, {id: 'lastName', title: 'Last Name'}, {id: 'email', title: 'Email'}, {id: 'role', title: 'Role'}, {id: 'createdAt', title: 'Created At'}]
    const records = users.map(user => ({
      id: user.id,
      name: user.name,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt.toISOString()
    }));

    await csvWriter.writeRecords(records);
  }

  static async exportEventAttendance(event: Event, invitations: Invitation[]) {
    const csvWriter = createCsvWriter.createObjectCsvWriter({
      path: path.resolve('exports', `event-${event.id}-attendance.csv`),
      header: [
        { id: 'userId', title: 'User ID' },
        { id: 'status', title: 'Status' },
        { id: 'responseDate', title: 'Response Date' }
      ]
    });

    const records = invitations.map(invitation => ({
      userId: invitation.userId,
      status: invitation.status,
      responseDate: invitation.responseDate?.toISOString() || ''
    }));

    await csvWriter.writeRecords(records);
  }
}

