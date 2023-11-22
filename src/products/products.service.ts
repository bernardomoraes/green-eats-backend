import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}
  create(createProductDto: CreateProductDto) {
    return this.prisma.products.create({
      data: {
        ...createProductDto,
        categories: {
          create: createProductDto.categories.map((categoryId) => ({
            category: {
              connect: {
                id: categoryId,
              },
            },
          })),
        },
      },
      include: {
        categories: {
          select: {
            category: true,
          },
        },
      },
    });
  }

  findAll({ category }: { category?: string }) {
    const filter: Prisma.ProductsWhereInput = {};
    if (category) {
      filter.categories = {
        some: {
          category_id: category,
        },
      };
    }
    return this.prisma.products.findMany({
      where: filter,
      include: {
        categories: {
          select: {
            category: true,
          },
        },
      },
    });
  }

  findOne(id: string) {
    return this.prisma.products.findUniqueOrThrow({
      where: { id },
    });
  }

  update(id: string, updateProductDto: UpdateProductDto) {
    const { categories, ...rest } = updateProductDto;
    const updateData: Prisma.ProductsUpdateInput = rest;

    if (categories && categories.length > 0) {
      updateData.categories = {
        set: updateProductDto.categories.map((category) => ({
          id: category,
        })),
      };
    }

    return this.prisma.products.update({
      where: { id },
      data: updateData,
    });
  }

  remove(id: string) {
    return this.prisma.products.delete({
      where: { id },
    });
  }
}
