<?php

namespace App\Http\Controllers;

use App\Models\Favorite;
use App\Models\Property;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class FavoriteController extends Controller
{
    public function index(Request $request)
    {
        $favorites = Favorite::with('property.images')
            ->where('user_id', $request->user()->id)
            ->paginate(10);
        
        return response()->json($favorites);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'property_id' => 'required|exists:properties,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Check if already favorited
        $existingFavorite = Favorite::where('user_id', $request->user()->id)
            ->where('property_id', $request->property_id)
            ->first();

        if ($existingFavorite) {
            return response()->json(['message' => 'Property already in favorites'], 422);
        }

        $favorite = Favorite::create([
            'user_id' => $request->user()->id,
            'property_id' => $request->property_id,
        ]);

        return response()->json([
            'message' => 'Property added to favorites',
            'favorite' => $favorite->load('property.images'),
        ], 201);
    }

    public function destroy($id)
    {
        $favorite = Favorite::where('id', $id)
            ->where('user_id', auth()->id())
            ->firstOrFail();
        
        $favorite->delete();

        return response()->json(['message' => 'Property removed from favorites']);
    }
}