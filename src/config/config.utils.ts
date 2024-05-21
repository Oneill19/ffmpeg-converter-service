import { readJSONSync, readJsonSync } from 'fs-extra';
import path from 'path';

export class ConfigUtils {
  static parseBoolean(str: string) {
    return str && str.toLowerCase() === 'true';
  }

  static getVersion() {
    let version = process.env.npm_package_version;

    if (!version) {
      const filePath = path.join(__dirname, '..', '..', 'package.json');
      const packageJson = readJsonSync(filePath);
      version = packageJson.version;
    }

    return version;
  }

  static getPackageName() {
    let packageName = process.env.npm_package_name;

    if (!packageName) {
      const filePath = path.join(__dirname, '..', '..', 'package.json');
      const packageJson = readJSONSync(filePath);
      packageName = packageJson.name;
    }

    return packageName;
  }
}
