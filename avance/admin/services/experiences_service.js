// admin/services/experiences_service.js
import experienceRepository from '../repositories/experience_repositories.js';
import { Op } from 'sequelize';

/**
 * Obtener todas las experiencias sin paginación
 */
export const fetchAll = async () => {
  const experiences = await experienceRepository.findAll();
  return experiences.map(experience => experience.toJSON());
};

/**
 * Obtener listado simple de experiencias (útil para dropdowns o selectores)
 */
export const fetchAllSimple = async () => {
  const experiences = await experienceRepository.findAll({
    order: [['id', 'ASC']],
  });

  return experiences.map(experience => experience.toJSON());
};

/**
 * Obtener experiencias paginadas con filtros (puesto, empresa o estudiante)
 */
export const fetchAllPaginated = async (options = {}) => {
  const {
    page = 1,
    limit = 10,
    search = '',
    studentId = null,
  } = options;

  const parsedPage = parseInt(page, 10) || 1;
  const parsedLimit = parseInt(limit, 10) || 10;
  const offset = (parsedPage - 1) * parsedLimit;

  // Construcción de filtros dinámicos
  const whereClause = {};

  if (search) {
    whereClause[Op.or] = [
      { name: { [Op.iLike]: `%${search}%` } },
      { enterprise: { [Op.iLike]: `%${search}%` } },
    ];
  }

  if (studentId) {
    whereClause.student_id = studentId;
  }

  // Ejecutar consulta con paginación
  const { count: total, rows: experiences } = await experienceRepository.findAllPaginated({
    where: whereClause,
    offset,
    limit: parsedLimit,
    order: [['id', 'DESC']],
  });

  const totalPages = Math.ceil(total / parsedLimit);

  return {
    experiences: experiences.map(experience => experience.toJSON()),
    total,
    totalPages,
    offset,
    page: parsedPage,
    limit: parsedLimit,
  };
};

/**
 * Obtener una experiencia por su ID
 */
export const fetchById = async (id) => {
  const experience = await experienceRepository.findById(id);

  if (!experience) {
    return null;
  }

  return experience.toJSON();
};

/**
 * Servicio para crear una nueva experiencia
 */
export const create = async (data) => {
  const newExperience = await experienceRepository.create(data);
  return newExperience.toJSON();
};

/**
 * Servicio para actualizar datos de una experiencia
 */
export const update = async (id, data) => {
  const updatedExperience = await experienceRepository.update(id, data);
  if (!updatedExperience) return null;
  return updatedExperience.toJSON();
};

/**
 * Servicio para eliminar una experiencia
 */
export const remove = async (id) => {
  return await experienceRepository.delete(id);
};
