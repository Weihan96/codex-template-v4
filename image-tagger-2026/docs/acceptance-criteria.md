# Acceptance Criteria

## User-visible scaffold behavior

1. The landing page must present scaffold status and clear entry points to authentication and dashboard routes.
2. Users must be able to create an account with email/password and land on a protected dashboard.
3. Unauthenticated requests to protected data APIs must return `401 Unauthorized`.
4. Authenticated users must be able to read and create tagged image records through the app data layer.
5. UploadThing routes must be wired and reachable with a typed endpoint contract.
6. Sentry runtime hooks must be installed across client/server/edge with environment-gated initialization.

## Coverage mapping

- `tests/e2e/scaffold.spec.ts` covers desktop/mobile landing flow and sign-up to protected dashboard.
- `scripts/verify-integration.ts` covers integration contracts when required env vars are present:
  - data contract: read + write + refetch assertion
  - auth contract: sign-up + protected session assertion
  - monitoring contract: controlled Sentry event path assertion
