// admin/services/workdays_services.js
import workdayRepository from '../repositories/workdays_repositories.js';
import { Op } from 'sequelize';

/**
 * Obtener todos las jornadas
 */
export const fetchAll = async () => {
  const workdays = await workdayRepository.findAll();
  return workdays.map(workday => workday.toJSON());
};

/**
 * Obtener listado simple ordenado por ID ascendente (para selects/filtros)
 */
export const fetchAllSimple = async () => {
  const workdays = await workdayRepository.findAllSimple({
    order: [['id', 'ASC']]
  });
  return workdays.map(workday => workday.toJSON());
};

/**
 * Obtener jornadas paginados con filtro por nombre
 */
export const fetchAllPaginated = async (page = 1, limit = 10, name = '') => {
  const offset = (page - 1) * limit;

  const whereClause = {};
  if (name) {
    whereClause.name = {
      [Op.iLike]: `%${name}%`
    };
  }

  const total = await workdayRepository.count(whereClause);

  const workdays = await workdayRepository.findAllPaginated({
    where: whereClause,
    offset,
    limit,
    order: [['id', 'DESC']]
  });

  const totalPages = Math.ceil(total / limit);

  return {
    workdays: workdays.map(workday => workday.toJSON()),
    total,
    totalPages,
    offset,
    page,
    limit
  };
};

/**
 * Obtener una jornada por su ID
 */
export const fetchById = async (id) => {
  const workday = await workdayRepository.findById(id);
  if (!workday) return null;
  return workday.toJSON();
};

/**
 * Crear una jornada
 */
export const create = async (data) => {
  const newWorkday = await workdayRepository.create(data);
  return newWorkday.toJSON();
};

/**
 * Actualizar una jornada
 */
export const update = async (id, data) => {
  const updatedWorkday = await workdayRepository.update(id, data);
  if (!updatedWorkday) return null;
  return updatedWorkday.toJSON();
};

/**
 * Eliminar una jornada
 */
export const remove = async (id) => {
  return await workdayRepository.delete(id);
};