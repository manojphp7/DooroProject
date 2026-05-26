<?php

namespace App\Models;

use App\Models\Policy;
use Illuminate\Database\Eloquent\Model;

class ShopDetail extends Model
{
    protected $fillable = [
        'user_id',

        // SHOP DETAILS
        'shop_name',
        'address',
        'mobile',
        'shop_type',

        // IMAGES
        'front_image',
        'closeup_image',
        'serial_image',
    ];

 public function policies()
{
    return $this->hasMany(Policy::class, 'shop_detail_id');
}

public function user()
{
    return $this->belongsTo(User::class);
}
}