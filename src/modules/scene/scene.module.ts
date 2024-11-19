import { Module } from '@nestjs/common';
import { SceneService } from './scene.service';
import { SceneController } from './scene.controller';
import { SceneEntity } from './entities/scene.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([SceneEntity])],
  controllers: [SceneController],
  providers: [SceneService],
})
export class SceneModule {}


