import axios from 'axios';
import * as jwt from 'jsonwebtoken';
import { BACKEND_API_AUDIENCE, BACKEND_API_JWKSURI } from '../../shared/models/general/auth.constants';
import * as util from 'util';
import { PROJECT_QUERY_ATTRIBUTES } from '../../shared/models/general/toolkit.constants';

interface Project {
    api_token: string;
    response_structures: { name: string; value: string }[];
    id: number;
    name: string;
    max_timeframe: number;
    data_source: string;
    party_id: string;
    prediction_frequency: string;
    ai_model: string;
    chargegpt_languages: string[];
    chargegpt_allowed_input: string;
    chargegpt_allowed_output: string;
    is_availability: boolean;
    is_chargegpt: boolean;
    feature_flags: string[];
    filters: { attribute: string; value: string }[];
}

let toolkitProjects: Record<string, Project> | null = null;

export const authenticate = async (params: any) => {
    if (!toolkitProjects) {
        await loadProjects();
    }

    if (containsBearerToken(params)) {
        return authenticateBearerToken(params);
    } else {
        return authenticateApiToken(params);
    }
};

const containsBearerToken = (params: any): boolean => {
    return !!params.authorizationToken?.toLowerCase().startsWith('bearer ');
};

const getBearerToken = (params: any): string => {
    const tokenString = params.authorizationToken;
    if (!tokenString) {
        throw new Error(
            'Expected "event.authorizationToken" parameter to be set'
        );
    }

    const match = tokenString.match(/^Bearer (.*)$/);
    if (!match || match.length < 2) {
        throw new Error(
            `Invalid Authorization token - ${tokenString} does not match "Bearer .*"`
        );
    }

    return match[1];
};

const jwksClient = require('jwks-rsa');
const remoteTokenClient = jwksClient({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 10, // Default value
    jwksUri: BACKEND_API_JWKSURI,
});

const jwtOptions = {
    audience: BACKEND_API_AUDIENCE,
    issuer: process.env.TOKEN_ISSUER,
};

const authenticateBearerToken = async (params: any) => {
    console.log('Authenticating Bearer token...');

    let token: string;

    try {
        token = getBearerToken(params);
    } catch (err) {
        return denyAccessWithErrorMessage(params, (err as any).message);
    }

    const decoded = jwt.decode(token, { complete: true });
    if (!decoded || !decoded.header || !decoded.header.kid) {
        return denyAccessWithErrorMessage(params, 'Invalid token');
    }

    const getSigningKey = util.promisify(remoteTokenClient.getSigningKey);
    return getSigningKey(decoded.header.kid)
        .then((key: any) => {
            const signingKey = key.publicKey || key.rsaPublicKey;
            return jwt.verify(token, signingKey, jwtOptions);
        })
        .then((decoded: any) => {
            const projectId = !isNaN(Number(decoded.project_metadata.project_id)) ? Number(decoded.project_metadata.project_id) : null;

            if (projectId === null) {
                return denyAccessWithErrorMessage(params, 'Unknown Project ID');
            }

            const project = getProjectById(projectId);

            if (project === null) {
                return denyAccessWithErrorMessage(params, 'Unknown Project');
            }

            return {
                principalId: decoded.sub,
                policyDocument: getPolicyDocument('Allow', params.methodArn),
                context: {
                    scope: decoded.scope,
                    ...projectToContext(project!),
                },
            };
        })
        .catch((err: any) => {
            console.error(err);
            return denyAccessWithErrorMessage(params, err.message);
        });
};

const authenticateApiToken = async (params: any) => {
    console.log('Authenticating the API token...');

    const apiToken = params.authorizationToken;

    if (!apiToken) {
        return denyAccessWithErrorMessage(params, 'Missing API token');
    }

    if (!toolkitProjects![apiToken]) {
        return denyAccessWithErrorMessage(params, 'No project found');
    }

    return {
        principalId: 'project',
        policyDocument: getPolicyDocument('Allow', params.methodArn),
        context: projectToContext(toolkitProjects![apiToken]),
    };
};

const denyAccessWithErrorMessage = (params: any, message: string): any => {
    console.log('Denying request with message: ', message);
    return {
        principalId: 'none',
        policyDocument: getPolicyDocument('Deny', params.methodArn),
        context: {
            errorCode: 401,
            errorType: 'Unauthorized',
            errorMessage: message,
        },
    }
};

const getPolicyDocument = (effect: string, resource: string) => {
    const SEPARATOR = '$default';
    const resourceAllowed = `${resource.split(SEPARATOR)[0]}${SEPARATOR}/*/api*`;

    const policyDocument = {
        Version: '2012-10-17', // default version
        Statement: [
            {
                Action: 'execute-api:Invoke', // default action
                Effect: effect,
                Resource: resourceAllowed,
            },
        ],
    };
    return policyDocument;
};

const getProjectById = (projectId: number) => {
    const projects = Object.values(toolkitProjects!);

    return projects.find(({id}: any) => id === projectId);
}

async function loadProjects(): Promise<void> {
    const toolkitUrl = process.env.TOOLKIT_URL ?? 'https://toolkit.example.com';
    const toolkitAccessToken = process.env.TOOLKIT_ACCESS_TOKEN ?? 'replace-me';
    const apiUrl =
        `${toolkitUrl}/items/Project?access_token=${toolkitAccessToken}&${PROJECT_QUERY_ATTRIBUTES}`;
    const projects = await axios
        .get(apiUrl)
        .then(({ data }) => data)
        .then(({ data }) => data);
    if (!toolkitProjects) {
        toolkitProjects = {};
    }
    projects.map(
        (project: Project) => (toolkitProjects![project.api_token] = project)
    );
}

function projectToContext(project: Project): Record<string, string | number> {
    const responseStructures = project.response_structures ?? [];
    const filters = project.filters ?? [];
    return {
        id: project.id,
        name: project.name,
        api_token: project.api_token,
        max_timeframe: project.max_timeframe ?? 1440,
        data_source: project.data_source ?? 'ocpi',
        party_id: project.party_id ?? '',
        ai_model: project.ai_model ?? 'classification',
        prediction_frequency: project.prediction_frequency ?? 'PERIODIC',
        chargegpt_languages: project.chargegpt_languages?.toString() ?? 'de',
        chargegpt_allowed_input: project.chargegpt_allowed_input,
        chargegpt_allowed_output: project.chargegpt_allowed_output,
        is_availability: project.is_availability ?? false,
        is_chargegpt: project.is_chargegpt ?? false,
        filters_all: filters.reduce((acc, { attribute, value }) => `${acc ? `${acc};` : acc}${attribute}:${value}`, ''),
        feature_flags: project.feature_flags?.toString() ?? '',
        feature_flags_staging: project.feature_flags?.toString() ?? '',
        ...responseStructures.reduce(
            (acc: any, { name, value }) => ({
                ...acc,
                [`response_structures_${name}`]: value,
            }),
            {}
        ),
    };
}

