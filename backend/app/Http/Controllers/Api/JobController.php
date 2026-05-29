<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Job;
use App\Models\JobImage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class JobController extends Controller
{
    public function index(Request $request)
    {
        $query = Job::with(['category', 'images'])->where('is_active', true);

        if ($request->category_id) {
            $query->where('category_id', $request->category_id);
        }

        $jobs = $query->orderBy('order')->orderBy('date', 'desc')
                      ->paginate($request->per_page ?? 9);

        return response()->json([
            'data' => $jobs->items(),
            'meta' => [
                'current_page' => $jobs->currentPage(),
                'last_page'    => $jobs->lastPage(),
                'per_page'     => $jobs->perPage(),
                'total'        => $jobs->total(),
            ],
        ]);
    }

    public function show($id)
    {
        return response()->json(['data' => Job::with(['category', 'images'])->findOrFail($id)]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title'       => 'required|string|max:255',
            'description' => 'nullable|string',
            'category_id' => 'nullable|exists:categories,id',
            'location'    => 'nullable|string|max:255',
            'date'        => 'nullable|date',
            'is_active'   => 'nullable|boolean',
            'images.*'    => 'nullable|image|max:5120',
        ]);

        $job = Job::create($validated);

        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $index => $image) {
                $path = $image->store('jobs', 'public');
                JobImage::create([
                    'job_id'     => $job->id,
                    'path'       => $path,
                    'is_primary' => $index === 0,
                    'order'      => $index,
                ]);
            }
        }

        return response()->json([
            'message' => 'Trabajo guardado.',
            'data'    => $job->load(['category', 'images']),
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $job = Job::findOrFail($id);
        $validated = $request->validate([
            'title'       => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'category_id' => 'nullable|exists:categories,id',
            'location'    => 'nullable|string|max:255',
            'date'        => 'nullable|date',
            'is_active'   => 'nullable|boolean',
            'images.*'    => 'nullable|image|max:5120',
        ]);

        $job->update($validated);

        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $index => $image) {
                $path = $image->store('jobs', 'public');
                JobImage::create([
                    'job_id'  => $job->id,
                    'path'    => $path,
                    'order'   => $job->images()->count() + $index,
                ]);
            }
        }

        return response()->json(['message' => 'Trabajo actualizado.', 'data' => $job->fresh(['category', 'images'])]);
    }

    public function destroy($id)
    {
        $job = Job::with('images')->findOrFail($id);
        foreach ($job->images as $img) {
            Storage::disk('public')->delete($img->path);
        }
        $job->delete();
        return response()->json(['message' => 'Trabajo eliminado.']);
    }
}
