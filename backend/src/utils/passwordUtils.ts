import * as bcrypt from 'bcryptjs';



const saltRounds = 10;


export async function hashPassword(password: string): Promise<string> {

  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;

}

export async function comparePasswords(password: string, hashedPassword: string) {
  const match = await bcrypt.compare(password, hashedPassword)
  return match
}