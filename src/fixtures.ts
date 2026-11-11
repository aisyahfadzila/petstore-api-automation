import { test as base, expect } from '@playwright/test';
import { PetClient } from './api/petClient';
import { buildPet } from './data/petFactory';
import type { Pet } from './types/pet';

type Fixtures = {
  petApi: PetClient;
  /** A freshly created pet, deleted automatically after the test. */
  existingPet: Pet;
};

export const test = base.extend<Fixtures>({
  petApi: async ({ request }, use) => {
    await use(new PetClient(request));
  },

  existingPet: async ({ petApi }, use) => {
    const pet = await petApi.create(buildPet());
    await use(pet);
    if (pet.id !== undefined) await petApi.deleteQuietly(pet.id);
  },
});

export { expect };
