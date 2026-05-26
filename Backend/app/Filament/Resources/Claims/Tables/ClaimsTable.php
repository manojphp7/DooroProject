<?php

namespace App\Filament\Resources\Claims\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class ClaimsTable
{
    public static function configure(Table $table): Table
    {
        return $table
           ->columns([
    TextColumn::make('claim_number')
        ->searchable(),

    TextColumn::make('policy.policy_number')
        ->label('Policy')
        ->searchable(),

    TextColumn::make('policy.shop.shop_name')
        ->label('Shop')
        ->searchable(),

    TextColumn::make('policy.shop.user.name')
        ->label('Owner')
        ->searchable(),

    TextColumn::make('claim_amount')
        ->money('GBP'),

    TextColumn::make('status')
        ->badge()
        ->color(fn (string $state): string => match ($state) {
            'pending' => 'warning',
            'approved' => 'success',
            'rejected' => 'danger',
            'processing' => 'info',
            default => 'gray',
        }),

    TextColumn::make('created_at')
        ->since(),
])
            ->filters([
                //
            ])
            ->recordActions([
                EditAction::make(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ]);
    }
}
