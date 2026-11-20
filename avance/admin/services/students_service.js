// admin\services\student_service.js
import studentRepository from '../repositories/student_repositories.js';
import { Op } from 'sequelize';

/**
 * Obtener todos los estudiantes sin paginación
 */
export const fetchAll = async () => {
  const students = await studentRepository.findAll();
  return students.map(student => student.toJSON());
};

/**
 * Obtener listado simple de estudiantes (útil para dropdowns o selectores)
 */
export const fetchAllSimple = async () => {
  const students = await studentRepository.findAll({
    order: [['id', 'ASC']],
  });

  return students.map(student => student.toJSON());
};

/**
 * Obtener estudiantes paginados con filtros por búsqueda (nombres, apellidos, email, carrera o distrito)
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
  const { count: total, rows: students } = await studentRepository.findAllPaginated({
    where: whereClause,
    offset,
    limit: parsedLimit,
    order: [['id', 'DESC']],
  });

  const totalPages = Math.ceil(total / parsedLimit);

  return {
    students: students.map(student => student.toJSON()),
    total,
    totalPages,
    offset,
    page: parsedPage,
    limit: parsedLimit,
  };
};

/**
 * Obtener un estudiante por su ID con todo su perfil
 */
export const fetchById = async (id) => {
  const student = await studentRepository.findById(id);

  if (!student) {
    return null;
  }

  return student.toJSON();
};

/**
 * Obtener un estudiante por su user_id
 */
export const fetchByUserId = async (userId) => {
  const student = await studentRepository.findByUserId(userId);

  if (!student) {
    return null;
  }

  return student.toJSON();
};

/**
 * Servicio para crear un nuevo estudiante
 */
export const create = async (data) => {
  const newStudent = await studentRepository.create(data);
  return newStudent.toJSON();
};

/**
 * Servicio para actualizar datos de un estudiante
 */
export const update = async (id, data) => {
  const updatedStudent = await studentRepository.update(id, data);
  if (!updatedStudent) return null;
  return updatedStudent.toJSON();
};

/**
 * Servicio para eliminar un estudiante
 */
export const remove = async (id) => {
  return await studentRepository.delete(id);
};