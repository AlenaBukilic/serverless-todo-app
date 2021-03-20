require('source-map-support').install();

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda';
import { deleteTodoItem } from '../../bussinesLayer/todo';
import { getUserId } from '../utils';
import { createLogger } from '../../utils/logger';

const logger = createLogger('createTodo');

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

    logger.info("Delete handler called for event: ", event)

    const { todoId } = event.pathParameters;
    const userId = getUserId(event);

    await deleteTodoItem(userId, todoId);
    return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({})
    }
}
