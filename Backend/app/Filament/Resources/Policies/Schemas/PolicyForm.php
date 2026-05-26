<?php

namespace App\Filament\Resources\Policies\Schemas;

use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;

class PolicyForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('shop_detail_id')
                    ->required()
                    ->numeric(),
                TextInput::make('policy_number')
                    ->required(),
                TextInput::make('plan_id')
                    ->required(),
                TextInput::make('plan_name')
                    ->required(),
                TextInput::make('premium_amount')
                    ->required()
                    ->numeric(),
                DatePicker::make('start_date'),
                DatePicker::make('end_date'),
                Select::make('status')
                    ->options([
            'pending' => 'Pending',
            'active' => 'Active',
            'expired' => 'Expired',
            'cancelled' => 'Cancelled',
        ])
                    ->default('pending')
                    ->required(),
                Select::make('payment_status')
                    ->options(['pending' => 'Pending', 'paid' => 'Paid', 'failed' => 'Failed'])
                    ->default('pending')
                    ->required(),
                TextInput::make('payment_intent_id')
                    ->default(null),
            ]);
    }
}
