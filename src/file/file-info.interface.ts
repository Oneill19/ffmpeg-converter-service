export interface FileInfo {
  /**
   * @example 'Incoming_file.zip'
   */
  name: string;

  /**
   * @example .zip
   */
  extention: string;

  /**
   * @example 'Incoming_file'
   */
  nameWithoutExtention: string;

  /**
   * @example 'some/path/to/Incoming_file.zip'
   */
  path: string;

  /**
   * @example 'some/path/to'
   */
  directoryPath: string;
}
