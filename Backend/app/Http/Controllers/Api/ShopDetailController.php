<?php

namespace App\Http\Controllers\Api;

use Carbon\Carbon;
use Stripe\Stripe;
use App\Models\Policy;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Stripe\PaymentIntent;
use App\Models\ShopDetail;
use App\Http\Controllers\Controller;

class ShopDetailController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | ADD SHOP
    |--------------------------------------------------------------------------
    */

    public function add(Request $request)
    {
        $request->validate([
            'shop_name' => 'required|string|max:255',
            'address' => 'required|string',
            'mobile' => 'required|string|max:20',
            'shop_type' => 'required|string|max:100',

            'front_image' => 'required|image|mimes:jpg,jpeg,png|max:4096',
            'closeup_image' => 'required|image|mimes:jpg,jpeg,png|max:4096',
            'serial_image' => 'required|image|mimes:jpg,jpeg,png|max:4096',
        ]);

        // STORE IMAGES
        $frontImagePath = $request
            ->file('front_image')
            ->store('shop-photos', 'public');

        $closeupImagePath = $request
            ->file('closeup_image')
            ->store('shop-photos', 'public');

        $serialImagePath = $request
            ->file('serial_image')
            ->store('shop-photos', 'public');

        // CREATE SHOP
        $shop = ShopDetail::create([
            'user_id' => auth()->id(),

            // SHOP DETAILS
            'shop_name' => $request->shop_name,
            'address' => $request->address,
            'mobile' => $request->mobile,
            'shop_type' => $request->shop_type,

            // IMAGES
            'front_image' => $frontImagePath,
            'closeup_image' => $closeupImagePath,
            'serial_image' => $serialImagePath,
        ]);

        return response()->json([
            'success' => true,

            'message' => 'Shop created successfully',

            'shop' => [
                'id' => $shop->id,
                'shop_name' => $shop->shop_name,
            ],
        ], 201);
    }

    public function createPolicy(Request $request)
    {
        $request->validate([
            'shop_id' => 'required|exists:shop_details,id',

            'plan_id' => 'required|string|max:100',

            'plan_name' => 'required|string|max:100',

            'payment_amount' => 'required|numeric',

            'duration_months' => 'required|numeric',
        ]);

        $shop = ShopDetail::findOrFail(
            $request->shop_id
        );

        // PREVENT DUPLICATE PENDING POLICY
        $existingPolicy = Policy::where(
            'shop_detail_id',
            $shop->id
        )
            ->where('status', 'pending')
            ->first();

        if ($existingPolicy) {

            return response()->json([
                'success' => true,

                'message' =>
                    'Existing pending policy found',

                'policy' => $existingPolicy,
            ]);
        }

        $policy = Policy::create([

            'shop_detail_id' => $shop->id,

            'policy_number' =>
                'PLC-' .
                strtoupper(
                    Str::random(10)
                ),

            'plan_id' =>
                $request->plan_id,

            'plan_name' =>
                $request->plan_name,

            'premium_amount' =>
                $request->payment_amount,

            'start_date' => null,

            'end_date' => null,

            'status' => 'pending',

            'payment_status' => 'pending',
        ]);

        return response()->json([
            'success' => true,

            'message' =>
                'Policy created successfully',

            'policy' => [
                'id' => $policy->id,

                'policy_number' =>
                    $policy->policy_number,

                'plan_name' =>
                    $policy->plan_name,

                'premium_amount' =>
                    $policy->premium_amount,

                'status' =>
                    $policy->status,
            ],
        ], 201);
    }
    /*
    |--------------------------------------------------------------------------
    | CREATE PAYMENT INTENT
    |--------------------------------------------------------------------------
    */

    public function createPayment(Request $request)
    {
        $request->validate([
            'policy_id' => 'required|exists:policies,id',
        ]);

        // FIND POLICY
        $policy = Policy::findOrFail(
            $request->policy_id
        );

        // STRIPE SECRET KEY
        Stripe::setApiKey(
            config('services.stripe.secret')
        );

        // CREATE PAYMENT INTENT
        $paymentIntent = PaymentIntent::create([
            'amount' => $policy->premium_amount * 100,

            'currency' => 'gbp',

            'metadata' => [
                'policy_id' => $policy->id,
                'user_id' => auth()->id(),
            ],

            'automatic_payment_methods' => [
                'enabled' => true,
            ],
        ]);

        return response()->json([
            'success' => true,

            'client_secret' =>
                $paymentIntent->client_secret,

            'payment_intent_id' =>
                $paymentIntent->id,
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | PAYMENT SUCCESS
    |--------------------------------------------------------------------------
    */

    public function paymentSuccess(Request $request)
    {
        $request->validate([
            'policy_id' => 'required',
            'payment_intent_id' => 'required',
        ]);

        // FIND EXISTING POLICY
        $policy = Policy::findOrFail(
            $request->policy_id
        );

        // AVOID DOUBLE PAYMENT UPDATE
        if (
            $policy->payment_status === 'paid'
        ) {
            return response()->json([
                'success' => true,

                'message' =>
                    'Policy already activated',
            ]);
        }

        // ACTIVATE POLICY
        $policy->update([

            'status' => 'active',

            'payment_status' => 'paid',

            'payment_intent_id' =>
                $request->payment_intent_id,

            'start_date' => now(),

            'end_date' => Carbon::now()
                ->addMonths(12),
        ]);

        return response()->json([
            'success' => true,

            'message' =>
                'Payment successful',
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | PAYMENT FAILED
    |--------------------------------------------------------------------------
    */

    public function paymentFailed(Request $request)
    {
        return response()->json([
            'success' => false,

            'message' => 'Payment failed',
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | MY POLICIES
    |--------------------------------------------------------------------------
    */

public function myPolicies(Request $request)
{
    $query = Policy::with('shop')
        ->whereHas(
            'shop',
            function ($q) {
                $q->where(
                    'user_id',
                    auth()->id()
                );
            }
        );

    // ?status=active
    if ($request->filled('status')) {
        $query->where(
            'status',
            $request->status
        );
    }

    $policies = $query
        ->latest()
        ->get()
        ->map(function ($policy) {

            return [

                'id' => $policy->id,

                'policy_number' =>
                    $policy->policy_number,

                'plan_name' =>
                    $policy->plan_name,

                'premium_amount' =>
                    $policy->premium_amount,

                'status' =>
                    $policy->status,

                'payment_status' =>
                    $policy->payment_status,

                'start_date' =>
                    $policy->start_date,

                'end_date' =>
                    $policy->end_date,

                'created_at' =>
                    $policy->created_at,

                'shop' => [

                    'id' =>
                        $policy->shop?->id,

                    'shop_name' =>
                        $policy->shop?->shop_name,

                    'address' =>
                        $policy->shop?->address,

                    'mobile' =>
                        $policy->shop?->mobile,

                    'shop_type' =>
                        $policy->shop?->shop_type,

                    'front_image' =>
                        $policy->shop?->front_image
                            ? asset(
                                'storage/' .
                                $policy->shop->front_image
                            )
                            : null,

                    'closeup_image' =>
                        $policy->shop?->closeup_image
                            ? asset(
                                'storage/' .
                                $policy->shop->closeup_image
                            )
                            : null,

                    'serial_image' =>
                        $policy->shop?->serial_image
                            ? asset(
                                'storage/' .
                                $policy->shop->serial_image
                            )
                            : null,
                ],
            ];
        });

    return response()->json([
        'success' => true,

        'policies' => $policies,
    ]);
}
}
