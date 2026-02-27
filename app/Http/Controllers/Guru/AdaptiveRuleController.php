<?php

namespace App\Http\Controllers\Guru;

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
    public function index(Request $request)
    {
        $query = AdaptiveRule::whereHas('mapel', function ($q) {
            $q->whereHas('gurus', function ($subQ) {
                $subQ->where('guru_id', auth()->id());
            });
        })
        ->with('mapel');

        // Apply filters
        if ($request->filled('mapel_id')) {
            $query->where('mapel_id', $request->mapel_id);
        }

        if ($request->filled('kategori_rekomendasi')) {
            $query->where('kategori_rekomendasi', 'like', '%' . $request->kategori_rekomendasi . '%');
        }

        if ($request->filled('min_score')) {
            $query->where('min_score', '>=', $request->min_score);
        }

        $adaptiveRules = $query->paginate(10);

        // Get available mapels for the guru
        $mapels = auth()->user()->mapels;

        return Inertia::render('Guru/AdaptiveRules/Index', [
            'adaptiveRules' => $adaptiveRules,
            'mapels' => $mapels,
            'filters' => $request->only(['mapel_id', 'kategori_rekomendasi', 'min_score'])
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $mapels = auth()->user()->mapels;
        return Inertia::render('Guru/AdaptiveRules/Create', ['mapels' => $mapels]);
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

        // Ensure the mapel belongs to the current guru
        $mapel = Mapel::find($validated['mapel_id']);
        if (!$mapel->gurus()->where('guru_id', auth()->id())->exists()) {
            abort(403);
        }

        AdaptiveRule::create($validated);

        return redirect()->route('guru.adaptive-rules.index')->with('success', 'Adaptive Rule berhasil ditambahkan');
    }

    /**
     * Display the specified resource.
     */
    public function show(AdaptiveRule $adaptiveRule)
    {
        // Ensure the adaptive rule belongs to the current guru's mapel
        if (!$adaptiveRule->mapel->gurus()->where('guru_id', auth()->id())->exists()) {
            abort(403);
        }

        $adaptiveRule->load('mapel');
        return Inertia::render('Guru/AdaptiveRules/Show', ['adaptiveRule' => $adaptiveRule]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(AdaptiveRule $adaptiveRule)
    {
        // Ensure the adaptive rule belongs to the current guru's mapel
        if (!$adaptiveRule->mapel->gurus()->where('guru_id', auth()->id())->exists()) {
            abort(403);
        }

        $adaptiveRule->load('mapel');
        $mapels = auth()->user()->mapels;
        return Inertia::render('Guru/AdaptiveRules/Edit', [
            'adaptiveRule' => $adaptiveRule,
            'mapels' => $mapels
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, AdaptiveRule $adaptiveRule)
    {
        if (!$adaptiveRule->mapel->gurus()->where('guru_id', auth()->id())->exists()) {
            abort(403);
        }

        $validated = $request->validate([
            'mapel_id' => 'required|exists:mapel,id',
            'min_score' => 'required|numeric|min:0|max:100',
            'kategori_rekomendasi' => 'required|string|max:255',
        ]);

        // Ensure the new mapel belongs to the current guru
        $mapel = Mapel::find($validated['mapel_id']);
        if (!$mapel->gurus()->where('guru_id', auth()->id())->exists()) {
            abort(403);
        }

        $adaptiveRule->update($validated);

        return redirect()->route('guru.adaptive-rules.index')->with('success', 'Adaptive Rule berhasil diperbarui');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(AdaptiveRule $adaptiveRule)
    {
        // Ensure the adaptive rule belongs to the current guru's mapel
        if (!$adaptiveRule->mapel->gurus()->where('guru_id', auth()->id())->exists()) {
            abort(403);
        }

        $adaptiveRule->delete();
        return redirect()->route('guru.adaptive-rules.index')->with('success', 'Adaptive Rule berhasil dihapus');
    }
}
