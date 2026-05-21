<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RolePermissionTest extends TestCase
{
    use RefreshDatabase;

    public function test_kades_can_view_surat_masuk_index(): void
    {
        $kades = User::factory()->create(['role' => 'kades']);

        $this->actingAs($kades)
            ->get(route('admin.surat-masuk.index'))
            ->assertOk();
    }

    public function test_kades_can_view_arsip_surat_index(): void
    {
        $kades = User::factory()->create(['role' => 'kades']);

        $this->actingAs($kades)
            ->get(route('admin.arsip-surat.index'))
            ->assertOk();
    }

    public function test_kades_cannot_access_surat_masuk_create(): void
    {
        $kades = User::factory()->create(['role' => 'kades']);

        $this->actingAs($kades)
            ->get(route('admin.surat-masuk.create'))
            ->assertForbidden();
    }

    public function test_sekdes_cannot_access_surat_masuk_create(): void
    {
        $sekdes = User::factory()->create(['role' => 'sekdes']);

        $this->actingAs($sekdes)
            ->get(route('admin.surat-masuk.create'))
            ->assertForbidden();
    }

    public function test_admin_can_access_surat_masuk_create(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);

        $this->actingAs($admin)
            ->get(route('admin.surat-masuk.create'))
            ->assertOk();
    }

    public function test_user_permission_helpers(): void
    {
        $admin = User::factory()->make(['role' => 'admin']);
        $sekdes = User::factory()->make(['role' => 'sekdes']);
        $kades = User::factory()->make(['role' => 'kades']);

        $this->assertTrue($admin->canManageSurat());
        $this->assertTrue($admin->canViewSurat());
        $this->assertFalse($admin->canCreateDisposisi());
        $this->assertTrue($admin->canManageUsers());
        $this->assertTrue($admin->canExportLaporan());

        $this->assertFalse($sekdes->canManageSurat());
        $this->assertTrue($sekdes->canViewSurat());
        $this->assertTrue($sekdes->canCreateDisposisi());
        $this->assertFalse($sekdes->canManageUsers());
        $this->assertFalse($sekdes->canExportLaporan());

        $this->assertFalse($kades->canManageSurat());
        $this->assertTrue($kades->canViewSurat());
        $this->assertTrue($kades->canCreateDisposisi());
        $this->assertFalse($kades->canManageUsers());
        $this->assertTrue($kades->canExportLaporan());
    }
}
