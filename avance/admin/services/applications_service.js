// admin/services/applications_service.js
import applicationRepository from '../repositories/application_repositories.js';
import { Op } from 'sequelize';

/**
 * Obtener todas las applications sin paginación
 */
export const fetchAll = async () => {
  const applications = await applicationRepository.findAll();
  return applications.map(application => application.toJSON());
};

/**
 * Obtener listado simple de applications (útil para dropdowns o selectores)
 */
export const fetchAllSimple = async () => {
  const applications = await applicationRepository.findAll({
    order: [['id', 'ASC']],
  });

  return applications.map(application => application.toJSON());
};

/**
 * Obtener applications paginadas con filtros (título, empresa, modalidad, jornada, distrito)
 */
export const fetchAllPaginated = async (options = {}) => {
  const {
    page = 1,
    limit = 10,
    search = '',
    enterpriseId = null,
    modalityId = null,
    workdayId = null,
    districtId = null,
  } = options;

  const parsedPage = parseInt(page, 10) || 1;
  const parsedLimit = parseInt(limit, 10) || 10;
  const offset = (parsedPage - 1) * parsedLimit;

  // Construcción de filtros dinámicos
  const whereClause = {};

  if (search) {
    whereClause[Op.or] = [
      { title: { [Op.iLike]: `%${search}%` } },
      { description: { [Op.iLike]: `%${search}%` } },
    ];
  }

  if (enterpriseId) {
    whereClause.enterprise_id = enterpriseId;
  }

  if (modalityId) {
    whereClause.modality_id = modalityId;
  }

  if (workdayId) {
    whereClause.workday_id = workdayId;
  }

  if (districtId) {
    whereClause.district_id = districtId;
  }

  // Ejecutar consulta con paginación
  const { count: total, rows: applications } = await applicationRepository.findAllPaginated({
    where: whereClause,
    offset,
    limit: parsedLimit,
    order: [['id', 'DESC']],
  });

  const totalPages = Math.ceil(total / parsedLimit);

  return {
    applications: applications.map(application => application.toJSON()),
    total,
    totalPages,
    offset,
    page: parsedPage,
    limit: parsedLimit,
  };
};

/**
 * Obtener una application por su ID
 */
export const fetchById = async (id) => {
  const application = await applicationRepository.findById(id);

  if (!application) {
    return null;
  }

  return application.toJSON();
};

/**
 * Servicio para crear una nueva application
 */
export const create = async (data) => {
  const newApplication = await applicationRepository.create(data);
  return newApplication.toJSON();
};

/**
 * Servicio para actualizar datos de una application
 */
export const update = async (id, data) => {
  const updatedApplication = await applicationRepository.update(id, data);
  if (!updatedApplication) return null;
  return updatedApplication.toJSON();
};

/**
 * Servicio para eliminar una application
 */
export const remove = async (id) => {
  return await applicationRepository.delete(id);
};
