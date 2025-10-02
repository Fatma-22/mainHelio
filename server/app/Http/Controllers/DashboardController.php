<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function getStats()
    {
        // 🟢 إجمالي العقارات المنشورة
        $totalProperties = DB::table('properties')
            ->where('is_published', 1)
            ->count();

        // 🟡 الاستفسارات الجديدة
        $newInquiries = DB::table('inquiries')
            ->where('status', 'جديد')
            ->count();

        // 🟠 العقارات غير المنشورة (قيد المراجعة)
        $pendingProperties = DB::table('properties')
            ->where('is_published', 0)
            ->count();

        // 🔵 طلبات الخدمات الجديدة (تشطيب + ديكور)
        $finishingRequestsCount = DB::table('finishing_requests')
            ->where('status', 'جديد')
            ->count();

        $decorationRequestsCount = DB::table('decor_requests')
            ->where('status', 'جديد')
            ->count();

        $newServiceRequests = $finishingRequestsCount + $decorationRequestsCount;

        // 🟤 العقارات حسب النوع
        $propertiesByType = DB::table('properties')
            ->select('type', DB::raw('COUNT(*) as count'))
            ->where('is_published', 1)
            ->groupBy('type')
            ->get();

        // 📝 أحدث العقارات
        $latestProperties = DB::table('properties')
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get(['id', 'title_ar', 'type', 'created_at']);

        // 📝 أحدث الاستفسارات
        $latestInquiries = DB::table('inquiries')
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get(['id', 'name', 'phone', 'created_at']);

        // 📝 أحدث طلبات التشطيب
        $latestFinishingRequests = DB::table('finishing_requests as fr')
            ->join('customers as c', 'fr.requested_by', '=', 'c.id')
            ->orderBy('fr.created_at', 'desc')
            ->limit(3)
            ->get([
                'fr.id',
                'fr.status',
                'fr.created_at',
                'c.name as customer_name',
                'c.phone as customer_phone',
            ]);

        // 📝 أحدث طلبات الديكور
        $latestDecorRequests = DB::table('decor_requests as dr')
            ->join('customers as c', 'dr.requested_by', '=', 'c.id')
            ->orderBy('dr.created_at', 'desc')
            ->limit(3)
            ->get([
                'dr.id',
                'dr.status',
                'dr.created_at',
                'c.name as customer_name',
                'c.phone as customer_phone',
            ]);

        // دمج الطلبات مع ترتيبها حسب تاريخ الإنشاء
        $latestRequests = $latestFinishingRequests
            ->merge($latestDecorRequests)
            ->sortByDesc('created_at')
            ->take(5)
            ->values();

        return response()->json([
            'totalProperties'          => $totalProperties,
            'newInquiries'            => $newInquiries,
            'newServiceRequests'      => $newServiceRequests,
            'pendingPropertyRequests' => $pendingProperties,
            'propertiesByType'        => $propertiesByType,
            'latestActivities'        => [
                'properties' => $latestProperties,
                'inquiries'  => $latestInquiries,
                'requests'   => $latestRequests,
            ],
        ]);
    }
}
