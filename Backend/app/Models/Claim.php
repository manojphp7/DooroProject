<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Claim extends Model
{
    use HasFactory;
    protected $fillable = [
        'policy_id',
        'user_id',
        'claim_number',
        'reason',
        'description',
        'incident_date',
        'claim_amount',
        'approved_amount',
        'admin_notes',
        'resolved_at',
        'status',
    ];

    // ✅ Policy relation (IMPORTANT: specify FK clearly)
    public function policy()
    {
        return $this->belongsTo(Policy::class, 'policy_id');
    }

    // User relation
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    // Images relation
    public function images()
    {
        return $this->hasMany(ClaimImage::class, 'claim_id');
    }
    
}