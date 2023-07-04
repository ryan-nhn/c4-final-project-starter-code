import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { createLogger } from '../utils/logger'

const logger = createLogger('attachmentUtils')
// TODO: Implement the fileStogare logic
export class AttachmentUtils {

    constructor(
        private readonly s3 = createS3Client(),
        private readonly bucketName = process.env.ATTACHMENT_S3_BUCKET,
        private readonly urlExpiration = parseInt(process.env.SIGNED_URL_EXPIRATION)) {
    }

    async getUploadUrl(todoId: string): Promise<string> {
        logger.info(`creating upload url for todo ${todoId}`)
        const url = this.s3.getSignedUrl('putObject', {
            Bucket: this.bucketName,
            Key: todoId,
            Expires: this.urlExpiration
        })
        logger.info(`upload url for ${todoId}: ${url}`)
        return url;
    }

    getAttachmentUrl(todoId: string): string {
        logger.info(`get attachment url for todo ${todoId}`)
        return `https://${this.bucketName}.s3.amazonaws.com/${todoId}`;
    }
}


function createS3Client() {
    const XAWS = AWSXRay.captureAWS(AWS)
    const s3 = new XAWS.S3({
        signatureVersion: 'v4'
    });
    return s3
}