import $api from '../app/api/api';
import type { 
  InternalFeaturesAuthTransportHttpLoginDTO,
  InternalFeaturesAuthTransportHttpLoginDTOResponse,
  InternalFeaturesAuthTransportHttpRegisterDTO,
  InternalFeaturesAuthTransportHttpRegisterDTOResponse
} from '../generated/data-contracts';

export class AuthService {
  static async register(data: InternalFeaturesAuthTransportHttpRegisterDTO): Promise<InternalFeaturesAuthTransportHttpRegisterDTOResponse> {
    const response = await $api.post<InternalFeaturesAuthTransportHttpRegisterDTOResponse>('/register', data);
    return response.data;
  }

  static async login(data: InternalFeaturesAuthTransportHttpLoginDTO): Promise<InternalFeaturesAuthTransportHttpLoginDTOResponse> {
    const response = await $api.post<InternalFeaturesAuthTransportHttpLoginDTOResponse>('/login', data);
    return response.data;
  }

  static async dummyLogin(role: 'admin' | 'user' = 'user'): Promise<InternalFeaturesAuthTransportHttpLoginDTOResponse> {
    const response = await $api.post<InternalFeaturesAuthTransportHttpLoginDTOResponse>('/dummyLogin', { role });
    return response.data;
  }

  static logout(): void {
    localStorage.removeItem('token');
  }
}