import { TodosAccess } from '../dataLayer/todosAcess'
import { AttachmentUtils } from '../helpers/attachmentUtils';
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import * as uuid from 'uuid'

// TODO: Implement businessLogic
const todosAccess = new TodosAccess()
const attachmentUtils = new AttachmentUtils()

export async function getTodosForUser(userId: string): Promise<TodoItem[]> {
    return todosAccess.getAllTodosByUser(userId);
}

export async function createTodo(createTodoRequest: CreateTodoRequest, userId: string): Promise<TodoItem> {
    const todoId = uuid.v4();
    const timestamp = new Date().toISOString();

    return await todosAccess.createTodo({
        userId: userId,
        todoId: todoId,
        createdAt: timestamp,
        name: createTodoRequest.name,
        dueDate: createTodoRequest.dueDate,
        done: false
    });
}

export async function updateTodo(todoId: string, updateTodoRequest: UpdateTodoRequest, userId: string) {

    await todosAccess.updateTodo(todoId,
        {
            name: updateTodoRequest.name,
            dueDate: updateTodoRequest.dueDate,
            done: updateTodoRequest.done
        },
        userId)
}

export async function deleteTodo(todoId: string, userId: string) {
    await todosAccess.deleteTodo(todoId, userId)
}

export async function createAttachmentPresignedUrl(userId: string, todoId: string): Promise<String> {
    const uploadUrl = await attachmentUtils.getUploadUrl(todoId);

    const attachmentUrl = attachmentUtils.getAttachmentUrl(todoId);

    await todosAccess.updateAttachmentUrl(userId, todoId, attachmentUrl);

    return uploadUrl;
}