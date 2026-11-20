// admin/apis/application_api.js
import * as applicationService from '../services/applications_service.js';

export function test(req, res) {
  return res.json({
    success: true,
    message: 'Active session',
    data: ':)'
  });
}

/**
 * Obtener listado simple de applications (sin paginación)
 */
export async function listApplicationsSimple(req, res, next) {
  try {
    const result = await applicationService.fetchAllSimple();

    return res.status(200).json({
      success: true,
      message: 'Aplicaciones listadas con éxito',
      data: result,
      error: null
    });
  } catch (error) {
    console.error(error.stack);
    return res.status(500).json({
      success: false,
      message: 'Error al listar las aplicaciones',
      data: null,
      error: error.message
    });
  }
}

/**
 * Obtener applications paginadas con filtros (búsqueda, empresa, modalidad, jornada, distrito)
 */
export async function listApplications(req, res, next) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || req.query.title || '';
    const enterpriseId = req.query.enterpriseId || null;
    const modalityId = req.query.modalityId || null;
    const workdayId = req.query.workdayId || null;
    const districtId = req.query.districtId || null;

    console.log(`Listando aplicaciones - Página: ${page}, Límite: ${limit}, Filtro: ${search}`);

    const result = await applicationService.fetchAllPaginated({
      page,
      limit,
      search,
      enterpriseId,
      modalityId,
      workdayId,
      districtId
    });

    return res.status(200).json({
      success: true,
      message: 'Aplicaciones listadas con éxito',
      data: {
        list: result.applications,
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
      message: 'Error al listar las aplicaciones',
      data: null,
      error: error.message
    });
  }
}

/**
 * Obtener una application por su ID (ej. /api/v1/applications/:id)
 */
export async function getApplicationById(req, res, next) {
  try {
    const { id } = req.params;
    const application = await applicationService.fetchById(id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Aplicación no encontrada',
        data: null,
        error: `No existe la aplicación con el id ${id}`
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Aplicación obtenida con éxito',
      data: application,
      error: null
    });
  } catch (error) {
    console.error(error.stack);
    return res.status(500).json({
      success: false,
      message: 'Error al buscar la aplicación',
      data: null,
      error: error.message
    });
  }
}

/**
 * Crear una nueva application (POST)
 */
export async function createApplication(req, res) {
  try {
    console.log(req.body);
    const newApplication = await applicationService.create(req.body);

    return res.status(201).json({
      success: true,
      message: 'Aplicación creada con éxito',
      data: newApplication,
      error: null
    });
  } catch (error) {
    console.error(error.stack);
    return res.status(500).json({
      success: false,
      message: 'Error al crear la aplicación',
      data: null,
      error: error.message
    });
  }
}

/**
 * Actualizar una application existente (PUT)
 */
export async function updateApplication(req, res) {
  try {
    const { id } = req.params;
    const updatedApplication = await applicationService.update(id, req.body);

    if (!updatedApplication) {
      return res.status(404).json({
        success: false,
        message: 'Aplicación no encontrada',
        data: null,
        error: `No existe la aplicación con el id ${id}`
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Aplicación actualizada con éxito',
      data: updatedApplication,
      error: null
    });
  } catch (error) {
    console.error(error.stack);
    return res.status(500).json({
      success: false,
      message: 'Error al actualizar la aplicación',
      data: null,
      error: error.message
    });
  }
}

/**
 * Eliminar una application (DELETE)
 */
export async function deleteApplication(req, res) {
  try {
    const { id } = req.params;
    const deleted = await applicationService.remove(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Aplicación no encontrada',
        data: null,
        error: `No existe la aplicación con el id ${id}`
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Aplicación eliminada con éxito',
      data: null,
      error: null
    });
  } catch (error) {
    console.error(error.stack);
    return res.status(500).json({
      success: false,
      message: 'Error al eliminar la aplicación',
      data: null,
      error: error.message
    });
  }
}
