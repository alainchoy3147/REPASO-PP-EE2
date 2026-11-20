// admin/apis/enterprise_api.js
import * as enterpriseService from '../services/enterprises_service.js';

export function test(req, res) {
  return res.json({
    success: true,
    message: 'Active session',
    data: ':)'
  });
}

/**
 * Obtener listado simple de enterprises (sin paginación)
 */
export async function listEnterprisesSimple(req, res, next) {
  try {
    const result = await enterpriseService.fetchAllSimple();

    return res.status(200).json({
      success: true,
      message: 'Empresas listadas con éxito',
      data: result,
      error: null
    });
  } catch (error) {
    console.error(error.stack);
    return res.status(500).json({
      success: false,
      message: 'Error al listar las empresas',
      data: null,
      error: error.message
    });
  }
}

/**
 * Obtener enterprises paginadas con filtros (búsqueda, distrito)
 */
export async function listEnterprises(req, res, next) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || req.query.name || '';
    const districtId = req.query.districtId || null;

    console.log(`Listando empresas - Página: ${page}, Límite: ${limit}, Filtro: ${search}`);

    const result = await enterpriseService.fetchAllPaginated({
      page,
      limit,
      search,
      districtId
    });

    return res.status(200).json({
      success: true,
      message: 'Empresas listadas con éxito',
      data: {
        list: result.enterprises,
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
      message: 'Error al listar las empresas',
      data: null,
      error: error.message
    });
  }
}

/**
 * Obtener una enterprise por su ID (ej. /api/v1/enterprises/:id)
 */
export async function getEnterpriseById(req, res, next) {
  try {
    const { id } = req.params;
    const enterprise = await enterpriseService.fetchById(id);

    if (!enterprise) {
      return res.status(404).json({
        success: false,
        message: 'Empresa no encontrada',
        data: null,
        error: `No existe la empresa con el id ${id}`
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Empresa obtenida con éxito',
      data: enterprise,
      error: null
    });
  } catch (error) {
    console.error(error.stack);
    return res.status(500).json({
      success: false,
      message: 'Error al buscar la empresa',
      data: null,
      error: error.message
    });
  }
}

/**
 * Crear una nueva enterprise (POST)
 */
export async function createEnterprise(req, res) {
  try {
    console.log(req.body);
    const newEnterprise = await enterpriseService.create(req.body);

    return res.status(201).json({
      success: true,
      message: 'Empresa creada con éxito',
      data: newEnterprise,
      error: null
    });
  } catch (error) {
    console.error(error.stack);
    return res.status(500).json({
      success: false,
      message: 'Error al crear la empresa',
      data: null,
      error: error.message
    });
  }
}

/**
 * Actualizar una enterprise existente (PUT)
 */
export async function updateEnterprise(req, res) {
  try {
    const { id } = req.params;
    const updatedEnterprise = await enterpriseService.update(id, req.body);

    if (!updatedEnterprise) {
      return res.status(404).json({
        success: false,
        message: 'Empresa no encontrada',
        data: null,
        error: `No existe la empresa con el id ${id}`
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Empresa actualizada con éxito',
      data: updatedEnterprise,
      error: null
    });
  } catch (error) {
    console.error(error.stack);
    return res.status(500).json({
      success: false,
      message: 'Error al actualizar la empresa',
      data: null,
      error: error.message
    });
  }
}

/**
 * Eliminar una enterprise (DELETE)
 */
export async function deleteEnterprise(req, res) {
  try {
    const { id } = req.params;
    const deleted = await enterpriseService.remove(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Empresa no encontrada',
        data: null,
        error: `No existe la empresa con el id ${id}`
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Empresa eliminada con éxito',
      data: null,
      error: null
    });
  } catch (error) {
    console.error(error.stack);
    return res.status(500).json({
      success: false,
      message: 'Error al eliminar la empresa',
      data: null,
      error: error.message
    });
  }
}
