import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { SceneService } from './scene.service';

import { UpdateSceneDto } from './dto/update-scene.dto';
import { CreateSceneDto } from './dto/createScene.dto';

@Controller('scene')
export class SceneController {
  constructor(private readonly sceneService: SceneService) {}

  @Post('/save')
  async create(@Body() createSceneDto: CreateSceneDto) {
    return await this.sceneService.saveDataJSON(createSceneDto);
  }
}
