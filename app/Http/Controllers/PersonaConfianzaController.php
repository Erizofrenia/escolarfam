<?php

namespace App\Http\Controllers;

use App\Models\PersonaConfianza;
use Illuminate\Http\Request;

class PersonaConfianzaController extends Controller
{
    /**
     * Obtener personas de confianza de un padre
     */
    public function index($idPadre)
    {
        $personas = PersonaConfianza::where('id_padre', $idPadre)
            ->where('activa', 1)
            ->orderBy('predeterminada', 'desc')
            ->orderBy('nombre_completo')
            ->get();

        return response()->json($personas);
    }

    /**
     * Agregar persona de confianza
     */
    public function store(Request $request)
    {
        $request->validate([
            'id_padre' => 'required|integer',
            'nombre_completo' => 'required|string|max:255'
        ]);

        $persona = PersonaConfianza::create([
            'id_padre' => $request->id_padre,
            'nombre_completo' => $request->nombre_completo,
            'parentesco' => $request->parentesco,
            'telefono' => $request->telefono,
            'predeterminada' => $request->predeterminada ?? false
        ]);

        return response()->json([
            'message' => 'Persona de confianza agregada',
            'id' => $persona->id_persona
        ], 201);
    }

    /**
     * Actualizar persona de confianza
     */
    public function update(Request $request, $id)
    {
        $persona = PersonaConfianza::find($id);

        if (!$persona) {
            return response()->json(['message' => 'Persona no encontrada'], 404);
        }

        $persona->fill($request->only(['nombre_completo', 'parentesco', 'telefono', 'predeterminada']));
        $persona->save();

        return response()->json(['message' => 'Persona de confianza actualizada']);
    }

    /**
     * Establecer como predeterminada
     */
    public function setPredeterminada(Request $request, $id)
    {
        $persona = PersonaConfianza::find($id);

        if (!$persona) {
            return response()->json(['message' => 'Persona no encontrada'], 404);
        }

        // Quitar predeterminada de otras
        PersonaConfianza::where('id_padre', $persona->id_padre)
            ->where('id_persona', '!=', $id)
            ->update(['predeterminada' => false]);

        // Establecer esta como predeterminada
        $persona->predeterminada = true;
        $persona->save();

        return response()->json(['message' => 'Persona establecida como predeterminada']);
    }

    /**
     * Eliminar persona de confianza (soft delete)
     */
    public function destroy($id)
    {
        $persona = PersonaConfianza::find($id);

        if (!$persona) {
            return response()->json(['message' => 'Persona no encontrada'], 404);
        }

        $persona->activa = false;
        $persona->save();

        return response()->json(['message' => 'Persona de confianza eliminada']);
    }
}
