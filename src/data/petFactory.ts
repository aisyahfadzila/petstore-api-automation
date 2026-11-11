import type { Pet, PetStatus } from '../types/pet';

/** Unique id per call so parallel tests never collide on the shared public API. */
export function uniqueId(): number {
  return Date.now() * 1000 + Math.floor(Math.random() * 1000);
}

export function buildPet(overrides: Partial<Pet> = {}): Pet {
  const id = overrides.id ?? uniqueId();
  return {
    id,
    category: { id: 1, name: 'dogs' },
    name: `qa-pet-${id}`,
    photoUrls: ['https://example.com/photo.jpg'],
    tags: [{ id: 1, name: 'qa' }],
    status: 'available' as PetStatus,
    ...overrides,
  };
}
