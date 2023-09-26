import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { UsersRepository } from './user.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entity/user.entity';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';
import { TokenService } from 'apps/token/src/token.service';
import { AccessToken } from 'apps/token/src/entity/token.entity';
import { UploadsService } from '@app/common';
import tinify from 'tinify';
import { faker } from '@faker-js/faker';
import { MoreThan } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    private readonly userRepository: UsersRepository,
    private readonly configService: ConfigService,
    private readonly tokenService: TokenService,
    private readonly uploadService: UploadsService,
  ) {
    tinify.key = 'gZzd51HGFTyzYn10xTvgvXQJn1b7Fxss';
  }
  async create(
    createUserDto: CreateUserDto,
    req: any,
    file: Express.Multer.File,
  ) {
    await this.validateCreateUserDto(createUserDto);

    const extractHeader = req.rawHeaders[1].split(' ')[1];

    const findToken = await this.tokenService.findToken(extractHeader);
    if (findToken && findToken.count === 1) {
      throw new UnprocessableEntityException(
        'Token already used. get a new token to create',
      );
    }

    const optimizedImage = await this.optimizeImage(file);
    const key = `${file.fieldname}${Date.now()}`;
    const imagePath = await this.uploadService.uploadImage(key, optimizedImage);

    const user = new User({ ...createUserDto, file: imagePath });
    const newUser = await this.userRepository.create(user);
    await this.tokenService.findOneAndUpdate(extractHeader);
    return newUser;
  }

  private async validateCreateUserDto(createUserDto: CreateUserDto) {
    try {
      await this.userRepository.findOne({ email: createUserDto.email });
    } catch (err) {
      return;
    }
    throw new UnprocessableEntityException('Email already exists.');
  }
  async getUser(limit: number, afterId?: number) {
    const where = {};

    if (afterId) {
      where['id'] = MoreThan(afterId);
    }

    return await this.userRepository.find(where, limit);
    // return await this.userRepository.find({}, limit, afterId);
  }

  async generateToken() {
    const payload = { data: 'token' };
    const token = jwt.sign(payload, 'secret', {
      expiresIn: '40min',
    });
    const generateToken = new AccessToken({
      token,
    });
    await this.tokenService.storeToken(generateToken);
    return {
      success: true,
      token,
    };
  }
  async optimizeImage(file: Express.Multer.File): Promise<Express.Multer.File> {
    try {
      const imageBuffer = file.buffer;
      const source = tinify.fromBuffer(imageBuffer);
      const resizedImage = source.resize({
        method: 'fit',
        width: 75,
        height: 75,
      });
      const optimizedImageBuffer = await resizedImage.toBuffer();

      // Update the buffer of the existing file
      file.buffer = Buffer.from(optimizedImageBuffer);

      return file;
    } catch (error) {
      throw new Error('Image optimization failed');
    }
  }
  async uploadExampleData() {
    const numberOfUsersToSeed = 45;
    const generatedUsers: User[] = [];
    for (let i = 0; i < numberOfUsersToSeed; i++) {
      const userData = await this.generateRandomUser();
      const user = new User(userData);
      const createdUser = await this.userRepository.create(user);
      generatedUsers.push(createdUser);
    }
    return generatedUsers;
  }
  async generateRandomUser() {
    const user = {
      id: faker.number.int({ min: 50, max: 1000 }),
      position_id: faker.number.int({ min: 1, max: 4 }),
      name: `${faker.person.firstName()} ${faker.person.lastName()}`,
      email: faker.internet.email(),
      phone: faker.phone.number(),
      file: faker.image.avatar(),
    };
    return user;
  }
}
