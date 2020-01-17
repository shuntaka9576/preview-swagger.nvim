import * as path from 'path';

import * as yaml from 'js-yaml';

import { getModuleLogger } from './logger';

const logger = getModuleLogger();

export class SwaggerUiError extends Error {
  public constructor() {
    super();
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, SwaggerUiError);
    }
    this.name = this.constructor.name;
  }
}

export class SwaggerUiNotSupportedFileType extends SwaggerUiError {
  convertSwaggerJsonPrameter: ConvertSwaggerJsonPrameter;
  public constructor(convertSwaggerJsonPrameter: ConvertSwaggerJsonPrameter) {
    super();
    this.convertSwaggerJsonPrameter = convertSwaggerJsonPrameter;
    this.name = this.constructor.name;
  }
}

export class SwaggerUiUnknownError extends SwaggerUiError {
  error: Error;
  public constructor(e: Error) {
    super();
    this.name = this.constructor.name;
    this.error = e;
  }
}

interface ConvertSwaggerJsonPrameter {
  bufferRows: string[];
  fileFullPath: string;
}

export function parseSwaggerConfig(
  convertSwaggerJsonPrameter: ConvertSwaggerJsonPrameter,
): ParseSwaggerConfigResponse {
  try {
    const ext = path.extname(convertSwaggerJsonPrameter.fileFullPath);
    const buffer = convertSwaggerJsonPrameter.bufferRows.join('\n');

    if (ext === '.json') {
      return {
        isError: false,
        swaggerConfig: JSON.parse(buffer),
      };
    } else if (ext === '.yaml' || ext === '.yml') {
      const json = yaml.load(buffer);
      return {
        isError: false,
        swaggerConfig: json,
      };
    } else {
      throw new SwaggerUiNotSupportedFileType(convertSwaggerJsonPrameter);
    }
  } catch (e) {
    if (e instanceof yaml.YAMLException) {
      logger.debug(`yaml.YAMLException: ${e.toString()}`);
      return {
        isError: true,
        errMessage: e.toString(),
      };
    }
    throw new SwaggerUiUnknownError(e);
  }
}

interface ParseSwaggerConfigResponse {
  isError: boolean;
  errMessage?: string;
  swaggerConfig?: object;
}
