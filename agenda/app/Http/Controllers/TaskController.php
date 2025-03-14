<?php

namespace App\Http\Controllers;

use App\Models\Tasks;
use Illuminate\Http\Request;
use App\Http\Resources\TaskResource;

class TaskController extends Controller
{
    //retorna todas as tarefas
    public function index()
    {
        return TaskResource::collection(Tasks::all());
    }

    //cria uma nova tarefa
    public function store(Request $request)
    {
        //recebe os dados do request e valida
        $task = Tasks::create($request->validate([
            'title' => 'required',
            'description' => 'nullable',
            'due_date' => 'required|date',
            'completed' => 'boolean',
            'is_favorite' => 'boolean',
            'color' => 'sometimes|string|max:7'
        ]));

        return new TaskResource($task);
    }

    //retorna uma tarefa
    public function show(Tasks $task)
    {
        return new TaskResource($task);
    }

    public function update(Request $request, Tasks $task)
    {
        //recebe os dados do request e valida
        $task->update($request->validate([
            'title' => 'sometimes|required',
            'description' => 'nullable',
            'due_date' => 'sometimes|required|date',
            'completed' => 'sometimes|boolean',
            'is_favorite' => 'boolean',
            'color' => 'sometimes|string|max:7'
        ]));

        //$task->update($validated);
        return new TaskResource($task);
    }

    //deleta a tarefa
    public function destroy(Tasks $task)
    {
        $task->delete();

        return response()->noContent();
    }
}