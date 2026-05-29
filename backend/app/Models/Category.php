<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Str;

class Category extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'slug', 'description', 'icon', 'is_active', 'order'];

    protected $casts = ['is_active' => 'boolean'];

    protected static function boot()
    {
        parent::boot();
        static::creating(fn($c) => $c->slug ??= Str::slug($c->name));
        static::updating(fn($c) => $c->slug = Str::slug($c->name));
    }

    public function products()
    {
        return $this->hasMany(Product::class);
    }

    public function jobs()
    {
        return $this->hasMany(Job::class);
    }
}
