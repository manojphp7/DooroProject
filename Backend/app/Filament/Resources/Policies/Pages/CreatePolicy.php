<?php

namespace App\Filament\Resources\Policies\Pages;

use App\Filament\Resources\Policies\PolicyResource;
use App\Models\Policy;
use Filament\Resources\Pages\CreateRecord;
use Illuminate\Validation\ValidationException;

class CreatePolicy extends CreateRecord
{
    protected static string $resource = PolicyResource::class;

    protected function beforeCreate(): void
    {
        $shopId = $this->data['shop_id'];

        $exists = Policy::where('shop_id', $shopId)
            ->where('status', 'active')
            ->exists();

        if ($exists) {
            throw ValidationException::withMessages([
                'shop_id' => 'This shop already has an active policy.',
            ]);
        }
    }
}
