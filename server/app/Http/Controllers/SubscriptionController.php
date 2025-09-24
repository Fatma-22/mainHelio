<?php

namespace App\Http\Controllers;

use App\Models\Subscription;
use App\Models\Plan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class SubscriptionController extends Controller
{
    public function index(Request $request)
    {
        $subscriptions = Subscription::with('plan')
            ->where('user_id', $request->user()->id)
            ->paginate(10);
        
        return response()->json($subscriptions);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'plan_id' => 'required|exists:plans,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $plan = Plan::findOrFail($request->plan_id);

        $subscription = Subscription::create([
            'user_id' => $request->user()->id,
            'plan_id' => $plan->id,
            'start_date' => now(),
            'end_date' => now()->addDays($plan->duration),
            'status' => 'active',
        ]);

        return response()->json([
            'message' => 'Subscription created successfully',
            'subscription' => $subscription->load('plan'),
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $subscription = Subscription::where('id', $id)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        $validator = Validator::make($request->all(), [
            'status' => 'required|in:active,expired,cancelled',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $subscription->update(['status' => $request->status]);

        return response()->json([
            'message' => 'Subscription updated successfully',
            'subscription' => $subscription->load('plan'),
        ]);
    }

    public function destroy($id)
    {
        $subscription = Subscription::where('id', $id)
            ->where('user_id', auth()->id())
            ->firstOrFail();
        
        $subscription->delete();

        return response()->json(['message' => 'Subscription cancelled successfully']);
    }
}