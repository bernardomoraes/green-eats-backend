import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { CustomError } from 'src/exception/customError.exception';

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}
  async create(input: CreateOrderDto) {
    try {
      const response = await this.prisma.orders.create({
        data: {
          items: {
            createMany: {
              data: input.items.map((item) => ({
                product_id: item.productId,
                quantity: item.quantity,
              })),
            },
          },
          user: {
            connect: {
              id: input.userId,
            },
          },
        },
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
            error: error.message,
          });
        }
        if (error.code === 'P2025') {
          throw new CustomError({
            message: error.name,
            status: 404,
          });
        }
      }
    }
  }

  async findAll() {
    return await this.prisma.orders.findMany({
      include: {
        items: true,
      },
    });
  }

  async findOne(id: number) {
    try {
      return await this.prisma.orders.findUniqueOrThrow({
        where: { id },
        include: {
          items: true,
          user: true,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new Error(error.message);
        }
      }
    }
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return this.prisma.orders.update({
      where: { id },
      data: {
        items: {
          deleteMany: {},
          createMany: {
            data: updateOrderDto.items.map((item) => ({
              product_id: item.productId,
              quantity: item.quantity,
            })),
          },
        },
      },
    });
  }

  remove(id: number) {
    return this.prisma.orders.delete({
      where: { id },
      include: {
        items: true,
      },
    });
  }
}
