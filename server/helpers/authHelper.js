import bcrypt from "bcrypt";

export async function hashPassword(password) {
  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  } catch (error) {
    console.log(error);
  }
}

export async function comparePassword(password, hashedPassword) {
  return await bcrypt.compare(password, hashedPassword);
}
