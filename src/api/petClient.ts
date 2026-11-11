import type { APIRequestContext, APIResponse } from '@playwright/test';
import type { Pet } from '../types/pet';

/** Thin wrapper so specs read as intent and URLs live in one place. */
export class PetClient {
  constructor(private readonly request: APIRequestContext) {}

  add(pet: unknown): Promise<APIResponse> {
    return this.request.post('pet', { data: pet });
  }

  addRaw(body: string, contentType: string): Promise<APIResponse> {
    return this.request.post('pet', {
      data: body,
      headers: { 'Content-Type': contentType },
    });
  }

  getById(id: number | string): Promise<APIResponse> {
    return this.request.get(`pet/${id}`);
  }

  findByStatus(status?: string): Promise<APIResponse> {
    return this.request.get('pet/findByStatus', {
      params: status === undefined ? undefined : { status },
    });
  }

  delete(id: number | string, apiKey?: string): Promise<APIResponse> {
    return this.request.delete(`pet/${id}`, {
      headers: apiKey ? { api_key: apiKey } : undefined,
    });
  }

  /** Best-effort cleanup; never fails a test. */
  async deleteQuietly(id: number): Promise<void> {
    await this.delete(id).catch(() => undefined);
  }

  async create(pet: Pet): Promise<Pet> {
    const res = await this.add(pet);
    if (!res.ok()) throw new Error(`Setup failed: POST /pet returned ${res.status()}`);
    return (await res.json()) as Pet;
  }
}
