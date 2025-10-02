<?php

namespace App\Http\Controllers;

use App\Models\Review;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ReviewController extends Controller
{
    public function index(Request $request)
    {
        $reviews = Review::with('user')
            ->where('user_id', $request->user()->id)
            ->paginate(10);
        
        return response()->json($reviews);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'entity_type' => 'required|in:finishing,decor,property',
            'entity_id' => 'required|integer',
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Check if user already reviewed this entity
        $existingReview = Review::where('user_id', $request->user()->id)
            ->where('entity_type', $request->entity_type)
            ->where('entity_id', $request->entity_id)
            ->first();

        if ($existingReview) {
            return response()->json(['message' => 'You have already reviewed this item'], 422);
        }

        $review = Review::create([
            'user_id' => $request->user()->id,
            'entity_type' => $request->entity_type,
            'entity_id' => $request->entity_id,
            'rating' => $request->rating,
            'comment' => $request->comment,
        ]);

        return response()->json([
            'message' => 'Review created successfully',
            'review' => $review->load('user'),
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $review = Review::where('id', $id)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        $validator = Validator::make($request->all(), [
            'rating' => 'sometimes|required|integer|min:1|max:5',
            'comment' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $review->update($request->all());

        return response()->json([
            'message' => 'Review updated successfully',
            'review' => $review->load('user'),
        ]);
    }

    public function destroy($id)
    {
        $review = Review::where('id', $id)
            ->where('user_id', auth()->id())
            ->firstOrFail();
        
        $review->delete();

        return response()->json(['message' => 'Review deleted successfully']);
    }
}