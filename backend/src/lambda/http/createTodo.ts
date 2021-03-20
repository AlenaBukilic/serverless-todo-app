require('source-map-support').install();

import { APIGatewayProxyEvent, Handler, APIGatewayProxyResult } from 'aws-lambda'
import * as uuid from 'uuid';
import { createTodoItem } from '../../bussinesLayer/todo';
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { getUserId } from '../utils';
import { createLogger } from '../../utils/logger';

const logger = createLogger('createTodo');

export const handler: Handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

    logger.info('Processing event: ', event);

    const newTodo: CreateTodoRequest = JSON.parse(event.body)

    const userId = getUserId(event);

    const itemId = uuid.v4();

    const newItem = {
        ...newTodo,
        todoId: itemId,
        userId,
        createdAt: new Date().toISOString(),
        done: false,
    }

    await createTodoItem(newItem);

    return {
        statusCode: 201,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true
        },
        body: JSON.stringify({
            item: newItem
        })
    };
}
