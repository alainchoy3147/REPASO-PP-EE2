// admin\apis\turillo_api.js
import * as turilloService from '../services/turillos_service.js';

export function test(req, res) {
  return res.json({
    success: true,
    message: 'Active session',
    data: ':)'
  });
}

/**
 * Obtener listado simple de estudiantes (sin paginación)
 */
export async function listTurillosSimple(req, res, next) {
  try {
    const result = await turilloService.fetchAllSimple();
    console.log(result);

    return res.status(200).json({
      success: true,
      message: 'Turillos listados con éxito',
      data: result,
      error: null
    });
  } catch (error) {
    console.error(error.stack);
    return res.status(500).json({
      success: false,
      message: 'Error al listar los estudiantes',
      data: null,
      error: error.message
    });
  }
}

/**
 * Obtener estudiantes paginados con filtros (búsqueda, carrera, distrito, semestre)
 */
export async function listTurillos(req, res, next) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || req.query.name || '';
    const carrerId = req.query.carrerId || null;
    const districtId = req.query.districtId || null;
    const semesterId = req.query.semesterId || null;

    console.log(`Listando estudiantes - Página: ${page}, Límite: ${limit}, Filtro: ${search}`);

    const result = await turilloService.fetchAllPaginated({
      page,
      limit,
      search,
      carrerId,
      districtId,
      semesterId
    });

    return res.status(200).json({
      success: true,
      message: 'Turillos listados con éxito',
      data: {
        list: result.turillos,
        total: result.total,
        pages: result.totalPages,
        offset: result.offset,
        limit: limit,
        page: page
      },
      error: null
    });
  } catch (error) {
    console.error(error.stack);
    return res.status(500).json({
      success: false,
      message: 'Error al listar los estudiantes',
      data: null,
      error: error.message
    });
  }
}

/**
 * Obtener un estudiante por su ID (ej. /api/turillos/:id)
 */
export async function getTurilloById(req, res, next) {
  try {
    const { id } = req.params;
    const turillo = await turilloService.fetchById(id);

    if (!turillo) {
      return res.status(404).json({
        success: false,
        message: 'Turillo no encontrado',
        data: null,
        error: `No existe el estudiante con el id ${id}`
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Turillo obtenido con éxito',
      data: turillo,
      error: null
    });
  } catch (error) {
    console.error(error.stack);
    return res.status(500).json({
      success: false,
      message: 'Error al buscar el estudiante',
      data: null,
      error: error.message
    });
  }
}

/**
 * Crear un nuevo estudiante (POST)
 */
export async function createTurillo(req, res) {
  try {
    console.log('0 ++++++++++++++++++++');
    console.log(req.body);
    const newTurillo = await turilloService.create(req.body);
    console.log('1 ++++++++++++++++++++');
    console.log('2 ++++++++++++++++++++');

    return res.status(201).json({
      success: true,
      message: 'Turillo creado con éxito',
      data: newTurillo,
      error: null
    });
  } catch (error) {
    console.error(error.stack);
    return res.status(500).json({
      success: false,
      message: 'Error al crear el estudiante',
      data: null,
      error: error.message
    });
  }
}

/**
 * Actualizar un estudiante existente (PUT)
 */
export async function updateTurillo(req, res) {
  try {
    const { id } = req.params;
    const updatedTurillo = await turilloService.update(id, req.body);

    if (!updatedTurillo) {
      return res.status(404).json({
        success: false,
        message: 'Turillo no encontrado',
        data: null,
        error: `No existe el estudiante con el id ${id}`
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Turillo actualizado con éxito',
      data: updatedTurillo,
      error: null
    });
  } catch (error) {
    console.error(error.stack);
    return res.status(500).json({
      success: false,
      message: 'Error al actualizar el estudiante',
      data: null,
      error: error.message
    });
  }
}

/**
 * Eliminar un estudiante (DELETE)
 */
export async function deleteTurillo(req, res) {
  try {
    const { id } = req.params;
    const deleted = await turilloService.remove(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Turillo no encontrado',
        data: null,
        error: `No existe el estudiante con el id ${id}`
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Turillo eliminado con éxito',
      data: null,
      error: null
    });
  } catch (error) {
    console.error(error.stack);
    return res.status(500).json({
      success: false,
      message: 'Error al eliminar el estudiante',
      data: null,
      error: error.message
    });
  }
}