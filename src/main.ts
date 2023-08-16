import { SERVER_PORT } from './config/constants';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  const configService = app.get(ConfigService);
  app.enableCors({});

  // server port
  const port = +configService.get<number>(SERVER_PORT) || 3000;
  await app.listen(port, "0.0.0.0");
  // console.log(`listening on port ${await app.getUrl()}`)
}
bootstrap();
