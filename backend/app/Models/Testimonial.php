<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Testimonial extends Model
{
    use HasFactory;

    protected $fillable = [
        'name', 'email', 'photo', 'comment',
        'rating', 'product', 'is_approved',
    ];

    protected $casts = [
        'is_approved' => 'boolean',
        'rating'      => 'integer',
    ];
}
