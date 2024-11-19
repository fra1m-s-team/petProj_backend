import { PartialType } from '@nestjs/mapped-types';
import { CreateSceneDto } from './createScene.dto';

export class UpdateSceneDto extends PartialType(CreateSceneDto) {}
