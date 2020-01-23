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
): ParseSwaggerContentResponse {
  try {
    const ext = path.extname(convertSwaggerJsonPrameter.fileFullPath);
    const buffer = convertSwaggerJsonPrameter.bufferRows.join('\n');

    if (ext === '.json') {
      return {
        isError: false,
        swaggerContent: JSON.parse(buffer),
      };
    } else if (ext === '.yaml' || ext === '.yml') {
      const json = yaml.load(buffer);
      return {
        isError: false,
        swaggerContent: json,
      };
    }

    return {
      isError: false,
      swaggerContent: null,
    };
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

interface ParseSwaggerContentResponse {
  isError: boolean;
  errMessage?: string;
  swaggerContent?: object;
}
