// admin/apis/modalities_apis.js
import * as modalityService from '../services/modalities_services.js';

export function test(req, res) {
  return res.json({
    success: true,
    message: 'Active session',
    data: ':)'
  });
}

export async function listModalitiesSimple(req, res, next) {
  try {
    const result = await modalityService.fetchAllSimple();

    return res.status(200).json({
      success: true,
      message: 'Modalidades listadas con éxito',
      data: result,
      error: null
    });
  } catch (error) {
    console.error(error.stack);
    return res.status(500).json({
      success: false,
      message: 'Error al listar las modalidades',
      data: null,
      error: error.message
    });
  }
}

export async function listModalities(req, res, next) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const name = req.query.name || '';

    const result = await modalityService.fetchAllPaginated(page, limit, name);

    return res.status(200).json({
      success: true,
      message: 'Modalidades listadas con éxito',
      data: {
        list: result.modalities,
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
      message: 'Error al listar las modalidades',
      data: null,
      error: error.message
    });
  }
}

export async function getModalityById(req, res, next) {
  try {
    const { id } = req.params;
    const modality = await modalityService.fetchById(id);

    if (!modality) {
      return res.status(404).json({
        success: false,
        message: 'Modalidad no encontrada',
        data: null,
        error: `No existe la modalidad con el id ${id}`
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Modalidad obtenida con éxito',
      data: modality,
      error: null
    });
  } catch (error) {
    console.error(error.stack);
    return res.status(500).json({
      success: false,
      message: 'Error al buscar la modalidad',
      data: null,
      error: error.message
    });
  }
}

export async function createModality(req, res) {
  try {
    const newModality = await modalityService.create(req.body);

    return res.status(201).json({
      success: true,
      message: 'Modalidad creada con éxito',
      data: newModality,
      error: null
    });
  } catch (error) {
    console.error(error.stack);
    return res.status(500).json({
      success: false,
      message: 'Error al crear la modalidad',
      data: null,
      error: error.message
    });
  }
}

export async function updateModality(req, res) {
  try {
    const { id } = req.params;
    const updatedModality = await modalityService.update(id, req.body);

    if (!updatedModality) {
      return res.status(404).json({
        success: false,
        message: 'Modalidad no encontrada',
        data: null,
        error: `No existe la modalidad con el id ${id}`
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Modalidad actualizada con éxito',
      data: updatedModality,
      error: null
    });
  } catch (error) {
    console.error(error.stack);
    return res.status(500).json({
      success: false,
      message: 'Error al actualizar la modalidad',
      data: null,
      error: error.message
    });
  }
}

export async function deleteModality(req, res) {
  try {
    const { id } = req.params;
    const deleted = await modalityService.remove(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Modalidad no encontrada',
        data: null,
        error: `No existe la modalidad con el id ${id}`
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Modalidad eliminada con éxito',
      data: null,
      error: null
    });
  } catch (error) {
    console.error(error.stack);
    return res.status(500).json({
      success: false,
      message: 'Error al eliminar la modalidad',
      data: null,
      error: error.message
    });
  }
}