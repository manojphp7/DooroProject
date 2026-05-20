<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ShopDetail extends Model
{
    protected $fillable = [
        'user_id',

        'shop_name',
        'address',
        'mobile',
        'shop_type',

        'front_image',
        'closeup_image',
        'serial_image',

        'plan_name',
        'payment_amount',
        'payment_status',
    ];
}