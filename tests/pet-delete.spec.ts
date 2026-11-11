import { test, expect } from '../src/fixtures';
import { buildPet } from '../src/data/petFactory';

test.describe('DELETE /pet/{petId} - Delete a pet', () => {
  test('TC-15 deletes an existing pet', async ({ petApi }) => {
    const pet = await petApi.create(buildPet());
    const res = await petApi.delete(pet.id!);

    expect(res.status()).toBe(200);
    expect(await res.json()).toMatchObject({ message: String(pet.id) });
  });

  test('TC-16 returns 404 when deleting the same pet twice', async ({ petApi }) => {
    const pet = await petApi.create(buildPet());
    expect((await petApi.delete(pet.id!)).status()).toBe(200);

    const second = await petApi.delete(pet.id!);
    expect(second.status()).toBe(404);
  });

  test('TC-17 returns 404 for a non-existent pet', async ({ petApi }) => {
    const res = await petApi.delete(999999999999);
    expect(res.status()).toBe(404);
  });

  test('TC-18 returns 400 for a non-numeric id', async ({ petApi }) => {
    const res = await petApi.delete('abc');
    expect(res.status()).toBe(400);
  });

  test('TC-19 pet is gone after delete', async ({ petApi }) => {
    const pet = await petApi.create(buildPet());
    await petApi.delete(pet.id!);

    const res = await petApi.getById(pet.id!);
    expect(res.status()).toBe(404);
    expect(await res.json()).toMatchObject({ message: 'Pet not found' });
  });

  test('TC-20 deletes with an api_key header', async ({ petApi }) => {
    const pet = await petApi.create(buildPet());
    const res = await petApi.delete(pet.id!, 'special-key');

    expect(res.status()).toBe(200);
  });
});
