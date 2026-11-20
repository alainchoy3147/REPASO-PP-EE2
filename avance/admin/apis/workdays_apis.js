// admin/apis/workdays_apis.js
import * as workdayService from '../services/workdays_services.js';

export function test(req, res) {
  return res.json({
    success: true,
    message: 'Active session',
    data: ':)'
  });
}

export async function listWorkdaysSimple(req, res, next) {
  try {
    const result = await workdayService.fetchAllSimple();

    return res.status(200).json({
      success: true,
      message: 'Jornadas listadas con éxito',
      data: result,
      error: null
    });
  } catch (error) {
    console.error(error.stack);
    return res.status(500).json({
      success: false,
      message: 'Error al listar las jornadas',
      data: null,
      error: error.message
    });
  }
}

export async function listWorkdays(req, res, next) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const name = req.query.name || '';

    const result = await workdayService.fetchAllPaginated(page, limit, name);

    return res.status(200).json({
      success: true,
      message: 'Jornadas listadas con éxito',
      data: {
        list: result.workdays,
        total: result.total,
        pages: result.totalPages,
        offset: result.offset,
        limit,
        page
      },
      error: null
    });
  } catch (error) {
    console.error(error.stack);
    return res.status(500).json({
      success: false,
      message: 'Error al listar las jornadas',
      data: null,
      error: error.message
    });
  }
}

export async function getWorkdayById(req, res, next) {
  try {
    const { id } = req.params;
    const workday = await workdayService.fetchById(id);

    if (!workday) {
      return res.status(404).json({
        success: false,
        message: 'Jornada no encontrada',
        data: null,
        error: `No existe la jornada con el id ${id}`
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Jornada obtenida con éxito',
      data: workday,
      error: null
    });
  } catch (error) {
    console.error(error.stack);
    return res.status(500).json({
      success: false,
      message: 'Error al buscar la jornada',
      data: null,
      error: error.message
    });
  }
}

export async function createWorkday(req, res) {
  try {
    const newWorkday = await workdayService.create(req.body);

    return res.status(201).json({
      success: true,
      message: 'Jornada creada con éxito',
      data: newWorkday,
      error: null
    });
  } catch (error) {
    console.error(error.stack);
    return res.status(500).json({
      success: false,
      message: 'Error al crear la jornada',
      data: null,
      error: error.message
    });
  }
}

export async function updateWorkday(req, res) {
  try {
    const { id } = req.params;
    const updatedWorkday = await workdayService.update(id, req.body);

    if (!updatedWorkday) {
      return res.status(404).json({
        success: false,
        message: 'Jornada no encontrada',
        data: null,
        error: `No existe la jornada con el id ${id}`
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Jornada actualizada con éxito',
      data: updatedWorkday,
      error: null
    });
  } catch (error) {
    console.error(error.stack);
    return res.status(500).json({
      success: false,
      message: 'Error al actualizar la jornada',
      data: null,
      error: error.message
    });
  }
}

export async function deleteWorkday(req, res) {
  try {
    const { id } = req.params;
    const deleted = await workdayService.remove(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Jornada no encontrada',
        data: null,
        error: `No existe la jornada con el id ${id}`
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Jornada eliminada con éxito',
      data: null,
      error: null
    });
  } catch (error) {
    console.error(error.stack);
    return res.status(500).json({
      success: false,
      message: 'Error al eliminar la jornada',
      data: null,
      error: error.message
    });
  }
}