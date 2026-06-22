import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);
export class PasswordManagementHelperService {
  static async toHash(password: string) {
    const salt = randomBytes(8).toString("hex");
    const buf = (await scryptAsync(salt, password, 64)) as Buffer;
    return `${buf.toString("hex")}.${salt}`;
  }
  static async compare(storedPassword: string, suppliedPassword: string) {
    const [hashPassword, salt] = storedPassword.split(".");
    const buf = (await scryptAsync(salt, suppliedPassword, 64)) as Buffer;
    return buf.toString("hex") === hashPassword;
  }
}
