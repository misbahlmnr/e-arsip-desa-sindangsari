<?php

namespace App\Services;

use App\Http\Requests\User\StoreRequest;
use App\Http\Requests\User\UpdateRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserService
{
    /**
     * Sortable columns (whitelist).
     *
     * @var list<string>
     */
    private const SORTABLE = [
        'id',
        'name',
        'username',
        'email',
        'role',
        'created_at',
    ];

    /**
     * @return array{users: \Illuminate\Contracts\Pagination\LengthAwarePaginator, filters: array<string, mixed>}
     */
    public function index(Request $req): array
    {
        $validated = $req->validate([
            'page' => ['nullable', 'integer', 'min:1'],
            'search' => ['nullable', 'string', 'max:255'],
            'sort_by' => ['nullable', 'string', 'max:64'],
            'sort_dir' => ['nullable', 'in:asc,desc'],
            'per_page' => ['nullable', 'integer', 'in:10,20,50,100'],
            'role' => ['nullable', 'in:admin,sekdes,kades'],
        ]);

        $search = isset($validated['search']) ? trim($validated['search']) : '';
        $perPage = (int) ($validated['per_page'] ?? 10);
        $sortBy = $validated['sort_by'] ?? 'name';
        $sortDir = $validated['sort_dir'] ?? 'asc';
        $role = $validated['role'] ?? null;

        if (! in_array($sortBy, self::SORTABLE, true)) {
            $sortBy = 'name';
        }

        $query = User::query()
            ->when($search !== '', function ($q) use ($search) {
                $like = '%'.$search.'%';
                $q->where(function ($q) use ($like) {
                    $q->where('name', 'like', $like)
                        ->orWhere('username', 'like', $like)
                        ->orWhere('email', 'like', $like);
                });
            })
            ->when($role, function ($q) use ($role) {
                $q->where('role', $role);
            })
            ->orderBy($sortBy, $sortDir);

        $users = $query->paginate($perPage)->withQueryString();

        return [
            'users' => $users,
            'filters' => [
                'search' => $search !== '' ? $search : null,
                'sort_by' => $sortBy,
                'sort_dir' => $sortDir,
                'per_page' => $perPage,
                'role' => $role,
            ],
        ];
    }

    public function store(StoreRequest $req): User
    {
        $data = $req->validated();
        $data['password'] = Hash::make($data['password']);

        return User::create($data);
    }

    public function update(UpdateRequest $req, User $user): bool
    {
        $data = $req->validated();
        if (! empty($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        } else {
            unset($data['password']);
        }

        return $user->update($data);
    }

    /**
     * @return string|null Error message, or null when deleted.
     */
    public function destroy(User $user): ?string
    {
        if (auth()->id() === $user->id) {
            return 'Tidak dapat menghapus akun sendiri.';
        }

        if ($user->isAdmin() && User::query()->where('role', 'admin')->count() <= 1) {
            return 'Tidak dapat menghapus satu-satunya akun administrator.';
        }

        $user->delete();

        return null;
    }
}
