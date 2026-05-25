<?php

namespace App\Models;

use App\Models\ShopDetail;
use Illuminate\Database\Eloquent\Model;

class Policy extends Model
{
    protected $fillable = [
        'shop_detail_id',
        'policy_number',
        'plan_id',
        'plan_name',
        'premium_amount',
        'start_date',
        'end_date',
        'status',
        'payment_status',
        'payment_intent_id',
    ];

    public function shop()
    {
        return $this->belongsTo(
            ShopDetail::class,
            'shop_detail_id'
        );
    }
}