import { execSync } from "child_process";

export function getOrdVersion(): string {
  const command = "ord --version";
  const output = execSync(command).toString();
  const version = output.split(" ")[1];
  return version;
}

export function isOrdVersionGreaterOrEqual(version: string): boolean {
  const ordVersion = getOrdVersion();
  const ordVersionParts = ordVersion.split(".");
  const versionParts = version.split(".");

  for (let i = 0; i < Math.max(ordVersionParts.length, versionParts.length); i++) {
    const ordPart = parseInt(ordVersionParts[i] || "0");
    const versionPart = parseInt(versionParts[i] || "0");

    if (ordPart > versionPart) {
      return true;
    } else if (ordPart < versionPart) {
      return false;
    }
  }

  return true;
}

