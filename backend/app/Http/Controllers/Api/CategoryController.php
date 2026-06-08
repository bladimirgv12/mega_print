<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class CategoryController extends Controller
{
    public function index()
    {
        $categories = Category::where('is_active', true)->orderBy('order')->get();
        return response()->json(['data' => $categories]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'        => 'required|string|max:255',
            'description' => 'nullable|string',
            'icon'        => 'nullable|string',
            'is_active'   => 'nullable|boolean',
            'order'       => 'nullable|integer',
        ]);
        $validated['slug'] = Str::slug($validated['name']);
        $category = Category::create($validated);
        return response()->json(['message' => 'Categoría creada.', 'data' => $category], 201);
    }

    public function update(Request $request, $id)
    {
        $category = Category::findOrFail($id);
        $validated = $request->validate([
            'name'        => 'required|string|max:255',
            'description' => 'nullable|string',
            'icon'        => 'nullable|string',
            'is_active'   => 'nullable|boolean',
            'order'       => 'nullable|integer',
        ]);
        $validated['slug'] = Str::slug($validated['name']);
        $category->update($validated);
        return response()->json(['message' => 'Categoría actualizada.', 'data' => $category]);
    }

    public function destroy($id)
    {
        Category::findOrFail($id)->delete();
        return response()->json(['message' => 'Categoría eliminada.']);
    }
}
