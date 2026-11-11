import { test, expect } from '../src/fixtures';
import { buildPet } from '../src/data/petFactory';
import type { Pet } from '../src/types/pet';

test.describe('POST /pet - Add a new pet', () => {
  test('TC-01 adds a pet with all valid fields', async ({ petApi }) => {
    const pet = buildPet();
    const res = await petApi.add(pet);

    expect(res.status()).toBe(200);
    expect(await res.json()).toMatchObject({ ...pet });
    await petApi.deleteQuietly(pet.id!);
  });

  test('TC-02 adds a pet with required fields only', async ({ petApi }) => {
    const res = await petApi.add({ name: 'qa-required-only', photoUrls: [] });

    expect(res.status()).toBe(200);
    const body = (await res.json()) as Pet;
    expect(body.name).toBe('qa-required-only');
    expect(body.id).toEqual(expect.any(Number));
    await petApi.deleteQuietly(body.id!);
  });

  test('TC-03 rejects an empty body with 405', async ({ petApi }) => {
    const res = await petApi.add({});
    expect(res.status()).toBe(405);
  });

  test('TC-04 rejects a non-numeric id with 405', async ({ petApi }) => {
    const res = await petApi.add({ ...buildPet(), id: 'abc' });
    expect(res.status()).toBe(405);
  });

  test('TC-05 rejects a status outside the enum with 405', async ({ petApi }) => {
    const res = await petApi.add({ ...buildPet(), status: 'xyz' });
    expect(res.status()).toBe(405);
  });

  test('TC-06 accepts an XML body', async ({ petApi }) => {
    const id = buildPet().id!;
    const xml = `<Pet><id>${id}</id><name>qa-xml-${id}</name><photoUrls><photoUrl>https://example.com/p.jpg</photoUrl></photoUrls><status>available</status></Pet>`;
    const res = await petApi.addRaw(xml, 'application/xml');

    expect(res.status()).toBe(200);
    await petApi.deleteQuietly(id);
  });

  test('TC-07 documents behaviour for a duplicate id', async ({ petApi, existingPet }) => {
    // The spec does not define this case; assert it is handled deterministically (no 5xx).
    const res = await petApi.add({ ...buildPet(), id: existingPet.id, name: 'qa-duplicate' });

    expect(res.status()).toBeLessThan(500);
    test.info().annotations.push({ type: 'observed', description: `duplicate id -> ${res.status()}` });
  });
});
