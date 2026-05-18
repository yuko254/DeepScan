import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: './src/graphql/schema.graphql',
  generates: {
    // TypeScript output (for backend / resolvers)
    'src/graphql/graphql.ts': {
      plugins: [
        'typescript',
        'typescript-resolvers',
      ],
      config: {
        scalars: {
          DateTime: 'Date',
          JSON: 'Record<string, any>',
          BigInt: 'string',
        },
      },
    },
  },
};

export default config;