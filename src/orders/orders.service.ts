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
          id: input.user,
        },
      });

      if (!user) {
        throw new CustomError({
          message: 'User not found',
          status: 404,
        });
      }

      if (input.products?.length === 0) {
        throw new CustomError({
          message: 'You must provide at least one item',
          status: 400,
        });
      }

      const products = await this.prisma.products.findMany({
        where: {
          id: {
            in: input.products.map((item) => item.id),
          },
        },
      });

      if (products.length !== input.products.length) {
        const foundProducts = products.map((product) => product.id);
        const notFoundProducts = input.products
          .map((item) => item.id)
          .filter((id) => !foundProducts.includes(id));

        throw new CustomError({
          message: `The following products were not found: ${notFoundProducts.join(
            ', ',
          )}`,
          status: 404,
        });
      }

      const response = await this.prisma.orders.create({
        data: {
          products: {
            createMany: {
              data: input.products.map((item) => ({
                product_id: item.id,
                quantity: item.quantity,
              })),
            },
          },
          user: {
            connect: {
              id: input.user,
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
        products: {
          include: {
            product: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async findOne(id: string) {
    try {
      return await this.prisma.orders.findUniqueOrThrow({
        where: { id },
        include: {
          products: true,
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

  update(id: string, updateOrderDto: UpdateOrderDto) {
    return this.prisma.orders.update({
      where: { id },
      data: {
        products: {
          deleteMany: {},
          createMany: {
            data: updateOrderDto.products.map((item) => ({
              product_id: item.id,
              quantity: item.quantity,
            })),
          },
        },
      },
    });
  }

  remove(id: string) {
    return this.prisma.orders.delete({
      where: { id },
      include: {
        products: true,
      },
    });
  }
}
