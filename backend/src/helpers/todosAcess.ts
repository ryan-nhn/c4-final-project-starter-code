import * as AWS from 'aws-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate';

const AWSXRay = require('aws-xray-sdk')
const XAWS = AWSXRay.captureAWS(AWS)

const logger = createLogger('TodosAccess')

// TODO: Implement the dataLayer logic
export class TodosAccess {

    constructor(
        private readonly docClient: DocumentClient = createDynamoDBClient(),
        private readonly toDosTable = process.env.TODOS_TABLE) {
    }

    async getAllTodosByUser(userId: string): Promise<TodoItem[]> {
        logger.log('info','Getting all Todos for user ', userId)

        const result = await this.docClient.query({
            TableName: this.toDosTable,
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
                ':userId': userId
            }
        }).promise();

        const items = result.Items
        return items as TodoItem[]
    }

    async createTodo(todo: TodoItem): Promise<TodoItem> {
        logger.log('info','Creating new todo item')
        await this.docClient.put({
            TableName: this.toDosTable,
            Item: todo
        }).promise()

        return todo
    }

    async updateTodo(todo: TodoUpdate, userId: string, todoId: string): Promise<TodoUpdate> {
        logger.log('info',`Updating todo item ${todoId}`)
        const params = {
            TableName: this.toDosTable,
            Key: {
                userId: userId,
                todoId: todoId
            },
            ExpressionAttributeNames: {
                '#todo_name': 'name',
            },
            ExpressionAttributeValues: {
                ':name': todo.name,
                ':dueDate': todo.dueDate,
                ':done': todo.done,
            },
            UpdateExpression: 'SET #todo_name = :name, dueDate = :dueDate, done = :done',
            ReturnValues: 'ALL_NEW',
        }

        const result = await this.docClient.update(params).promise()

        return result.Attributes as TodoUpdate
    }

    async deleteTodo(todoId: string, userId: string) {
        logger.log('info',`Deleting todo item ${todoId}`)

        await this.docClient.delete({
            TableName: this.toDosTable,
            Key: {
                userId: userId,
                todoId: todoId
            }
        }).promise();

    }

    async updateAttachmentUrl(userId: string, todoId: string, attachmentUrl: string) {
        logger.log('info',`updating attachment url for ${todoId} with url ${attachmentUrl}`)
        const params = {
            TableName: this.toDosTable,
            Key: {
                userId: userId,
                todoId: todoId
            },
            UpdateExpression: 'set attachmentUrl = :attachmentUrl',
            ExpressionAttributeValues:{
                ':attachmentUrl':attachmentUrl
            }
        };

       await this.docClient.update(params).promise();
    }
}

function createDynamoDBClient() {
    if (process.env.IS_OFFLINE) {
        logger.log('info','Creating a local DynamoDB instance')
        return new XAWS.DynamoDB.DocumentClient({
            region: 'localhost',
            endpoint: 'http://localhost:8000'
        })
    }

    return new XAWS.DynamoDB.DocumentClient()
}