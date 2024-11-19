import { Injectable } from '@nestjs/common';

import { UpdateSceneDto } from './dto/update-scene.dto';
import { CreateSceneDto } from './dto/createScene.dto';
import { SceneEntity } from './entities/scene.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { isString } from 'class-validator';

@Injectable()
export class SceneService {
  constructor(
    @InjectRepository(SceneEntity)
    private sceneRepository: Repository<SceneEntity>,
  ) {}

  async saveDataJSON(createSceneDto: CreateSceneDto) {
    console.log(
      'JSON DATA: ',
      createSceneDto.dataJSON,
      '\n author: ',
      createSceneDto.author,
    );
    const a = await this.sceneRepository.save(createSceneDto);
    console.log('SCENE: ', a.dataJSON);
    return 'This action adds a new scene';
  }
}
