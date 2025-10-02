<?php

namespace App\Http\Controllers;

use App\Models\BlogPost;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class BlogController extends Controller
{
    public function index()
    {
        $blogPosts = BlogPost::whereNotNull('published_at')->paginate(10);
        return response()->json($blogPosts);
    }

    public function show($id)
    {
        $blogPost = BlogPost::where('id', $id)->whereNotNull('published_at')->firstOrFail();
        return response()->json($blogPost);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title_ar' => 'required|string|max:255',
            'title_en' => 'required|string|max:255',
            'content_ar' => 'required|string',
            'content_en' => 'required|string',
            'cover_url' => 'nullable|string|max:255',
            'published_at' => 'nullable|date',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $blogPost = BlogPost::create([
            'title_ar' => $request->title_ar,
            'title_en' => $request->title_en,
            'content_ar' => $request->content_ar,
            'content_en' => $request->content_en,
            'cover_url' => $request->cover_url,
            'published_at' => $request->published_at,
        ]);

        return response()->json([
            'message' => 'Blog post created successfully',
            'blog_post' => $blogPost,
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $blogPost = BlogPost::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'title_ar' => 'sometimes|required|string|max:255',
            'title_en' => 'sometimes|required|string|max:255',
            'content_ar' => 'sometimes|required|string',
            'content_en' => 'sometimes|required|string',
            'cover_url' => 'nullable|string|max:255',
            'published_at' => 'nullable|date',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $blogPost->update($request->all());

        return response()->json([
            'message' => 'Blog post updated successfully',
            'blog_post' => $blogPost,
        ]);
    }

    public function destroy($id)
    {
        $blogPost = BlogPost::findOrFail($id);
        $blogPost->delete();

        return response()->json(['message' => 'Blog post deleted successfully']);
    }
}