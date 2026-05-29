<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Str;

class Job extends Model
{
    use HasFactory;

    protected $fillable = [
        'category_id', 'title', 'slug', 'description',
        'location', 'date', 'is_active', 'order',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'date'      => 'date',
    ];

    protected static function boot()
    {
        parent::boot();
        static::creating(fn($j) => $j->slug ??= Str::slug($j->title) . '-' . uniqid());
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function images()
    {
        return $this->hasMany(JobImage::class)->orderBy('order');
    }
}
