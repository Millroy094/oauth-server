import dotenv from 'dotenv';

const result = dotenv.config();

if (result.error) {
  throw result.error;
}

const { parsed: envs } = result;

export const getEnviromentConfiguration = (
  name: string,
  defaultValue?: string,
): string => {
  return envs && envs[name] ? envs[name] : defaultValue ?? '';
};

export const doesEnvironmentVariableValueMatch = (
  name: string,
  value: string,
): boolean => {
  return envs && envs[name] ? envs[name] === value : false;
};
