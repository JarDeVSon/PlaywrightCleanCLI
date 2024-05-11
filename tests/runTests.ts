import { execSync } from "child_process";
type Environments = {
  [key: string]: string;
};
export const environments: Environments = {
  dev: 'https://serverest.dev',
  sit: 'https://serverest.dev',
  uat: 'https://serverest.dev',
  prod: 'https://serverest.dev',
};
const env = process.argv[2] || "dev";
const suite = process.argv[3] || "";
const apiUrl = environments[env];
const command = `cross-env API_URL=${apiUrl} npx playwright test tests/${suite}`;
execSync(command, { stdio: 'inherit' });
