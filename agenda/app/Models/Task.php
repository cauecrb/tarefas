<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Tasks extends Model
{
    protected $fillable = [
        'title', 
        'description', 
        'due_date', 
        'completed', 
        'is_favorite', 
        'color'
    ];
}
