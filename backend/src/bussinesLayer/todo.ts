import { todoAccess } from '../dataLayer/todoAccess';
import { TodoItem } from '../models/TodoItem';
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'

const todoAccessor = new todoAccess();

export function getTodoItemsForUser(userId: string): Promise<TodoItem[]> {
    return todoAccessor.getTodoItemsForUser(userId);
}

export function createTodoItem(createRequest: CreateTodoRequest) {
    return todoAccessor.createTodoItem(createRequest)
}

export function getTodoItemById(todoItemId: string) {
    return todoAccessor.getTodoItemById(todoItemId)
}

export async function updateTodoItemForUser(userId: string, todoItemId: string, updateTodoRequest: UpdateTodoRequest) {
    const item = await todoAccessor.getTodoItemById(todoItemId)

    if (item.userId !== userId) {
        throw new Error("You can only update items you own")
    }

    return todoAccessor.updateTodoItem(item, updateTodoRequest);
}

export async function deleteTodoItem(userId: string, todoItemId: string) {
    const item = await todoAccessor.getTodoItemById(todoItemId)

    if (item.userId !== userId) {
        throw new Error("You can only delete items you own");
    }

    return todoAccessor.deleteTodoItem(item);
}