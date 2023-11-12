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
      // verify if user exists
      const user = await this.prisma.users.findUnique({
        where: {
          id: input.userId,
        },
      });

      if (!user) {
        throw new CustomError({
          message: 'User not found',
          status: 404,
        });
      }

      if (input.items?.length === 0) {
        throw new CustomError({
          message: 'You must provide at least one item',
          status: 400,
        });
      }

      const products = await this.prisma.products.findMany({
        where: {
          id: {
            in: input.items.map((item) => item.productId),
          },
        },
      });

      if (products.length !== input.items.length) {
        const foundProducts = products.map((product) => product.id);
        const notFoundProducts = input.items
          .map((item) => item.productId)
          .filter((productId) => !foundProducts.includes(productId));

        throw new CustomError({
          message: `The following products were not found: ${notFoundProducts.join(
            ', ',
          )}`,
          status: 404,
        });
      }

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
      console.log(response);
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

  async findAll() {
    return await this.prisma.orders.findMany({
      include: {
        items: {
          include: {
            product: true,
          },
        },
        user: {
          select: {
            id: true,
            full_name: true,
            email: true,
          },
        },
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
