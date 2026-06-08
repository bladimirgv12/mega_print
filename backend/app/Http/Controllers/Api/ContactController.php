<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Contact;
use Illuminate\Http\Request;

class ContactController extends Controller
{
    public function index(Request $request)
    {
        $contacts = Contact::orderBy('created_at', 'desc')
                           ->paginate($request->per_page ?? 20);

        return response()->json([
            'data' => $contacts->items(),
            'meta' => [
                'current_page' => $contacts->currentPage(),
                'last_page'    => $contacts->lastPage(),
                'total'        => $contacts->total(),
            ],
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'    => 'required|string|max:255',
            'email'   => 'required|email|max:255',
            'phone'   => 'nullable|string|max:30',
            'subject' => 'nullable|string|max:255',
            'message' => 'required|string|min:5|max:2000',
        ]);

        $contact = Contact::create($validated);

        return response()->json([
            'message' => 'Mensaje enviado correctamente. Te responderemos pronto.',
            'data'    => $contact,
        ], 201);
    }

    public function destroy($id)
    {
        Contact::findOrFail($id)->delete();
        return response()->json(['message' => 'Mensaje eliminado.']);
    }
}
