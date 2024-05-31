import { Injectable } from '@nestjs/common';

@Injectable()
export class TaskService {
  // TODO: Подключить платный план для тестов
  // async getResGPT(text: string) {
  //   const openai = new OpenAI({
  //     apiKey: this.configService.get('GPT_KEY'),
  //   });
  //   const completion = await openai.chat.completions.create({
  //     messages: [{ role: 'system', content: text }],
  //     model: 'gpt-3.5-turbo-16k',
  //   });
  //   return completion.choices[0];
  // }
}
