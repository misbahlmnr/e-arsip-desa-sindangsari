<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\User\StoreRequest;
use App\Http\Requests\User\UpdateRequest;
use App\Models\User;
use App\Services\UserService;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function __construct(protected UserService $services) {}

    public function index(Request $request)
    {
        $data = $this->services->index($request);

        return inertia('users/Index', [
            'users' => $data['users'],
            'filters' => $data['filters'],
        ]);
    }

    public function create()
    {
        return inertia('users/Create');
    }

    public function show(User $user)
    {
        return inertia('users/Show', [
            'user' => $user,
        ]);
    }

    public function edit(User $user)
    {
        return inertia('users/Edit', [
            'user' => $user,
        ]);
    }

    public function store(StoreRequest $request)
    {
        $this->services->store($request);

        return redirect()->route('admin.users.index')->with('success', 'Pengguna berhasil ditambahkan.');
    }

    public function update(UpdateRequest $request, User $user)
    {
        if (auth()->id() === $user->id && $request->input('role') !== $user->role) {
            return back()->withErrors(['role' => 'Anda tidak dapat mengubah peran akun sendiri.'])->withInput();
        }

        $this->services->update($request, $user);

        return redirect()->route('admin.users.index')->with('success', 'Pengguna berhasil diperbarui.');
    }

    public function destroy(User $user)
    {
        $error = $this->services->destroy($user);
        if ($error !== null) {
            return redirect()->route('admin.users.index')->with('error', $error);
        }

        return redirect()->route('admin.users.index')->with('success', 'Pengguna berhasil dihapus.');
    }
}
