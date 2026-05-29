<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AboutSection;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class AboutSectionController extends Controller
{
    public function index()
    {
        $sections = AboutSection::where('is_active', true)->orderBy('order')->get();
        return response()->json(['data' => $sections]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title'     => 'required|string|max:255',
            'type'      => 'required|string|in:historia,mision,vision,valores,equipo,otro',
            'content'   => 'required|string',
            'image'     => 'nullable|image|max:5120',
            'order'     => 'nullable|integer',
            'is_active' => 'nullable|boolean',
        ]);

        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('about', 'public');
        }

        $section = AboutSection::create($validated);
        return response()->json(['message' => 'Sección creada.', 'data' => $section], 201);
    }

    public function update(Request $request, $id)
    {
        $section = AboutSection::findOrFail($id);
        $validated = $request->validate([
            'title'     => 'sometimes|required|string|max:255',
            'type'      => 'nullable|string',
            'content'   => 'sometimes|required|string',
            'image'     => 'nullable|image|max:5120',
            'order'     => 'nullable|integer',
            'is_active' => 'nullable|boolean',
        ]);

        if ($request->hasFile('image')) {
            if ($section->image) Storage::disk('public')->delete($section->image);
            $validated['image'] = $request->file('image')->store('about', 'public');
        }

        $section->update($validated);
        return response()->json(['message' => 'Sección actualizada.', 'data' => $section]);
    }

    public function destroy($id)
    {
        $section = AboutSection::findOrFail($id);
        if ($section->image) Storage::disk('public')->delete($section->image);
        $section->delete();
        return response()->json(['message' => 'Sección eliminada.']);
    }
}
