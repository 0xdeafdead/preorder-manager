import { configDotenv } from 'dotenv';
import * as joi from 'joi';

configDotenv({ path: '.env' });

interface EnvVars {
  PORT: number;
  MONGO_DB: string;
  MONGO_ADMIN_USER: string;
  MONGO_ADMIN_PASSWORD: string;
  AUTH0_URL_DOMAIN: string;
  AUTH0_MGMT_CLIENT_ID: string;
  AUTH0_MGMT_CLIENT_SECRET: string;
  AUTH0_MGMT_AUDIENCE: string;
  AUTH0_USER_TOKEN_AUDIENCE: string;
  AUTH0_USER_TOKEN_ISSUER: string;
  AUTH0_ACTION_API_KEY: string;
}

const envsSchema = joi
  .object({
    PORT: joi.number().required(),
    MONGO_DB: joi.string().required(),
    MONGO_ADMIN_USER: joi.string().required(),
    MONGO_ADMIN_PASSWORD: joi.string().required(),
    AUTH0_URL_DOMAIN: joi.string().required(),
    AUTH0_MGMT_CLIENT_ID: joi.string().required(),
    AUTH0_MGMT_CLIENT_SECRET: joi.string().required(),
    AUTH0_MGMT_AUDIENCE: joi.string().required(),
    AUTH0_USER_TOKEN_AUDIENCE: joi.string().required(),
    AUTH0_USER_TOKEN_ISSUER: joi.string().required(),
    AUTH0_ACTION_API_KEY: joi.string().required(),
  })
  .unknown(true);

const { error, value } = envsSchema.validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const envVars: EnvVars = value as EnvVars;

export const envs = {
  port: envVars.PORT,
  mongoDB: envVars.MONGO_DB,
  mongoAdminUser: envVars.MONGO_ADMIN_USER,
  mongoAdminPassword: envVars.MONGO_ADMIN_PASSWORD,
  auth0UrlDomain: envVars.AUTH0_URL_DOMAIN,
  auth0MgmtClientId: envVars.AUTH0_MGMT_CLIENT_ID,
  auth0MgmtClientSecret: envVars.AUTH0_MGMT_CLIENT_SECRET,
  auth0MgmtAudience: envVars.AUTH0_MGMT_AUDIENCE,
  auth0UserTokenAudience: envVars.AUTH0_USER_TOKEN_AUDIENCE,
  auth0UserTokenIssuer: envVars.AUTH0_USER_TOKEN_ISSUER,
  auth0ActionApiKey: envVars.AUTH0_ACTION_API_KEY,
};
