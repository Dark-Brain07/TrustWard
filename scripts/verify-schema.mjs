import { createClient } from "genlayer-js";
import { studionet } from "genlayer-js/chains";
import { existsSync, readFileSync } from "node:fs";

for (const file of [".env.local", ".env"]) {
  if (!existsSync(file)) continue;
  for (const line of readFileSync(file, "utf8").split(/\r?\n/)) {
    const match = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (match && process.env[match[1]] === undefined) process.env[match[1]] = match[2];
  }
}

const address = process.env.NEXT_PUBLIC_TRUSTWARD_CONTRACT || process.env.NEXT_PUBLIC_DRACOGUARD_CONTRACT;
const endpoint = process.env.NEXT_PUBLIC_GENLAYER_ENDPOINT ?? "https://studio.genlayer.com/api";
const required = [
  "enroll_target", "grant_maintainer", "propose_upgrade", "audit_proposal", "file_dispute",
  "audit_dispute", "dispatch_upgrade", "retry_dispatch", "verify_and_finalize", "withdraw_proposal", 
  "suspend_target", "fetch_overview", "fetch_target", "fetch_proposal", "list_all_targets", 
  "list_target_proposals", "fetch_operator_profile",
];

if (!address || /^0x0{40}$/i.test(address)) {
  console.log("TrustWard contract address is not yet deployed or configured in .env. Skipping remote schema query.");
  process.exit(0);
}

const client = createClient({ chain: studionet, endpoint });
const schema = await client.getContractSchema(address);
const missing = required.filter((method) => !schema.methods[method]);
if (missing.length) {
  console.error(`TrustWard schema is missing methods: ${missing.join(", ")}`);
  process.exit(1);
}
console.log(`TrustWard schema verified: all ${required.length} methods present.`);
