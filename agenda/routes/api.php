<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TaskController;

Route::apiResource('tasks', TaskController::class)->except(['create', 'edit']);

// Exemplo de rota protegida (se usar autenticação)
Route::middleware('auth:sanctum')->group(function () {
    // Suas rotas autenticadas aqui
});