<?php

namespace App\Filament\Resources\Policies\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class PoliciesTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
    TextColumn::make('policy_number')
        ->searchable(),

    TextColumn::make('shop.shop_name')
        ->label('Shop')
        ->searchable(),

    TextColumn::make('shop.user.name')
        ->label('Owner')
        ->searchable(),

    TextColumn::make('premium_amount')
        ->money('GBP'),

    TextColumn::make('status')
        ->badge()
        ->color(fn (string $state): string => match ($state) {
            'active' => 'success',
            'expired' => 'danger',
            'pending' => 'warning',
            default => 'gray',
        }),

    TextColumn::make('start_date')
        ->date(),

    TextColumn::make('end_date')
        ->date(),
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
