<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AboutSection extends Model
{
    protected $fillable = ['title', 'type', 'content', 'image', 'order', 'is_active'];
    protected $casts = ['is_active' => 'boolean'];
}
