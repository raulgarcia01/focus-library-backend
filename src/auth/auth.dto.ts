import { Expose } from 'class-transformer';

@Expose()
export class AuthResponseDTO {
  accessToken: string;
}
