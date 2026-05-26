<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Claim;
use App\Models\ClaimImage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class ClaimController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | CREATE CLAIM
    |--------------------------------------------------------------------------
    */

    public function store(Request $request)
    {
        $request->validate([
            'policy_id' => 'required|exists:policies,id',

            'reason' => 'required|string|max:255',

            'claim_amount' => 'nullable|numeric',

            'images.*' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
        ]);

        DB::beginTransaction();

        try {

            $claim = Claim::create([
                'policy_id' => $request->policy_id,
                'user_id' => auth()->id(),
                'claim_number' => 'CLM-' . strtoupper(Str::random(8)),
                'reason' => $request->reason,
                'description' => $request->description,
                'incident_date' => $request->incident_date,
                'claim_amount' => 0,
                'status' => 'pending',
            ]);

            /*
            |--------------------------------------------------------------------------
            | SAVE IMAGES
            |--------------------------------------------------------------------------
            */

            if ($request->hasFile('images')) {

                foreach ($request->file('images') as $image) {

                    $path = $image->store(
                        'claims',
                        'public'
                    );

                    ClaimImage::create([
                        'claim_id' => $claim->id,

                        'image_path' => $path,
                    ]);
                }
            }

            DB::commit();

            return response()->json([
                'success' => true,

                'message' =>
                    'Claim submitted successfully',

                'claim' => $claim->load([
                    'images',
                    'policy',
                ]),
            ]);

        } catch (\Exception $e) {

            DB::rollBack();

            return response()->json([
                'success' => false,

                'message' => $e->getMessage(),
            ], 500);
        }
    }

    /*
    |--------------------------------------------------------------------------
    | GET ALL USER CLAIMS
    |--------------------------------------------------------------------------
    */

    public function getClaims()
    {
        $claims = Claim::with([
            'images',
            'policy',
        ])
            ->where('user_id', auth()->id())
            ->latest()
            ->get();

        return response()->json([
            'success' => true,

            'claims' => $claims,
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | SINGLE CLAIM DETAIL
    |--------------------------------------------------------------------------
    */

    public function show($id)
    {
        $claim = Claim::with([
            'images',
            'policy',
        ])
            ->where('user_id', auth()->id())
            ->find($id);

        if (!$claim) {

            return response()->json([
                'success' => false,

                'message' => 'Claim not found',
            ], 404);
        }

        return response()->json([
            'success' => true,

            'claim' => $claim,
        ]);
    }

    public function claimDetail($id)
    {
        $claim = Claim::with([
            'policy.shop',
            'user',
            'images'
        ])->find($id);

        if (!$claim) {
            return response()->json([
                'status' => false,
                'message' => 'Claim not found'
            ], 404);
        }

        return response()->json([
            'status' => true,
            'message' => 'Claim detail fetched successfully',
            'claim' => [
                'id' => $claim->id,
                'claim_number' => $claim->claim_number,
                'reason' => $claim->reason,
                'description' => $claim->description,
                'incident_date' => $claim->incident_date,
                'claim_amount' => $claim->claim_amount,
                'approved_amount' => $claim->approved_amount,
                'status' => $claim->status,
                'admin_notes' => $claim->admin_notes,
                'resolved_at' => $claim->resolved_at,

                // Policy Detail
                'policy' => [
                    'id' => $claim->policy?->id,
                    'policy_number' => $claim->policy?->policy_number,
                    'plan_name' => $claim->policy?->plan_name,
                    'premium_amount' => $claim->policy?->premium_amount,
                    'start_date' => $claim->policy?->start_date,
                    'end_date' => $claim->policy?->end_date,
                    'status' => $claim->policy?->status,
                ],

                // Shop Detail
                'shop' => [
                    'id' => $claim->policy?->shop?->id,
                    'shop_name' => $claim->policy?->shop?->shop_name,
                    'address' => $claim->policy?->shop?->address,
                    'mobile' => $claim->policy?->shop?->mobile,
                    'shop_type' => $claim->policy?->shop?->shop_type,
                ],

                // Claim Images
                'images' => $claim->images->map(function ($image) {
                    return [
                        'id' => $image->id,
                        'image' => $image->image_url,
                    ];
                }),
            ]
        ]);
    }
}