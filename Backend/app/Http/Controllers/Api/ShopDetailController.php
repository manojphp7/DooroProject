<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ShopDetail;
use Illuminate\Http\Request;

class ShopDetailController extends Controller
{
    public function add(Request $request)
    {
        $request->validate([
            'shop_name'     => 'required|string|max:255',
            'address'       => 'required|string',
            'mobile'        => 'required|string|max:20',
            'shop_type'     => 'required|string|max:100',

            'front_image'   => 'required|image|mimes:jpg,jpeg,png|max:4096',
            'closeup_image' => 'required|image|mimes:jpg,jpeg,png|max:4096',
            'serial_image'  => 'required|image|mimes:jpg,jpeg,png|max:4096',

            'plan_name'     => 'nullable|string|max:100',
            'payment_amount'=> 'nullable|numeric',
        ]);

        // PRIVATE STORAGE
        $frontImagePath = $request
            ->file('front_image')
            ->store('shop-photos');

        $closeupImagePath = $request
            ->file('closeup_image')
            ->store('shop-photos');

        $serialImagePath = $request
            ->file('serial_image')
            ->store('shop-photos');

        $shop = ShopDetail::create([
            'user_id' => auth()->id(),

            'shop_name' => $request->shop_name,
            'address'   => $request->address,
            'mobile'    => $request->mobile,
            'shop_type' => $request->shop_type,

            'front_image'   => $frontImagePath,
            'closeup_image' => $closeupImagePath,
            'serial_image'  => $serialImagePath,

            'plan_name'      => $request->plan_name,
            'payment_amount' => $request->payment_amount ?? 0,
            'payment_status' => 'pending',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Shop created successfully',
            'data'    => $shop,
        ], 201);
    }
}