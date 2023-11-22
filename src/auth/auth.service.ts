import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CustomError } from 'src/exception/customError.exception';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  @Inject(UsersService)
  private usersService: UsersService;
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  async auth(email: string, password: string) {
    const userFound = await this.prisma.users.findUnique({
      where: { email },
    });

    const { password: userPassword, ...safeUser } = userFound;

    if (!userFound) {
      throw new CustomError({
        message: 'User not found',
        status: HttpStatus.NOT_FOUND,
      });
    }

    const passwordMatch = this.validateCredentials(password, userPassword);

    if (!passwordMatch) {
      throw new CustomError({
        message: 'Invalid credentials',
        status: HttpStatus.UNAUTHORIZED,
      });
    }

    return {
      token: this.jwtService.sign({
        sub: userFound.id,
        username: userFound.email,
      }),
      ...safeUser,
    };
  }

  async register(data: RegisterDto) {
    const { email, password, name, document, phone_number } = data;
    const userFound = await this.prisma.users.findUnique({
      where: { email },
    });

    if (userFound) {
      throw new CustomError({
        message: 'Email já cadastrado',
        status: HttpStatus.FORBIDDEN,
      });
    }

    const salt = bcrypt.genSaltSync();
    const hash = bcrypt.hashSync(password, salt);

    const user = await this.usersService.create({
      email,
      password: hash,
      document,
      name,
      phone_number,
    });

    return user;
  }

  validateCredentials(incomingPassword: string, userPassword: string) {
    const passwordMatch = bcrypt.compareSync(incomingPassword, userPassword);
    console.log(passwordMatch);

    if (!passwordMatch) {
      return false; // TODO: Change to false
    }

    return true;
  }
}
