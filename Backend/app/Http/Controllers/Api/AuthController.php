<?php

namespace App\Http\Controllers\Api;
use Illuminate\Support\Facades\Hash;
use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\URL;

class AuthController extends Controller
{
    public function socialLogin(Request $request)
    {
        $request->validate([
            'provider' => 'required|string',
            'provider_id' => 'nullable|string',
            'name' => 'required|string',
            'email' => 'required|email',
            'avatar' => 'nullable|string',
        ]);

        // Existing user check
        $user = User::where('email', $request->email)->first();

        // New user create
        if (!$user) {

            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'provider' => $request->provider,
                'provider_id' => $request->provider_id,
                'avatar' => $request->avatar,
                'password' => bcrypt(Str::random(16)),
            ]);
        }

        // Token create
        $token = $user->createToken('mobile-token')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Login successful',
            'token' => $token,
            'user' => $user,
        ]);
    }

    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|min:6',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => bcrypt($request->password),

            'provider' => null,
            'provider_id' => null,
            'photo' => null,
        ]);

        $token = $user->createToken('mobile-token')->plainTextToken;

        // verification url generate
        $verificationUrl = URL::temporarySignedRoute(
            'verification.verify',
            now()->addMinutes(60),
            [
                'id' => $user->id,
                'hash' => sha1($user->email),
            ]
        );

        return response()->json([
            'success' => true,
            'message' => 'Registration successful',
            'token' => $token,
            'verification_url' => $verificationUrl,
            'user' => $user,
        ]);
   }

   public function login(Request $request)
    {
    $request->validate([
        'email' => 'required|email',
        'password' => 'required',
    ]);

    $user = User::where('email', $request->email)->first();

    if (!$user || !Hash::check($request->password, $user->password)) {

        return response()->json([
            'success' => false,
            'message' => 'Invalid credentials'
        ], 401);
    }

    // email verify check
    if (!$user->email_verified_at) {

        return response()->json([
            'success' => false,
            'message' => 'Please verify your email first'
        ], 403);
    }

    $token = $user->createToken('mobile-token')->plainTextToken;

    return response()->json([
        'success' => true,
        'token' => $token,
        'user' => $user,
    ]);
    }
}