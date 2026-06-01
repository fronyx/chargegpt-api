import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import { AiModelEnum } from '../enums';
import { existsSync } from 'fs';
import { normalize } from 'path';

const possibleConfigPaths = [`${__dirname}/.env.${process.env.BUILD_TARGET}`];

let count = 0;

while (count < 6) {
  const points = [];
  for (let i = 0; i < count; i++) {
    points.push('..');
  }

  possibleConfigPaths.push(
    `${__dirname}/${points.join('/')}/environments/.env.${
      process.env.BUILD_TARGET
    }`
  );

  count++;
}

count = 0;

while (count < 6) {
  const points = [];
  for (let i = 0; i < count; i++) {
    points.push('..');
  }

  possibleConfigPaths.push(
    `${__dirname}/${points.join('/')}/environments/.env.local`
  );

  count++;
}

let configPath = possibleConfigPaths.find((path) => existsSync(path));
configPath = normalize(configPath);

// console.log(`Loading config from ${configPath}`);

const { parsed } = dotenv.config({ path: configPath });

class ConfigService {
  constructor(private env: { [k: string]: string | undefined }) {
    this.seedEVFreaksApiParams(); // Seed EVFreaksAPI params manually
  }

  getCurrentEnv(): 'PROD' | 'STAGING' | 'DEV' {
    return this.getValue('MODE') as 'PROD' | 'STAGING' | 'DEV';
  }

  seedEVFreaksApiParams(): void {
    this.env.evFreaksApiPem = this.env.evFreaksApiPem?.replace(/\\n/g, '\n');
  }

  private getValue(key: string, throwOnMissing = true): string {
    const value = this.env[key];
    if (!value && throwOnMissing) {
      throw new Error(`config error - missing env.${key}`);
    }

    return value;
  }

  public ensureValues(keys: string[]) {
    keys.forEach((k) => this.getValue(k, false));
    return this;
  }

  public getPort() {
    return this.getValue('PORT', false);
  }

  public getMongoDbConfig(): {
    user: string;
    password: string;
    host: string;
  } {
    return {
      user: this.getValue('MONGO_DB_USER', false),
      password: this.getValue('MONGO_DB_PASS', false),
      host: this.getValue('MONGO_DB_HOST', false),
    };
  }

  public isProduction() {
    const mode = this.getValue('MODE', false);
    return mode === 'PROD';
  }

  public isStaging() {
    const mode = this.getValue('MODE', false);
    return mode === 'STAGING';
  }

  public isE2E() {
    const mode = this.getValue('MODE', false);
    return mode === 'E2E';
  }

  public isLambda() {
    const mode = this.getValue('MODE', false);
    return mode === 'LAMBDA';
  }

  public getToolkitUrl(): string {
    return this.getValue('TOOLKIT_URL');
  }

  public getToolkitAccessToken(): string {
    return this.getValue('TOOLKIT_ACCESS_TOKEN');
  }

  public getCrawlingDbConfigCli(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: this.getValue('CRAWLING_POSTGRES_HOST'),
      username: this.getValue('CRAWLING_POSTGRES_USER'),
      password: this.getValue('CRAWLING_POSTGRES_PASSWORD'),
      database: this.getValue('CRAWLING_POSTGRES_DATABASE'),
      entities: [
        'apps/cdk-apps/lib/shared/database/entities/crawling/*.entity{.ts,.js}',
      ],
      migrationsTableName: 'migration',
      migrations: ['apps/cdk-apps/lib/shared/database/migration/crawling/*.ts'],
      ssl: false,
    };
  }

  public getCrawlingDbConfig(): TypeOrmModuleOptions {
    return {
      ...this.getCrawlingDbConfigCli(),
      entities: [],
      migrations: [],
      autoLoadEntities: true,
      ssl: true,
    };
  }

  public getAzureRagRedisPort(): number {
    return Number(this.getValue('AZURE_RAG_REDIS_PORT'));
  }

  public getAzureRagRedisHost(): string {
    return this.getValue('AZURE_RAG_REDIS_HOST');
  }

  public getAzureRagRedisPassword(): string {
    return this.getValue('AZURE_RAG_REDIS_PASSWORD');
  }

  public getAzureRedisPort(): number {
    return Number(this.getValue('AZURE_REDIS_PORT'));
  }

  public getAzureRedisHost(): string {
    return this.getValue('AZURE_REDIS_HOST');
  }

  public getAzureRedisPassword(): string {
    return this.getValue('AZURE_REDIS_PASSWORD');
  }

  public getBlobStorageConnectionString(): string {
    return this.getValue('AZURE_PUBLIC_STORAGE_CONNECTION_STRING');
  }

  public getAzureTTSToken(): string {
    return this.getValue('AZURE_TTS_TOKEN');
  }

  public getGoogleApiToken(): string {
    return this.getValue('GOOGLE_API_KEY', false);
  }

  public getSendgridApiKey(): string {
    return this.getValue('SENDGRID_API_KEY', false);
  }

  public getRedisHost(): string {
    return this.getValue('REDIS_HOST', false);
  }

  public getChargeGptS3Bucket(): string {
    return this.getValue('CHARGEGPT_S3_BUCKET', false);
  }

  public getRedisReaderHost(): string {
    return this.getValue('REDIS_READER_HOST', false);
  }

  public getRedisPort(): string {
    return this.getValue('REDIS_PORT', false);
  }

  public getPredictionsApiUrl(): string {
    return this.getValue('PREDICTIONS_API_URL', false);
  }

  public getOcpiApiUrl(): string {
    return this.getValue('OCPI_API_URL', false);
  }

  public getOpenAIAPIToken(): string {
    return this.getValue('OPENAI_API_TOKEN', false);
  }

  public getAWSCognitoKey(): string {
    return this.getValue('AWS_COGNITO_KEY', false);
  }

  getAwsCredentials(): any {
    return {
      secretAccessKey: this.getValue('AWS_SECRET_ACCESS_KEY'),
      accessKeyId: this.getValue('AWS_ACCESS_KEY_ID'),
    };
  }

  getAwsConfigurations(): any {
    return {
      region: this.getValue('AWS_REGION'),
      credentials: this.getAwsCredentials(),
    };
  }

  getAwsConfigurationsWinston(): any {
    return {
      awsRegion: this.getValue('AWS_REGION'),
      ...this.getAwsCredentials(),
    };
  }

  public getAiModel(): AiModelEnum {
    return this.getValue('AI_MODEL') as AiModelEnum;
  }

  public getHubspotToken(): string {
    return this.getValue('HUBSPOT_API_TOKEN');
  }

  public getHubspotPrivateAppToken(): string {
    return this.getValue('HUBSPOT_PRIVATE_APP_TOKEN');
  }

  public getSentryDsn(): string {
    return this.getValue('SENTRY_DSN');
  }

  getAzureConfig(): any {
    return {
      url: this.getValue('AZURE_CHATGPT_URL'),
      deploymentId: this.getValue('AZURE_DEPLOYMENT_ID'),
      apiVersion: this.getValue('AZURE_API_VERSION'),
      apiKey: this.getValue('AZURE_API_KEY'),
      embeddingDeploymentId: this.getValue('AZURE_EMBEDDING_DEPLOYMENT_ID'),
    };
  }

  getAzureFrance4oConfig(): any {
    const config = this.getAzureConfig();
    return {
      ...config,
      deploymentId: this.getValue('AZURE_4O_DEPLOYMENT_ID'),
    };
  }

  getAzureSweden4oConfig(): any {
    const config = this.getAzureSwedenConfig();
    return {
      ...config,
      deploymentId: this.getValue('AZURE_SWEDEN_4O_DEPLOYMENT_ID'),
    };
  }

  getAzureSwedenConfig(): any {
    return {
      url: this.getValue('AZURE_SWEDEN_CHATGPT_URL'),
      deploymentId: this.getValue('AZURE_SWEDEN_DEPLOYMENT_ID'),
      apiVersion: this.getValue('AZURE_SWEDEN_API_VERSION'),
      apiKey: this.getValue('AZURE_SWEDEN_API_KEY'),
      embeddingDeploymentId: this.getValue(
        'AZURE_SWEDEN_EMBEDDING_DEPLOYMENT_ID'
      ),
    };
  }

  getAzureUKSouth4oConfig(): any {
    const config = this.getAzureUKSouthConfig();
    return {
      ...config,
      deploymentId: this.getValue('AZURE_UK_SOUTH_4O_DEPLOYMENT_ID'),
    };
  }

  getAzureUKSouthConfig(): any {
    return {
      url: this.getValue('AZURE_UK_SOUTH_CHATGPT_URL'),
      deploymentId: this.getValue('AZURE_UK_SOUTH_DEPLOYMENT_ID'),
      apiVersion: this.getValue('AZURE_UK_SOUTH_API_VERSION'),
      apiKey: this.getValue('AZURE_UK_SOUTH_API_KEY'),
      embeddingDeploymentId: this.getValue(
        'AZURE_UK_SOUTH_EMBEDDING_DEPLOYMENT_ID'
      ),
    };
  }

  getOpenAIWhisperConfig(): any {
    return {
      baseURL: 'https://api.openai.com/v1/audio/transcriptions',
      headers: {
        Authorization: `Bearer ${this.getValue('OPEN_AI_SECRET_API_KEY')}`,
        'Content-Type': 'multipart/form-data',
      },
    };
  }

  getAzureConfigWhisper(): any {
    return {
      url: this.getValue('AZURE_WHISPER_URL'),
      deploymentId: this.getValue('AZURE_WHISPER_DEPLOYMENT_ID'),
      apiVersion: this.getValue('AZURE_WHISPER_API_VERSION'),
      apiKey: this.getValue('AZURE_WHISPER_API_KEY'),
    };
  }

  getWhisperApiCallTimeout(): number {
    const envValue = this.getValue('WHISPER_API_TIMEOUT', false);
    if (!envValue) {
      return 5000;
    }

    return Number(envValue);
  }

  getChatGptApiCallTimeout(): number {
    const envValue = this.getValue('CHATGPT_API_TIMEOUT', false);
    if (!envValue) {
      return 1200;
    }

    return Number(envValue);
  }

  public getApiVersion(): string {
    return this.getValue('VERSION_NUMBER');
  }

  public getTomtomApiKey(): string {
    return this.getValue('TOMTOM_API_KEY');
  }

  public getDefaultModel(): string {
    return this.getValue('DEFAULT_MODEL');
  }

  public getRequestIdentifierAddressModel(): string {
    return this.getValue('REQUEST_IDENTIFIER_ADDRESS_MODEL');
  }

  public getRequestIdentifierDecisionModel(): string {
    return this.getValue('REQUEST_IDENTIFIER_DECISION_MODEL');
  }

  getWhatsappWebhookVerifyToken(): string {
    return this.getValue('WHATSAPP_WEBHOOK_VERIFY_TOKEN', true);
  }

  getWhatsAppClientToken(): string {
    return this.getValue('WHATSAPP_CLIENT_TOKEN', true);
  }

  getCosmosDbEndpoint(): string {
    return this.getValue('COSMOS_DB_ENDPOINT');
  }

  getCosmosDbKey(): string {
    return this.getValue('COSMOS_DB_KEY');
  }
}

const configService = new ConfigService(parsed).ensureValues([
  'POSTGRES_HOST',
  'POSTGRES_PORT',
  'POSTGRES_USER',
  'POSTGRES_PASSWORD',
  'POSTGRES_DATABASE',
  'CRAWLING_POSTGRES_HOST',
  'CRAWLING_POSTGRES_PORT',
  'CRAWLING_POSTGRES_USER',
  'CRAWLING_POSTGRES_PASSWORD',
  'CRAWLING_POSTGRES_DATABASE',
]);

export { configService };
