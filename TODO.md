# Auth system stabilization — TODO

- [x] Phase 1: Verified code-level env usage (without reading .env via tool).
- [x] Phase 1: Adjust frontend AuthContext to not hard-require NEXT_PUBLIC_API_URL.
- [x] Phase 3: Stabilize register flow to call Next API proxy (/api/auth/register).
- [x] Phase 3: Ensure login/register use consistent routing + avoids reliance on broken localStorage keys.
- [ ] Phase 2: Ensure Next API rewrites/backed connectivity works end-to-end.
- [ ] Phase 3: Stabilize logout + protected route (cookie vs localStorage mismatch).
- [ ] Phase 4: Run npm run lint for frontend and backend and fix remaining TS/ESLint.
- [ ] Phase 5: Final verification: register/login/JWT/session persistence/logout/protected redirects.
- [ ] Phase 6: Continue development only after auth stability.
