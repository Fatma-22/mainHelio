<?php

namespace App\Http\Controllers;

use App\Models\SiteContent;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Stichoza\GoogleTranslate\GoogleTranslate;

class SiteContentController extends Controller
{
        public function index(Request $request)
    {
        $siteContents = SiteContent::all();
    
        // آخر تعديل لأي محتوى
        $lastModified = $siteContents->max('updated_at');
        $lastModifiedGMT = gmdate('D, d M Y H:i:s', strtotime($lastModified)) . ' GMT';
    
        // تحقق من If-Modified-Since
        $ifModifiedSince = $request->header('If-Modified-Since');
        if ($ifModifiedSince && strtotime($ifModifiedSince) >= strtotime($lastModified)) {
            return response()->noContent(304); // لم تتغير البيانات
        }
    
        return response()->json([
            'site_contents' => $siteContents
        ])->header('Last-Modified', $lastModifiedGMT)
          ->header('Cache-Control', 'public, max-age=0'); // 0 ثانية مثال
    }
    
    public function show(Request $request)
    {
        $lang = $request->query('lang', 'ar'); // عربي افتراضي
        $siteContent = SiteContent::first();
    
        $lastModified = $siteContent->updated_at;
        $lastModifiedGMT = gmdate('D, d M Y H:i:s', strtotime($lastModified)) . ' GMT';
    
        $ifModifiedSince = $request->header('If-Modified-Since');
        if ($ifModifiedSince && strtotime($ifModifiedSince) >= strtotime($lastModified)) {
            return response()->noContent(304);
        }
    
        // باقي كودك الأصلي بدون تغيير
        $content = $siteContent->toArray();
    
        if ($lang === 'en') {
            $tr = new GoogleTranslate('en');
    
            foreach (['heroTitle','heroSubtitle','aboutTitle','aboutSubtitle','servicesTitle','testimonialsTitle','contactTitle','contactSubtitle','workingHours','contactAddress'] as $field) {
                if(!empty($content[$field])) {
                    $content[$field] = $tr->translate($content[$field]);
                }
            }
    
            if(!empty($content['services']) && is_array($content['services'])) {
                foreach ($content['services'] as &$service) {
                    if(!empty($service['title'])) $service['title'] = $tr->translate($service['title']);
                    if(!empty($service['description'])) $service['description'] = $tr->translate($service['description']);
                }
            }
    
            if(!empty($content['testimonials']) && is_array($content['testimonials'])) {
                foreach ($content['testimonials'] as &$t) {
                    if(!empty($t['name'])) $t['name'] = $tr->translate($t['name']);
                    if(!empty($t['designation'])) $t['designation'] = $tr->translate($t['designation']);
                    if(!empty($t['quote'])) $t['quote'] = $tr->translate($t['quote']);
                }
            }
    
            if(!empty($content['aboutPoints']) && is_array($content['aboutPoints'])) {
                foreach ($content['aboutPoints'] as &$point) {
                    if(!empty($point['description'])) {
                        $point['description'] = $tr->translate($point['description']);
                    }
                }
            }
        }
    
        return response()->json(['site_content' => $content])
            ->header('Last-Modified', $lastModifiedGMT)
            ->header('Cache-Control', 'public, max-age=0');
    }


    // إضافة محتوى جديد
    public function store(Request $request)
    {
       $validator = Validator::make($request->all(), [
    'heroTitle' => 'sometimes|nullable|string',
    'heroSubtitle' => 'sometimes|nullable|string',
    'aboutTitle' => 'sometimes|nullable|string',
    'aboutSubtitle' => 'sometimes|nullable|string',
    'aboutPoints' => 'sometimes|array',
    'servicesTitle' => 'sometimes|nullable|string',
    'services' => 'sometimes|array',
    'testimonialsTitle' => 'sometimes|nullable|string',
    'testimonials' => 'sometimes|array',
    'contactTitle' => 'sometimes|nullable|string',
    'contactSubtitle' => 'sometimes|nullable|string',
    'contactPhone' => 'sometimes|nullable|string',
    'contactEmail' => 'sometimes|nullable|email',
    'contactAddress' => 'sometimes|nullable|string',
    'workingHours' => 'sometimes|nullable|string',
    'socialLinks' => 'sometimes|array',
]);



        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $siteContent = SiteContent::create([
            ...$request->all(),
            'updated_by' => $request->user()->id ?? null,
        ]);

        return response()->json([
            'message' => 'Site content created successfully',
            'site_content' => $siteContent
        ], 201);
    }

    // تعديل محتوى موجود (أول سجل)
    public function update(Request $request)
    {
        $siteContent = SiteContent::firstOrFail();

        $validator = Validator::make($request->all(), [
    'heroTitle' => 'sometimes|nullable|string',
    'heroSubtitle' => 'sometimes|nullable|string',
    'aboutTitle' => 'sometimes|nullable|string',
    'aboutSubtitle' => 'sometimes|nullable|string',
    'aboutPoints' => 'sometimes|array',
    'servicesTitle' => 'sometimes|nullable|string',
    'services' => 'sometimes|array',
    'testimonialsTitle' => 'sometimes|nullable|string',
    'testimonials' => 'sometimes|array',
    'contactTitle' => 'sometimes|nullable|string',
    'contactSubtitle' => 'sometimes|nullable|string',
    'contactPhone' => 'sometimes|nullable|string',
    'contactEmail' => 'sometimes|nullable|email',
    'contactAddress' => 'sometimes|nullable|string',
    'workingHours' => 'sometimes|nullable|string',
    'socialLinks' => 'sometimes|array',
]);


        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $siteContent->update($request->all() + ['updated_by' => $request->user()->id ?? null]);

        return response()->json([
            'message' => 'Site content updated successfully',
            'site_content' => $siteContent
        ]);
    }

    // حذف محتوى (أول سجل)
    public function destroy()
    {
        $siteContent = SiteContent::firstOrFail();
        $siteContent->delete();

        return response()->json(['message' => 'Site content deleted successfully']);
    }
}
