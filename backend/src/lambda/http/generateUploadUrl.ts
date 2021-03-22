import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda';
import * as AWS from 'aws-sdk';
import * as AWSXRay from 'aws-xray-sdk';
import { createLogger } from '../../utils/logger';
import { getTodoItemById, updateTodoItemForUser } from '../../bussinesLayer/todo';
import { getUserId } from '../utils';

const XAWS = AWSXRay.captureAWS(AWS);

const logger = createLogger('createTodo');

const bucketName = process.env.IMAGES_S3_BUCKET
const urlExpiration = process.env.SIGNED_URL_EXPIRATION

const s3 = new XAWS.S3({
  signatureVersion: 'v4'
})

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

    logger.info("Generate upload URL called for event: ", event)
    const { todoId } = event.pathParameters;
    const url = getUploadUrl(todoId);

    const todoItem = await getTodoItemById(todoId);

    const updatedItem = {
        ...todoItem,
        attachmentUrl: `https://${bucketName}.s3.amazonaws.com/${todoId}`
    };

    await updateTodoItemForUser(getUserId(event), todoId, updatedItem);

    return {
        statusCode: 201,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true
        },
        body: JSON.stringify({
            uploadUrl: url
        })
    }
}

function getUploadUrl(imageTodoId: string) {
    return s3.getSignedUrl('putObject', {
        Bucket: bucketName,
        Key: imageTodoId,
        Expires: Number(urlExpiration)
    })
  }
