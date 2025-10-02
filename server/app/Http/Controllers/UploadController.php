<?php

namespace App\Http\Controllers;

use App\Models\Upload;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;

class UploadController extends Controller
{
    public function index(Request $request)
    {
        $uploads = Upload::where('uploader_id', $request->user()->id)
            ->where('uploader_type', $request->user()->isStaff() ? 'staff' : 'user')
            ->paginate(10);
        
        return response()->json($uploads);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'file' => 'required|file',
            'type' => 'required|in:image,pdf,video,document,other',
            'entity_type' => 'required|string|max:50',
            'entity_id' => 'required|integer',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $path = $request->file('file')->store('uploads', 'public');

        $upload = Upload::create([
            'url' => $path,
            'type' => $request->type,
            'entity_type' => $request->entity_type,
            'entity_id' => $request->entity_id,
            'uploader_id' => $request->user()->id,
            'uploader_type' => $request->user()->isStaff() ? 'staff' : 'user',
        ]);

        return response()->json([
            'message' => 'File uploaded successfully',
            'upload' => $upload,
        ], 201);
    }
}