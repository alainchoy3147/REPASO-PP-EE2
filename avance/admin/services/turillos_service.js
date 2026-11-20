// admin\services\turillo_service.js
import turilloRepository from '../repositories/turillo_repositories.js';
import { Op } from 'sequelize';

/**
 * Obtener todos los turillos sin paginación
 */
export const fetchAll = async () => {
  const turillos = await turilloRepository.findAll();
  return turillos.map(turillo => turillo.toJSON());
};

/**
 * Obtener listado simple de turillos (útil par a dropdowns o selectores)
 */
export const fetchAllSimple = async () => {
  const turillos = await turilloRepository.findAll({
    order: [['id', 'ASC']],
  });

  return turillos.map(turillo => turillo.toJSON());
};

/**
 * Obtener turillos paginados con filtros por búsqueda (nombres, apellidos, email, carrera o distrito)
 */
export const fetchAllPaginated = async (options = {}) => {
  const { 
    page = 1, 
    limit = 10, 
    search = '', 
    carrerId = null, 
    districtId = null,
    semesterId = null 
  } = options;

  const parsedPage = parseInt(page, 10) || 1;
  const parsedLimit = parseInt(limit, 10) || 10;
  const offset = (parsedPage - 1) * parsedLimit;

  // Construcción de filtros dinámicos
  const whereClause = {};

  if (search) {
    whereClause[Op.or] = [
      { names: { [Op.iLike]: `%${search}%` } },
      { last_names: { [Op.iLike]: `%${search}%` } },
      { email: { [Op.iLike]: `%${search}%` } },
    ];
  }

  if (carrerId) {
    whereClause.carrere_id = carrerId;
  }

  if (districtId) {
    whereClause.district_id = districtId;
  }

  if (semesterId) {
    whereClause.sementer_id = semesterId;
  }

  // Ejecutar consulta con paginación
  const { count: total, rows: turillos } = await turilloRepository.findAllPaginated({
    where: whereClause,
    offset,
    limit: parsedLimit,
    order: [['id', 'DESC']],
  });

  const totalPages = Math.ceil(total / parsedLimit);

  return {
    turillos: turillos.map(turillo => turillo.toJSON()),
    total,
    totalPages,
    offset,
    page: parsedPage,
    limit: parsedLimit,
  };
};

/**
 * Obtener un turillo por su ID con todo su perfil
 */
export const fetchById = async (id) => {
  const turillo = await turilloRepository.findById(id);

  if (!turillo) {
    return null;
  }

  return turillo.toJSON();
};

/**
 * Obtener un turillo por su user_id
 */
export const fetchByUserId = async (userId) => {
  const turillo = await turilloRepository.findByUserId(userId);

  if (!turillo) {
    return null;
  }

  return turillo.toJSON();
};

/**
 * Servicio para crear un nuevo turillo
 */
export const create = async (data) => {
  const newTurillo = await turilloRepository.create(data);
  return newTurillo.toJSON();
};

/**
 * Servicio para actualizar datos de un turillo
 */
export const update = async (id, data) => {
  const updatedTurillo = await turilloRepository.update(id, data);
  if (!updatedTurillo) return null;
  return updatedTurillo.toJSON();
};

/**
 * Servicio para eliminar un turillo
 */
export const remove = async (id) => {
  return await turilloRepository.delete(id);
};