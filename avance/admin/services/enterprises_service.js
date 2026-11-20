// admin/services/enterprises_service.js
import enterpriseRepository from '../repositories/enterprise_repositories.js';
import { Op } from 'sequelize';

/**
 * Obtener todas las enterprises sin paginación
 */
export const fetchAll = async () => {
  const enterprises = await enterpriseRepository.findAll();
  return enterprises.map(enterprise => enterprise.toJSON());
};

/**
 * Obtener listado simple de enterprises (útil para dropdowns o selectores)
 */
export const fetchAllSimple = async () => {
  const enterprises = await enterpriseRepository.findAll({
    order: [['id', 'ASC']],
  });

  return enterprises.map(enterprise => enterprise.toJSON());
};

/**
 * Obtener enterprises paginadas con filtros (nombre, RUC, email o distrito)
 */
export const fetchAllPaginated = async (options = {}) => {
  const {
    page = 1,
    limit = 10,
    search = '',
    districtId = null,
  } = options;

  const parsedPage = parseInt(page, 10) || 1;
  const parsedLimit = parseInt(limit, 10) || 10;
  const offset = (parsedPage - 1) * parsedLimit;

  // Construcción de filtros dinámicos
  const whereClause = {};

  if (search) {
    whereClause[Op.or] = [
      { name: { [Op.iLike]: `%${search}%` } },
      { ruc: { [Op.iLike]: `%${search}%` } },
      { email: { [Op.iLike]: `%${search}%` } },
    ];
  }

  if (districtId) {
    whereClause.district_id = districtId;
  }

  // Ejecutar consulta con paginación
  const { count: total, rows: enterprises } = await enterpriseRepository.findAllPaginated({
    where: whereClause,
    offset,
    limit: parsedLimit,
    order: [['id', 'DESC']],
  });

  const totalPages = Math.ceil(total / parsedLimit);

  return {
    enterprises: enterprises.map(enterprise => enterprise.toJSON()),
    total,
    totalPages,
    offset,
    page: parsedPage,
    limit: parsedLimit,
  };
};

/**
 * Obtener una enterprise por su ID
 */
export const fetchById = async (id) => {
  const enterprise = await enterpriseRepository.findById(id);

  if (!enterprise) {
    return null;
  }

  return enterprise.toJSON();
};

/**
 * Servicio para crear una nueva enterprise
 */
export const create = async (data) => {
  const newEnterprise = await enterpriseRepository.create(data);
  return newEnterprise.toJSON();
};

/**
 * Servicio para actualizar datos de una enterprise
 */
export const update = async (id, data) => {
  const updatedEnterprise = await enterpriseRepository.update(id, data);
  if (!updatedEnterprise) return null;
  return updatedEnterprise.toJSON();
};

/**
 * Servicio para eliminar una enterprise
 */
export const remove = async (id) => {
  return await enterpriseRepository.delete(id);
};
