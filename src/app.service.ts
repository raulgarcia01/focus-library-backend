import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'FOCUS ITO - BACKEND TEST WITH NEST JS';
  }
}
