<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Testimonial;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class TestimonialController extends Controller
{
    public function index(Request $request)
    {
        $query = Testimonial::query();

        if ($request->approved) {
            $query->where('is_approved', true);
        }

        $testimonials = $query->orderBy('created_at', 'desc')
                              ->paginate($request->per_page ?? 20);

        return response()->json([
            'data' => $testimonials->items(),
            'meta' => [
                'current_page' => $testimonials->currentPage(),
                'last_page'    => $testimonials->lastPage(),
                'total'        => $testimonials->total(),
            ],
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'    => 'required|string|max:255',
            'email'   => 'nullable|email',
            'comment' => 'required|string|min:10|max:1000',
            'rating'  => 'nullable|integer|min:1|max:5',
            'product' => 'nullable|string|max:255',
            'photo'   => 'nullable|image|max:2048',
        ]);

        if ($request->hasFile('photo')) {
            $validated['photo'] = $request->file('photo')->store('testimonials', 'public');
        }

        $validated['is_approved'] = false; // Requires moderation
        $testimonial = Testimonial::create($validated);

        return response()->json([
            'message' => 'Testimonio enviado. Será revisado antes de publicarse.',
            'data'    => $testimonial,
        ], 201);
    }

    public function approve($id)
    {
        $testimonial = Testimonial::findOrFail($id);
        $testimonial->update(['is_approved' => true]);
        return response()->json(['message' => 'Testimonio aprobado.', 'data' => $testimonial]);
    }

    public function destroy($id)
    {
        $t = Testimonial::findOrFail($id);
        if ($t->photo) {
            Storage::disk('public')->delete($t->photo);
        }
        $t->delete();
        return response()->json(['message' => 'Testimonio eliminado.']);
    }
}
