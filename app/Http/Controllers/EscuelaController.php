<?php

namespace App\Http\Controllers;

use App\Models\Escuela;
use Illuminate\Http\Request;

class EscuelaController extends Controller
{
    /**
     * Obtener todas las escuelas
     */
    public function index()
    {
        $escuelas = Escuela::all();
        return response()->json($escuelas);
    }

    /**
     * Obtener escuela por ID
     */
    public function show($id)
    {
        $escuela = Escuela::find($id);

        if (!$escuela) {
            return response()->json(['message' => 'Escuela no encontrada'], 404);
        }

        return response()->json($escuela);
    }

    /**
     * Crear nueva escuela
     */
    public function store(Request $request)
    {
        $request->validate([
            'nombre_escuela' => 'required|string|max:255'
        ]);

        $escuela = Escuela::create($request->all());

        return response()->json([
            'message' => 'Escuela creada',
            'id' => $escuela->id_escuela
        ], 201);
    }

    /**
     * Actualizar escuela
     */
    public function update(Request $request, $id)
    {
        $escuela = Escuela::find($id);

        if (!$escuela) {
            return response()->json(['message' => 'Escuela no encontrada'], 404);
        }

        $escuela->fill($request->all());
        $escuela->save();

        return response()->json(['message' => 'Escuela actualizada']);
    }

    /**
     * Eliminar escuela
     */
    public function destroy($id)
    {
        $escuela = Escuela::find($id);

        if (!$escuela) {
            return response()->json(['message' => 'Escuela no encontrada'], 404);
        }

        $escuela->delete();

        return response()->json(['message' => 'Escuela eliminada']);
    }
}
