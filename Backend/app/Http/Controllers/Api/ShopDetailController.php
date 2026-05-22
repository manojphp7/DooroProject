<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ShopDetail;
use Illuminate\Http\Request;
use Stripe\Stripe;
use Stripe\PaymentIntent;

class ShopDetailController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | ADD SHOP / CREATE POLICY
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

            'plan_name' => 'required|string|max:100',
            'payment_amount' => 'required|numeric',
        ]);

        // STORE IMAGES
        $frontImagePath = $request
            ->file('front_image')
            ->store('shop-photos');

        $closeupImagePath = $request
            ->file('closeup_image')
            ->store('shop-photos');

        $serialImagePath = $request
            ->file('serial_image')
            ->store('shop-photos');

        // CREATE POLICY
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

            // PLAN
            'plan_name' => $request->plan_name,
            'payment_amount' => $request->payment_amount,

            // PAYMENT
            'payment_status' => 'pending',
        ]);

        return response()->json([
            'success' => true,

            'message' => 'Policy created successfully',

            'policy' => [
                'id' => $shop->id,

                'shop_name' => $shop->shop_name,

                'plan_name' => $shop->plan_name,

                'payment_amount' => $shop->payment_amount,

                'payment_status' => $shop->payment_status,
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
            'policy_id' => 'required|exists:shop_details,id',
        ]);

        $shop = ShopDetail::findOrFail(
            $request->policy_id
        );

        // STRIPE SECRET KEY
        Stripe::setApiKey(
            config('services.stripe.secret')
        );

        // CREATE PAYMENT INTENT
        $paymentIntent = PaymentIntent::create([
            'amount' => $shop->payment_amount * 100,

            'currency' => 'gbp',

            'metadata' => [
                'policy_id' => $shop->id,
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

        $shop = ShopDetail::findOrFail(
            $request->policy_id
        );

        $shop->update([
            'payment_status' => 'success',

            'payment_intent_id' =>
                $request->payment_intent_id,
        ]);

        return response()->json([
            'success' => true,

            'message' => 'Payment successful',
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | PAYMENT FAILED
    |--------------------------------------------------------------------------
    */

    public function paymentFailed(Request $request)
    {
        $request->validate([
            'policy_id' => 'required',
        ]);

        $shop = ShopDetail::findOrFail(
            $request->policy_id
        );

        $shop->update([
            'payment_status' => 'failed',
        ]);

        return response()->json([
            'success' => false,

            'message' => 'Payment failed',
        ]);
    }

    public function myPolicies()
    {
        $policies = ShopDetail::where(
            'user_id',
            auth()->id()
        )
            ->latest()
            ->get();

        return response()->json([
            'success' => true,
            'policies' => $policies,
        ]);
    }
}