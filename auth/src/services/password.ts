import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt)

export class Password {
  static async toHas(password: string) {
    const salt = randomBytes(8).toString('hex')
    const buf = (await scryptAsync(password, salt, 64)) as Buffer

    return `${buf.toString('hex')}.${salt}`
  }

  static async compare(storedPassword: string, suppliedPassword: string) {
    const [hashedStoredPassword, salt] = storedPassword.split('.')
    const bufSuppliedPassword = (await scryptAsync(suppliedPassword, salt, 64)) as Buffer

    return bufSuppliedPassword.toString('hex') === hashedStoredPassword
  }
}