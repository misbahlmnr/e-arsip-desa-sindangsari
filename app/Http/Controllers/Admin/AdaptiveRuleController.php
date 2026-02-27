<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AdaptiveRule;
use App\Models\Mapel;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdaptiveRuleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $adaptiveRules = AdaptiveRule::with('mapel')->paginate(10);
        return Inertia::render('Admin/AdaptiveRule/Index', ['adaptiveRules' => $adaptiveRules]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $mapels = Mapel::all();
        return Inertia::render('Admin/AdaptiveRule/Create', ['mapels' => $mapels]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'mapel_id' => 'required|exists:mapel,id',
            'min_score' => 'required|numeric|min:0|max:100',
            'kategori_rekomendasi' => 'required|string|max:255',
        ]);

        AdaptiveRule::create($validated);

        return redirect()->route('admin.adaptive-rule.index')->with('success', 'Adaptive Rule berhasil ditambahkan');
    }

    /**
     * Display the specified resource.
     */
    public function show(AdaptiveRule $adaptiveRule)
    {
        $adaptiveRule->load('mapel');
        return Inertia::render('Admin/AdaptiveRule/Show', ['adaptiveRule' => $adaptiveRule]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(AdaptiveRule $adaptiveRule)
    {
        $adaptiveRule->load('mapel');
        $mapels = Mapel::all();
        return Inertia::render('Admin/AdaptiveRule/Edit', [
            'adaptiveRule' => $adaptiveRule,
            'mapels' => $mapels
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, AdaptiveRule $adaptiveRule)
    {
        $validated = $request->validate([
            'mapel_id' => 'required|exists:mapel,id',
            'min_score' => 'required|numeric|min:0|max:100',
            'kategori_rekomendasi' => 'required|string|max:255',
        ]);

        $adaptiveRule->update($validated);

        return redirect()->route('admin.adaptive-rule.index')->with('success', 'Adaptive Rule berhasil diperbarui');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(AdaptiveRule $adaptiveRule)
    {
        $adaptiveRule->delete();
        return redirect()->route('admin.adaptive-rule.index')->with('success', 'Adaptive Rule berhasil dihapus');
    }
}
