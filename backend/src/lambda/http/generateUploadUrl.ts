import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda';
import * as AWS from 'aws-sdk';
import { createLogger } from '../../utils/logger';

const logger = createLogger('createTodo');

const bucketName = process.env.IMAGES_S3_BUCKET
const urlExpiration = process.env.SIGNED_URL_EXPIRATION

const s3 = new AWS.S3({
  signatureVersion: 'v4'
})

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

    logger.info("Generate upload URL called for event: ", event)
    const { todoId } = event.pathParameters;
    const url = getUploadUrl(todoId);

    return {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
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
        Expires: urlExpiration
    })
  }
