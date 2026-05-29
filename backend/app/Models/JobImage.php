<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class JobImage extends Model
{
    protected $fillable = ['job_id', 'path', 'alt', 'is_primary', 'order'];
    protected $casts = ['is_primary' => 'boolean'];

    public function job()
    {
        return $this->belongsTo(Job::class);
    }
}
