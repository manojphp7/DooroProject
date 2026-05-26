<?php

namespace App\Filament\Resources\Claims\Schemas;

use Filament\Schemas\Schema;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\DateTimePicker;

class ClaimForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([

                Select::make('policy_id')
                    ->label('Policy Number')
                    ->relationship('policy', 'policy_number')
                    ->disabled()
                    ->dehydrated(false),

                Select::make('user_id')
                    ->label('User')
                    ->relationship('user', 'name')
                    ->disabled()
                    ->dehydrated(false),

                TextInput::make('claim_amount')
                    ->label('Claim Amount')
                    ->numeric()
                    ->required(),

            
                Textarea::make('admin_notes')
                    ->label('Admin Notes')
                    ->rows(4),

                DateTimePicker::make('resolved_at')
                    ->label('Resolved At'),

                Select::make('status')
                    ->options([
                        'pending' => 'Pending',
                        'processing' => 'Processing',
                        'approved' => 'Approved',
                        'rejected' => 'Rejected',
                    ])
                    ->required(),
            ]);
    }
}