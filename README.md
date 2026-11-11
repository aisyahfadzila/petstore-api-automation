# Petstore API Automation (Task 2)

Playwright (TypeScript) API tests for the [Swagger Petstore](https://petstore.swagger.io/):

| Endpoint | Spec | Test cases |
|---|---|---|
| `POST /pet` | `tests/pet-add.spec.ts` | TC-01 – TC-07 |
| `GET /pet/findByStatus` | `tests/pet-find-by-status.spec.ts` | TC-08 – TC-14 |
| `DELETE /pet/{petId}` | `tests/pet-delete.spec.ts` | TC-15 – TC-20 |

Test IDs match the Task 1 test case sheet (`Test_Cases_Petstore_API`).

## Prerequisites
- Node.js 20+

## Run
```bash
npm install
npm test            # run all tests, writes HTML report to playwright-report/
npm run report      # open the HTML report
npm run typecheck   # TypeScript check only
```

Run a single file or test:
```bash
npx playwright test tests/pet-delete.spec.ts
npx playwright test -g "TC-15"
```

Override the target API (defaults to `https://petstore.swagger.io/v2/`):
```bash
BASE_URL=https://petstore.swagger.io/v2/ npm test
```

## Design notes
- **Expected results follow the Swagger documentation.** A failing test means the API deviates from its documentation and should be logged as a bug (see `BUG_REPORT.md` in the `api-manual-test` repository). Failures are not hidden or skipped.
- **Independent tests:** each test creates its own pet with a unique id (`src/data/petFactory.ts`), so tests run in parallel without colliding on the shared public API.
- **Cleanup:** the `existingPet` fixture and `deleteQuietly` remove created data.
- **Structure:** `src/api/petClient.ts` (API wrapper), `src/fixtures.ts` (Playwright fixtures), `src/data` (test data), `src/types` (models).
- **Stability:** one retry locally (two in CI) because the public Petstore is shared; traces are kept on failure (`npx playwright show-trace <trace.zip>`).

## Report
After a run, open `playwright-report/index.html` (`npm run report`).
