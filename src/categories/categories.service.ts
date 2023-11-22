import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { CustomError } from 'src/exception/customError.exception';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createCategoryDto: CreateCategoryDto) {
    try {
      const response = await this.prisma.categories.create({
        data: createCategoryDto,
      });
      return response;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          console.log(error);
          throw new CustomError({
            message:
              'Something wrong with your input, please check the application logs for more details',
            status: 400,
            log: error.message,
          });
        }
        if (error.code === 'P2025') {
          console.log(error);
          throw new CustomError({
            message: error.meta.cause as string,
            status: 404,
          });
        }
      }
      if (error instanceof CustomError) {
        throw error;
      }
      throw new CustomError({
        message: 'Something went wrong during the database request',
        status: 500,
        log: error,
      });
    }
  }

  findAll() {
    return this.prisma.categories.findMany();
  }

  findOne(id: string) {
    return this.prisma.categories.findUnique({
      where: { id },
    });
  }

  update(id: string, updateCategoryDto: UpdateCategoryDto) {
    return this.prisma.categories.update({
      where: { id },
      data: updateCategoryDto,
    });
  }

  remove(id: string) {
    return this.prisma.categories.delete({
      where: { id },
    });
  }
}
