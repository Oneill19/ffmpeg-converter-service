import { Injectable } from '@nestjs/common';
import fs, { Mode, chmod, createWriteStream } from 'fs-extra';
import archiver from 'archiver';
import readdir from 'readdirp';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { FileInfo } from './file-info.interface';

@Injectable()
export class FileService {
  /**
   * Creates a folder if does not exists
   *
   * @example
   * ```
   * await mkdir('/home/my-project');
   * ```
   *
   * @param path
   * @param override
   */
  async mkdir(path: string, override = true) {
    if (override) {
      await this.remove(path);
    }
    await fs.ensureDir(path);
  }

  /**
   * Move a file of folder to destination path
   *
   * @example
   * ```
   * await move ('/home/my-project', '/dest/my-project);
   * ```
   *
   * @param src
   * @param dest
   */
  async move(src: string, dest: string) {
    await fs.move(src, dest, { overwrite: true });
  }

  /**
   * Remove file or dir if exists
   *
   * @example
   * ```
   * // Folder
   * await remove('/home/my-project');
   *
   * // File
   * await remove('/home/my-project/file.zip)
   * ```
   *
   * @param path
   */
  async remove(path: string) {
    const exist = await fs.pathExists(path);
    if (exist) {
      await fs.remove(path);
    }
  }

  /**
   * Get detailed file
   *
   * @param filePath
   * @returns file info
   */
  getFileInfo(filePath: string): FileInfo {
    const name = path.basename(filePath);
    const extention = path.extname(filePath);
    const nameWithoutExtention = path.basename(filePath, extention);
    const directoryPath = path.dirname(filePath);
    return {
      path: filePath,
      name,
      extention,
      nameWithoutExtention,
      directoryPath,
    };
  }

  async getFileNameByRegex(directory: string, regex: RegExp) {
    try {
      const files = await fs.readdir(directory);
      for (const file of files) {
        if (regex.test(file)) {
          return file;
        }
      }
    } catch (error) {
      console.error('Error reading directory:', error);
    }
    return null;
  }

  /**
   * Recursive chmod
   *
   * @example
   * ```
   * const dir = 'home/my-project;
   * await rchmod(dir, 0o664);
   * ```
   *
   * @param directoryPath
   * @param mode
   */
  async rchmod(directoryPath: string, mode: Mode) {
    const dirStream = readdir(directoryPath, { type: 'directories' });
    for await (const dir of dirStream) {
      const { fullPath } = dir;
      await chmod(fullPath, mode);
    }
  }

  /**
   * Zip multiple files into a single zip archive
   *
   * @example
   * ```
   * const files = ['file1.txt', 'file2.txt'];
   * const output = 'archive.zip';
   * await zipFiles(files, output);
   * ```
   *
   * @param filePaths - Array of file paths to be included in the zip archive
   * @param outputPath - Path where the zip archive will be saved
   */
  async zipFiles(filePaths: string[], outputPath: string) {
    const output = createWriteStream(outputPath);
    const archive = archiver('zip', { zlib: { level: 9 } });

    const closeOutput = new Promise<void>((resolve, reject) => {
      output.on('close', resolve);
      output.on('error', reject);
    });

    const archiveFinalize = new Promise<void>((resolve, reject) => {
      archive.on('error', reject);
      archive.on('end', resolve);
    });

    archive.pipe(output);
    filePaths.forEach((file) => archive.file(file, { name: path.basename(file) }));
    await archive.finalize();

    await Promise.all([closeOutput, archiveFinalize]);
  }

  /**
   * Save a buffer to a file with a unique name in the 'uploads' directory.
   *
   * @example
   * ```
   * const buffer = Buffer.from('some data');
   * const originalName = 'example.txt';
   * const filePath = await saveBufferToFile(buffer, originalName);
   * console.log(`File saved at ${filePath}`);
   * ```
   *
   * @param buffer - The buffer containing file data to be saved.
   * @param originalName - The original name of the file, used to determine the file extension.
   * @returns A promise that resolves to the path where the file has been saved.
   */
  async saveBufferToFile(buffer: Buffer, originalName: string) {
    const uploadPath = path.join(__dirname, '..', 'uploads');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath);
    }
    const uniqueSuffix = `${Date.now()}-${uuidv4()}${path.extname(originalName)}`;
    const filePath = path.join(uploadPath, uniqueSuffix);
    return new Promise((resolve, reject) => {
      fs.writeFile(filePath, buffer, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve(filePath);
        }
      });
    });
  }
}
