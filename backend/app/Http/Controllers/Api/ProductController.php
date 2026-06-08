<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\ProductImage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::with(['category', 'images'])
            ->where('is_active', true);

        if ($request->search) {
            $query->where('name', 'like', "%{$request->search}%")
                  ->orWhere('description', 'like', "%{$request->search}%");
        }

        if ($request->category_id) {
            $query->where('category_id', $request->category_id);
        }

        if ($request->featured) {
            $query->where('is_featured', true);
        }

        $products = $query->orderBy('order')->orderBy('id', 'desc')
                          ->paginate($request->per_page ?? 9);

        return response()->json([
            'data' => $products->items(),
            'meta' => [
                'current_page' => $products->currentPage(),
                'last_page'    => $products->lastPage(),
                'per_page'     => $products->perPage(),
                'total'        => $products->total(),
            ],
        ]);
    }

    public function show($id)
    {
        $product = Product::with(['category', 'images'])->findOrFail($id);
        return response()->json(['data' => $product]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'        => 'required|string|max:255',
            'description' => 'required|string',
            'category_id' => 'nullable|exists:categories,id',
            'materials'   => 'nullable|string',
            'features'    => 'nullable|string',
            'price'       => 'nullable|numeric|min:0',
            'price_unit'  => 'nullable|string',
            'is_active'   => 'nullable|boolean',
            'is_featured' => 'nullable|boolean',
            'order'       => 'nullable|integer',
            'images.*'    => 'nullable|image|max:5120',
        ]);

        $validated['slug'] = Str::slug($validated['name']);

        $product = Product::create($validated);

        // Handle images
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $index => $image) {
                $path = $image->store('products', 'public');
                ProductImage::create([
                    'product_id' => $product->id,
                    'path'       => $path,
                    'is_primary' => $index === 0,
                    'order'      => $index,
                ]);
            }
        }

        return response()->json([
            'message' => 'Producto creado exitosamente.',
            'data'    => $product->load(['category', 'images']),
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $product = Product::findOrFail($id);

        $validated = $request->validate([
            'name'        => 'sometimes|required|string|max:255',
            'description' => 'sometimes|required|string',
            'category_id' => 'nullable|exists:categories,id',
            'materials'   => 'nullable|string',
            'features'    => 'nullable|string',
            'price'       => 'nullable|numeric|min:0',
            'price_unit'  => 'nullable|string',
            'is_active'   => 'nullable|boolean',
            'is_featured' => 'nullable|boolean',
            'order'       => 'nullable|integer',
            'images.*'    => 'nullable|image|max:5120',
        ]);

        $product->update($validated);

        // Add new images
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $index => $image) {
                $path = $image->store('products', 'public');
                ProductImage::create([
                    'product_id' => $product->id,
                    'path'       => $path,
                    'is_primary' => false,
                    'order'      => $product->images()->count() + $index,
                ]);
            }
        }

        return response()->json([
            'message' => 'Producto actualizado.',
            'data'    => $product->fresh(['category', 'images']),
        ]);
    }

    public function destroy($id)
    {
        $product = Product::with('images')->findOrFail($id);

        // Delete image files
        foreach ($product->images as $image) {
            Storage::disk('public')->delete($image->path);
        }

        $product->delete();

        return response()->json(['message' => 'Producto eliminado.']);
    }
}
