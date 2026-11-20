// admin/apis/experience_api.js
import * as experienceService from '../services/experiences_service.js';

export function test(req, res) {
  return res.json({
    success: true,
    message: 'Active session',
    data: ':)'
  });
}

/**
 * Obtener listado simple de experiences (sin paginación)
 */
export async function listExperiencesSimple(req, res, next) {
  try {
    const result = await experienceService.fetchAllSimple();

    return res.status(200).json({
      success: true,
      message: 'Experiencias listadas con éxito',
      data: result,
      error: null
    });
  } catch (error) {
    console.error(error.stack);
    return res.status(500).json({
      success: false,
      message: 'Error al listar las experiencias',
      data: null,
      error: error.message
    });
  }
}

/**
 * Obtener experiences paginadas con filtros (búsqueda, estudiante)
 */
export async function listExperiences(req, res, next) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || req.query.name || '';
    const studentId = req.query.studentId || null;

    console.log(`Listando experiencias - Página: ${page}, Límite: ${limit}, Filtro: ${search}`);

    const result = await experienceService.fetchAllPaginated({
      page,
      limit,
      search,
      studentId
    });

    return res.status(200).json({
      success: true,
      message: 'Experiencias listadas con éxito',
      data: {
        list: result.experiences,
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
      message: 'Error al listar las experiencias',
      data: null,
      error: error.message
    });
  }
}

/**
 * Obtener una experience por su ID (ej. /api/v1/experiences/:id)
 */
export async function getExperienceById(req, res, next) {
  try {
    const { id } = req.params;
    const experience = await experienceService.fetchById(id);

    if (!experience) {
      return res.status(404).json({
        success: false,
        message: 'Experiencia no encontrada',
        data: null,
        error: `No existe la experiencia con el id ${id}`
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Experiencia obtenida con éxito',
      data: experience,
      error: null
    });
  } catch (error) {
    console.error(error.stack);
    return res.status(500).json({
      success: false,
      message: 'Error al buscar la experiencia',
      data: null,
      error: error.message
    });
  }
}

/**
 * Crear una nueva experience (POST)
 */
export async function createExperience(req, res) {
  try {
    console.log(req.body);
    const newExperience = await experienceService.create(req.body);

    return res.status(201).json({
      success: true,
      message: 'Experiencia creada con éxito',
      data: newExperience,
      error: null
    });
  } catch (error) {
    console.error(error.stack);
    return res.status(500).json({
      success: false,
      message: 'Error al crear la experiencia',
      data: null,
      error: error.message
    });
  }
}

/**
 * Actualizar una experience existente (PUT)
 */
export async function updateExperience(req, res) {
  try {
    const { id } = req.params;
    const updatedExperience = await experienceService.update(id, req.body);

    if (!updatedExperience) {
      return res.status(404).json({
        success: false,
        message: 'Experiencia no encontrada',
        data: null,
        error: `No existe la experiencia con el id ${id}`
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Experiencia actualizada con éxito',
      data: updatedExperience,
      error: null
    });
  } catch (error) {
    console.error(error.stack);
    return res.status(500).json({
      success: false,
      message: 'Error al actualizar la experiencia',
      data: null,
      error: error.message
    });
  }
}

/**
 * Eliminar una experience (DELETE)
 */
export async function deleteExperience(req, res) {
  try {
    const { id } = req.params;
    const deleted = await experienceService.remove(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Experiencia no encontrada',
        data: null,
        error: `No existe la experiencia con el id ${id}`
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Experiencia eliminada con éxito',
      data: null,
      error: null
    });
  } catch (error) {
    console.error(error.stack);
    return res.status(500).json({
      success: false,
      message: 'Error al eliminar la experiencia',
      data: null,
      error: error.message
    });
  }
}
