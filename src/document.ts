import {
  CreateTrainingRequestSchema,
  CreateTrainingResponseSchema,
  HealthResponseSchema,
  MeResponseSchema,
  MessageResponseSchema,
  TrainingsPresignedUrlRequestSchema,
  TrainingsPresignedUrlResponseSchema,
  RegisterRequestSchema,
  SendCodeRequestSchema,
  SendCodeResponseSchema,
  VerifyCodeRequestSchema,
} from './utils/schema.util.js';
import { createDocument } from 'zod-openapi';

export const document: ReturnType<typeof createDocument> = createDocument({
  openapi: '3.1.1',
  info: {
    title: 'Exam API',
    version: '1.0.0',
  },
  paths: {
    '/health': {
      get: {
        responses: {
          '200': {
            description: '200 OK',
            content: {
              'application/json': {
                schema: HealthResponseSchema,
              },
            },
          },
        },
      },
    },
    // Authentication
    '/v1/auth/register': {
      post: {
        requestBody: {
          content: {
            'application/json': {
              schema: RegisterRequestSchema,
            },
          },
        },
        responses: {
          '201': {
            description: '201 Created',
            content: {
              'application/json': {
                schema: MessageResponseSchema,
              },
            },
          },
        },
      },
    },
    '/v1/auth/login': {
      post: {
        requestBody: {
          content: {
            'application/json': {
              schema: RegisterRequestSchema,
            },
          },
        },
        responses: {
          '200': {
            description: '200 OK',
            content: {
              'application/json': {
                schema: MessageResponseSchema,
              },
            },
          },
        },
      },
    },
    '/v1/auth/send': {
      post: {
        requestBody: {
          content: {
            'application/json': {
              schema: SendCodeRequestSchema,
            },
          },
        },
        responses: {
          '200': {
            description: '200 OK',
            content: {
              'application/json': {
                schema: SendCodeResponseSchema,
              },
            },
          },
        },
      },
    },
    '/v1/auth/verify': {
      post: {
        requestBody: {
          content: {
            'application/json': {
              schema: VerifyCodeRequestSchema,
            },
          },
        },
        responses: {
          '200': {
            description: '200 OK',
            content: {
              'application/json': {
                schema: SendCodeResponseSchema,
              },
            },
          },
        },
      },
    },
    '/v1/auth/me': {
      get: {
        responses: {
          '200': {
            description: '200 OK',
            content: {
              'application/json': {
                schema: MeResponseSchema,
              },
            },
          },
        },
      },
    },
    // Trainings
    '/v1/trainings': {
      get: {
        responses: {
          '200': {
            description: '200 OK',
            content: {
              'application/json': {
                schema: CreateTrainingResponseSchema,
              },
            },
          },
        },
      },
      post: {
        requestBody: {
          content: {
            'application/json': {
              schema: CreateTrainingRequestSchema,
            },
          },
        },
        responses: {
          '201': {
            description: '201 Created',
            content: {
              'application/json': {
                schema: CreateTrainingResponseSchema,
              },
            },
          },
        },
      },
    },
    // Uploads
    '/v1/uploads/trainings': {
      post: {
        requestBody: {
          content: {
            'application/json': {
              schema: TrainingsPresignedUrlRequestSchema,
            },
          },
        },
        responses: {
          '200': {
            description: '200 OK',
            content: {
              'application/json': {
                schema: TrainingsPresignedUrlResponseSchema,
              },
            },
          },
        },
      },
    },
  },
});
