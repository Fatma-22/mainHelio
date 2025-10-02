<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class NotificationController extends Controller
{
    public function index(Request $request)
    {
        $notifications = Notification::where('recipient_id', $request->user()->id)
            ->where('recipient_type', $request->user()->isStaff() ? 'staff' : 'user')
            ->orderBy('created_at', 'desc')
            ->paginate(10);
        
        return response()->json($notifications);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'recipient_id' => 'required|integer',
            'recipient_type' => 'required|in:user,staff',
            'title' => 'required|string|max:255',
            'message' => 'required|string',
            'type' => 'required|in:email,sms,in_app',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $notification = Notification::create([
            'recipient_id' => $request->recipient_id,
            'recipient_type' => $request->recipient_type,
            'title' => $request->title,
            'message' => $request->message,
            'type' => $request->type,
            'status' => 'unread',
        ]);

        return response()->json([
            'message' => 'Notification created successfully',
            'notification' => $notification,
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $notification = Notification::where('id', $id)
            ->where('recipient_id', $request->user()->id)
            ->where('recipient_type', $request->user()->isStaff() ? 'staff' : 'user')
            ->firstOrFail();

        $validator = Validator::make($request->all(), [
            'status' => 'required|in:read,unread',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $notification->update(['status' => $request->status]);

        return response()->json([
            'message' => 'Notification updated successfully',
            'notification' => $notification,
        ]);
    }
}