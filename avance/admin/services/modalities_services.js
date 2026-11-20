// admin/services/modalities_services.js
import modalityRepository from '../repositories/modalities_repositories.js';
import { Op } from 'sequelize';

/**
 * Obtener todos las modalidades
 */
export const fetchAll = async () => {
  const modalities = await modalityRepository.findAll();
  return modalities.map(modality => modality.toJSON());
};

/**
 * Obtener listado simple ordenado por ID ascendente (para selects/filtros)
 */
export const fetchAllSimple = async () => {
  const modalities = await modalityRepository.findAllSimple({
    order: [['id', 'ASC']]
  });
  return modalities.map(modality => modality.toJSON());
};

/**
 * Obtener modalidades paginados con filtro por nombre
 */
export const fetchAllPaginated = async (page = 1, limit = 10, name = '') => {
  const offset = (page - 1) * limit;

  const whereClause = {};
  if (name) {
    whereClause.name = {
      [Op.iLike]: `%${name}%`
    };
  }

  const total = await modalityRepository.count(whereClause);

  const modalities = await modalityRepository.findAllPaginated({
    where: whereClause,
    offset,
    limit,
    order: [['id', 'DESC']]
  });

  const totalPages = Math.ceil(total / limit);

  return {
    modalities: modalities.map(modality => modality.toJSON()),
    total,
    totalPages,
    offset,
    page,
    limit
  };
};

/**
 * Obtener una modalidad por su ID
 */
export const fetchById = async (id) => {
  const modality = await modalityRepository.findById(id);
  if (!modality) return null;
  return modality.toJSON();
};

/**
 * Crear una modalidad
 */
export const create = async (data) => {
  const newModality = await modalityRepository.create(data);
  return newModality.toJSON();
};

/**
 * Actualizar una modalidad
 */
export const update = async (id, data) => {
  const updatedModality = await modalityRepository.update(id, data);
  if (!updatedModality) return null;
  return updatedModality.toJSON();
};

/**
 * Eliminar una modalidad
 */
export const remove = async (id) => {
  return await modalityRepository.delete(id);
};