# Security Policy

This repository contains the smart contracts for the **ÅTION** protocol —
a decentralised dollar-cost-averaging system on EVM chains. The contracts
hold user funds. We take security seriously, and we're transparent about
the state of that security.

---

## V0.9 Public Beta — what you need to know

The protocol is launching as a **public beta**. That means:

- **No professional audit yet.** The contracts have not been audited by a
  recognised security firm. An audit is planned when funded.
- **No paid bug bounty yet.** We commit to a paid bounty post-audit; until
  then, this policy covers responsible disclosure and reputation credit.
- **No on-chain TVL cap.** The contracts are immutable; there is no
  protocol-level limit on what a user can deposit. Size your own risk.

What we *have* done:
- Years of fork-chain and testnet testing against Aave V3, Compound V3,
  Uniswap V3 integrations on Base and Optimism.
- On-chain pause mechanisms on both factory and executor — see
  [`DCAFactory.pauseFactory`](contracts/base/DCAFactory.sol) and
  [`DCAExecutor.setActiveState`](contracts/base/DCAExecutor.sol).
- Off-chain executor hot-pause (see [DCA-executor repo's SECURITY doc](https://github.com/E-Labs-io/DCA-executor/blob/V0.9/EXECUTOR_SECURITY.md)).
- Open-sourced the contracts so anyone can read them.

This policy and the pause mechanisms are our safety substrate until a
proper audit and bounty program land.

---

## Reporting a vulnerability

**Please report privately before disclosing publicly.**

Preferred channels (in order):

1. **Email:** `security@ation.capital`
2. **Twitter/X DM:** `@0xAtion`
3. **GitHub private advisory:**
   [open one here](https://github.com/E-Labs-io/D-DCA_Contracts/security/advisories/new)

**Please include:**

- A description of the issue and the expected vs observed behaviour
- A minimal reproducer (fork block, tx call data, or a forge/hardhat test)
- Severity in your own words (critical / high / medium / low)
- Any mitigation ideas

**We will:**

- Acknowledge receipt within **48 hours**
- Assess severity and respond with a triage plan within **7 days**
- Credit you publicly in the post-mortem if you want credit (opt-in)
- Work with you on a coordinated disclosure timeline
- Commit to a paid bounty payment once our bounty program is funded,
  reviewed retroactively for reports filed in the meantime

**Please do not:**

- Exploit the vulnerability against funds that aren't yours
- Post the issue publicly (Twitter, Discord, forums) before it's fixed
- Share reproducers with third parties before fix-and-deploy

Responsible disclosure and then public credit is the pattern we want to
reward. We know there's no paid bounty during beta; we'll make it right
when we can.

---

## Scope

### In scope

- `contracts/` — any Solidity file in this repository
- Deployed instances of those contracts on Base Mainnet, Optimism Mainnet,
  Base Sepolia, Optimism Sepolia (addresses in `deployments/`)
- The off-chain executor service (see [DCA-executor repo](https://github.com/E-Labs-io/DCA-executor))

### Out of scope (for this policy)

- Third-party protocols we integrate with (Aave, Compound, Uniswap, Lido)
  — report those to their respective teams
- UI / frontend bugs without on-chain impact — use the DCA-app repo issues
- Infrastructure issues (RPC providers, Heroku, etc.) — report upstream
- Social-engineering attacks on ÅTION team members
- Issues already publicly known or reported

---

## Severity levels

We broadly follow the Immunefi severity framework:

| Level | Example |
|---|---|
| **Critical** | Theft of user funds; permanent freezing of user funds; protocol insolvency |
| **High** | Theft of yield; temporary freezing of funds; griefing that costs users meaningfully |
| **Medium** | Broken access control without fund impact; DoS of a non-critical path |
| **Low** | Best-practice violations; gas optimisation; informational |

A formal rewards table will ship with the paid bounty program post-audit.

---

## Known caveats

In the spirit of honesty, the following are already flagged internally
and don't need re-reporting:

- Solidity pragma currently `^0.8.20` — will bump to `0.8.24` during V0.9
- Some `require("string")` calls remain mixed with custom errors in
  DCAExecutor and AccountLogic — scheduled migration
- `_withdrawReinvest` has no dedicated test (exists in the code path,
  but test coverage pending)
- Lido staking module was removed from V0.9 (structural issues; revisit
  post-beta)
- No fuzz tests yet — planned for V0.9

If you find something in that list, thanks, but there's no surprise.

---

## After a report — the incident playbook

If a valid vulnerability is reported, our response order:

1. **Confirm and triage** (within 48h of report)
2. **Pause the relevant contract** if the issue is actively exploitable:
   - `DCAFactory.pauseFactory()` — stops new account creation
   - `DCAExecutor.setActiveState(false)` — stops subscriptions + executions
   - Executor script `/admin/pause` — stops off-chain transactions
3. **Coordinate disclosure timeline** with the reporter
4. **Deploy a fix** — may require redeploying contracts given immutability
5. **Post-mortem** — public write-up within 7 days of the fix
6. **Credit the reporter** publicly (with consent)

---

## Contact

- Email: `security@ation.capital` _(preferred for high-severity reports)_
- Twitter/X: [@0xAtion](https://x.com/0xAtion)
- GitHub advisories: [create one](https://github.com/E-Labs-io/D-DCA_Contracts/security/advisories/new)

Thank you for helping keep ÅTION safe.
