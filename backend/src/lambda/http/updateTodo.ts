require('source-map-support').install();

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';

import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest';
import { createLogger } from '../../utils/logger';
import { updateTodoItemForUser } from '../../bussinesLayer/todo';
import { getUserId } from '../utils';

const logger = createLogger('updateTodo')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

    logger.info("Processing event", event);

    const { todoId } = event.pathParameters;
    const updatedTodo: UpdateTodoRequest = JSON.parse(event.body);

    const updatedItem = {
        ...updatedTodo,
        done: true
    }

    await updateTodoItemForUser(getUserId(event), todoId, updatedItem)

    return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true
        },
        body: JSON.stringify({
            item: updatedItem
        })
    }
}
