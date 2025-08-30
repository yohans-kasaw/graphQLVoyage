import type { ApolloServerPlugin, GraphQLRequestContext, GraphQLRequestListener } from '@apollo/server';
import type { Logger } from '../logger';

export function createLoggingPlugin(logger: Logger): ApolloServerPlugin {
  return {
    async requestDidStart(ctx: GraphQLRequestContext): Promise<GraphQLRequestListener> {
      const start = Date.now();
      const opName = ctx.request.operationName ?? 'AnonymousOperation';
      const varsPreview = safePreview(ctx.request.variables);

      logger.info(`-> ${opName} from ${ctx.contextValue && (ctx.contextValue as any).ip ? (ctx.contextValue as any).ip : 'unknown IP'}`);
      if (varsPreview) logger.info(`   variables: ${varsPreview}`);

      let errorCount = 0;

      return {
        async didResolveOperation(rc) {
          const typename = rc.operation?.operation?.toUpperCase?.() ?? 'UNKNOWN';
          logger.info(`   resolved ${typename}`);
        },
        async didEncounterErrors(rc) {
          errorCount = rc.errors.length;
          logger.error(`   encountered ${errorCount} error(s)`);
          for (const e of rc.errors) {
            logger.error(e.message);
          }
        },
        async willSendResponse() {
          const ms = Date.now() - start;
          logger.info(`< - ${opName} completed in ${ms}ms (errors=${errorCount})`);
        }
      };
    }
  };
}

function safePreview(obj: any): string | undefined {
  if (!obj || Object.keys(obj).length === 0) return undefined;
  try {
    const str = JSON.stringify(obj);
    return str.length > 500 ? str.slice(0, 497) + '...' : str;
  } catch {
    return '[unserializable variables]';
  }
}
