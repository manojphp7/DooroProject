<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ShopDetailController;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Auth\Events\Verified;

Route::post('/auth/social-login', [AuthController::class, 'socialLogin']);
Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::get('/email/verify/{id}/{hash}', function (
    Request $request,
    $id,
    $hash
) {

    $user = User::find($id);

    if (!$user) {
        return response()->json([
            'success' => false,
            'message' => 'User not found'
        ], 404);
    }

    // hash verify
    if (! hash_equals(
        (string) $hash,
        sha1($user->getEmailForVerification())
    )) {
        return response()->json([
            'success' => false,
            'message' => 'Invalid verification link'
        ], 403);
    }

    // already verified
    if (!$user->hasVerifiedEmail()) {

        $user->markEmailAsVerified();

        event(new Verified($user));
    }

    // create login token
    $token = $user->createToken('mobile')->plainTextToken;

    // open app + send token
    return redirect()->away(
        "com.app.dooro://email-verified?token={$token}"
    );

})->middleware('signed')->name('verification.verify');


Route::post('/forgot-password', function (Request $request) {

    $request->validate([
        'email' => 'required|email',
    ]);

    $status = Password::sendResetLink(
        $request->only('email')
    );

    // user find
    $user = User::where('email', $request->email)->first();

    // reset token find
    $reset = DB::table('password_reset_tokens')
        ->where('email', $request->email)
        ->first();

    $resetUrl = null;

    if ($reset && $user) {

        $resetUrl =
            "com.app.dooro://reset-password" .
            "?token={$reset->token}" .
            "&email={$user->email}";
    }

    return $status === Password::RESET_LINK_SENT
        ? response()->json([
            'success' => true,
            'message' => __($status),
            'reset_url' => $resetUrl,
        ])
        : response()->json([
            'success' => false,
            'message' => __($status)
        ], 400);
});


Route::post('/reset-password', function (Request $request) {

    $request->validate([
        'token' => 'required',
        'email' => 'required|email',
        'password' => 'required|min:6|confirmed',
    ]);

    $status = Password::reset(
        $request->only(
            'email',
            'password',
            'password_confirmation',
            'token'
        ),
        function (User $user, string $password) {

            $user->forceFill([
                'password' => bcrypt($password)
            ])->save();
        }
    );

    return $status === Password::PASSWORD_RESET
        ? response()->json([
            'success' => true,
            'message' => __($status),
        ])
        : response()->json([
            'success' => false,
            'message' => __($status),
        ], 400);
});

Route::get('/plans', function () {
    
    return response()->json([
        [
            "id" => "basic",
            "title" => "Basic Cover",
            "price" => "£100",
            "subtitle" => "No parts replacement",
            "icon" => "🛠️",
            "duration"=> "12 months",
            "features" => [
                "Shutter damage protection",
                "24/7 claims support",
                "Public liability included"
            ]
        ],

        [
            "id" => "full",
            "title" => "Full Cover",
            "price" => "£250",
            "subtitle" => "Parts & labour included",
            "icon" => "🛡️",
            "duration"=> "12 months",
            "features" => [
                "Everything in Basic",
                "Full parts replacement",
                "Accidental damage cover",
                "Priority repair support"
            ]
        ]
    ]);
});

Route::middleware('auth:sanctum')->group(function () {

    Route::post(
        '/add-shop',
        [ShopDetailController::class, 'add']
    );

    Route::post(
        '/create-payment',
        [ShopDetailController::class, 'createPayment']
    );

    Route::post(
        '/payment-success',
        [ShopDetailController::class, 'paymentSuccess']
    );

    Route::post(
        '/payment-failed',
        [ShopDetailController::class, 'paymentFailed']
    );



    Route::get(
    '/my-policies',
    [ShopDetailController::class, 'myPolicies']
    );
});

