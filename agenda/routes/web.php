<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

use Illuminate\Http\Request;
//use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TaskController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('cors')->group(function () {
    // Rotas da API para Tarefas
    Route::apiResource('tasks', TaskController::class)->except(['create', 'edit']);
    
    // Rotas adicionais podem ser adicionadas aqui
    // Exemplo: Route::post('tasks/{task}/complete', [TaskController::class, 'complete']);
});

// Se precisar de autenticação no futuro
// Route::middleware('auth:sanctum')->group(function () {
//     Route::apiResource('tasks', TaskController::class);
// });
