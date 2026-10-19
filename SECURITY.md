# Security Policy

At PulseBoard, we take the security of our application, code, and user data very seriously. We appreciate the responsible disclosure of security issues and are committed to addressing vulnerabilities promptly and transparently.

---

## Supported Versions

Only the latest active minor release receives active security patches. We strongly encourage all users and deployment environments to stay up to date.

| Version | Supported          | Security Maintenance Status  |
| ------- | ------------------ | ---------------------------- |
| `0.1.x` | :white_check_mark: | Currently Supported (Active) |
| `< 0.1` | :x:                | End of Life (Unsupported)    |

---

## Reporting a Vulnerability

**Please do NOT file public GitHub issues for security vulnerabilities.**

If you believe you have discovered a vulnerability, security bug, or sensitive exposure in PulseBoard, please report it via private disclosure:

1. **Email:** Send details to **rohankusalkar78@gmail.com** or use GitHub's [Private Vulnerability Reporting](https://github.com/rskusalkar78/PULSEBOARD/security/advisories/new).
2. **Subject:** `[SECURITY DISCLOSURE] PulseBoard - Brief Summary`
3. **Include in Report:**
   - Detailed description of the vulnerability and attack vector.
   - Exact steps to reproduce or Proof of Concept (PoC) code / requests.
   - Affected components, routes, or files.
   - Any suggested mitigations or patches if known.

### Response Timeline

- **Initial Acknowledgment:** Within 48 hours of receipt.
- **Triage & Assessment:** Within 5 business days, including confirmation of severity and impact.
- **Patch Release:** Target within 14 business days depending on complexity and affected subsystems.
- **Public Disclosure:** Coordinated after a fix is verified and deployed.

---

## Architecture & Security Model

PulseBoard is designed around defense-in-depth principles:

### 1. Row Level Security (RLS)

Client-side authorization checks are purely for UI/UX responsiveness and cannot be trusted as actual security boundaries. PulseBoard relies on PostgreSQL Row Level Security (RLS) policies within Supabase to enforce multi-tenant isolation and role-based permissions (`admin`, `manager`, `member`, `guest`).

### 2. Environment Variables & Secret Separation

- PulseBoard client runtime only uses publishable environment keys: `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
- The Supabase `service_role` secret key must **NEVER** be committed to Git or bundled into client code. It bypasses RLS and is restricted to trusted server runtimes or edge functions.
- Local configuration is stored in `.env.local` which is strictly ignored by version control.

### 3. Cross-Site Scripting (XSS) Mitigation

- React 19 natively escapes dynamic data rendered in JSX.
- No instances of `dangerouslySetInnerHTML`, raw `innerHTML`, or `eval()` are permitted in the codebase.
- Dynamic URLs are strictly typed and sanitized before being bound to anchor elements.

### 4. Transport & Header Security

- All production Supabase traffic is transmitted over HTTPS and secure WebSockets (WSS).
- API requests include application tracking headers (`x-application-name: pulseboard`).
- Sessions use standard Bearer Authorization tokens, eliminating ambient cookie CSRF vulnerabilities.

---

## Known Security Posture & Dependency Audit

A periodic `npm audit` is performed during CI/CD checks:

- Production runtime dependencies maintain 0 known vulnerabilities.
- Development tooling dependencies (e.g. test mockers, Storybook documentation addons) are monitored and updated during regular maintenance cycles.
