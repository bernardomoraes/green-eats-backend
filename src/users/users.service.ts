import { Injectable } from '@nestjs/common';
import { CreateUsersDto } from './dto/create-users.dto';
import { UpdateUsersDto } from './dto/update-users.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CustomError } from 'src/exception/customError.exception';
import { Prisma } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  create(createUserDto: CreateUsersDto) {
    return this.prisma.users.create({
      data: createUserDto,
      select: {
        id: true,
        name: true,
        email: true,
        document: true,
        phone_number: true,
        created_at: true,
        updated_at: true,
      },
    });
  }

  findAll() {
    return this.prisma.users.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        document: true,
        phone_number: true,
      },
    });
  }

  findOne(id: string) {
    return this.prisma.users.findUniqueOrThrow({
      where: { id },
    });
  }

  async update(id: string, updateUserDto: UpdateUsersDto) {
    try {
      const response = await this.prisma.users.update({
        where: { id },
        data: updateUserDto,
      });

      return response;
    } catch (e) {
      console.log(JSON.stringify(e, null, 2));
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        console.log(e.code);
        if (e.code === 'P2002') {
          throw new CustomError({
            status: 400,
            message: `There is a unique constraint violation, this ${
              e?.meta?.target[0] || 'body'
            } is already in use`,
          });
        }
        throw new CustomError({
          status: 400,
          message: (e.meta?.cause as string) || e.message || 'Unknown error',
        });
      }

      throw e;
    }
  }

  remove(id: string) {
    return this.prisma.users.delete({
      where: { id },
    });
  }
}
