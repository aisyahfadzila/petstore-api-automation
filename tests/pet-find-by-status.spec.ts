import { test, expect } from '../src/fixtures';
import { buildPet } from '../src/data/petFactory';
import type { Pet, PetStatus } from '../src/types/pet';

test.describe('GET /pet/findByStatus - Find pets by status', () => {
  const cases: { id: string; status: PetStatus }[] = [
    { id: 'TC-08', status: 'available' },
    { id: 'TC-09', status: 'pending' },
    { id: 'TC-10', status: 'sold' },
  ];

  for (const { id, status } of cases) {
    test(`${id} returns only ${status} pets`, async ({ petApi }) => {
      const res = await petApi.findByStatus(status);

      expect(res.status()).toBe(200);
      const pets = (await res.json()) as Pet[];
      expect(Array.isArray(pets)).toBe(true);
      for (const pet of pets) expect(pet.status).toBe(status);
    });
  }

  test('TC-11 supports multiple statuses', async ({ petApi }) => {
    const res = await petApi.findByStatus('available,sold');

    expect(res.status()).toBe(200);
    const pets = (await res.json()) as Pet[];
    for (const pet of pets) expect(['available', 'sold']).toContain(pet.status);
  });

  test('TC-12 rejects an invalid status with 400', async ({ petApi }) => {
    const res = await petApi.findByStatus('xyz');
    expect(res.status()).toBe(400);
  });

  test('TC-13 rejects a missing status parameter with 400', async ({ petApi }) => {
    const res = await petApi.findByStatus();
    expect(res.status()).toBe(400);
  });

  test('TC-14 lists a newly created pet', async ({ petApi }) => {
    const pet = await petApi.create(buildPet({ status: 'available' }));
    try {
      await expect
        .poll(async () => {
          const pets = (await (await petApi.findByStatus('available')).json()) as Pet[];
          return pets.some((p) => p.id === pet.id);
        }, { message: 'new pet should appear in findByStatus', timeout: 15_000 })
        .toBe(true);
    } finally {
      await petApi.deleteQuietly(pet.id!);
    }
  });
});
