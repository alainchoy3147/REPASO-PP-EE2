// admin/repositories/experience_repositories.js
import Experience from '../models/experience.js';
import Student from '../models/student.js';
import { Op } from 'sequelize';

const showLogs = process.env.SHOW_DB_ERRORS === 'true' || process.env.NODE_ENV === 'development';

class ExperienceRepository {
  /**
   * Obtiene todas las experiencias sin paginación
   */
  async findAll(options = {}) {
    try {
      const { where = {}, include = [], order = [['id', 'DESC']] } = options;
      return await Experience.findAll({
        where,
        include,
        order,
      });
    } catch (error) {
      if (showLogs) console.error('🔥 [ExperienceRepo.findAll] Error:', error);
      throw error;
    }
  }

  /**
   * Obtiene experiencias con paginación y filtros
   */
  async findAllPaginated(options = {}) {
    try {
      const {
        where = {},
        offset = 0,
        limit = 10,
        order = [['id', 'DESC']],
        include = [
          { model: Student, as: 'student', attributes: ['id', 'names', 'last_names'] },
        ],
      } = options;

      return await Experience.findAndCountAll({
        where,
        offset,
        limit,
        order,
        include,
        distinct: true, // Evita conteos duplicados al usar includes
      });
    } catch (error) {
      if (showLogs) console.error('🔥 [ExperienceRepo.findAllPaginated] Error:', error);
      throw error;
    }
  }

  /**
   * Cuenta las experiencias con filtros
   */
  async count(where = {}) {
    try {
      return await Experience.count({ where });
    } catch (error) {
      if (showLogs) console.error('🔥 [ExperienceRepo.count] Error:', error);
      throw error;
    }
  }

  /**
   * Busca experiencia por ID con su estudiante
   */
  async findById(id, options = {}) {
    try {
      const {
        include = [
          { model: Student, as: 'student', attributes: ['id', 'names', 'last_names', 'email'] },
        ]
      } = options;

      return await Experience.findByPk(id, { include });
    } catch (error) {
      if (showLogs) console.error(`🔥 [ExperienceRepo.findById] Error (id: ${id}):`, error);
      throw error;
    }
  }

  /**
   * Crea una nueva experiencia
   */
  async create(data, options = {}) {
    try {
      return await Experience.create(data, options);
    } catch (error) {
      if (showLogs) console.error('🔥 [ExperienceRepo.create] Error:', error);
      throw error;
    }
  }

  /**
   * Actualiza una experiencia por ID
   */
  async update(id, data, options = {}) {
    try {
      const experience = await Experience.findByPk(id);
      if (!experience) return null;
      return await experience.update(data, options);
    } catch (error) {
      if (showLogs) console.error(`🔥 [ExperienceRepo.update] Error (id: ${id}):`, error);
      throw error;
    }
  }

  /**
   * Elimina una experiencia por ID
   */
  async delete(id, options = {}) {
    try {
      const experience = await Experience.findByPk(id);
      if (!experience) return null;
      await experience.destroy(options);
      return true;
    } catch (error) {
      if (showLogs) console.error(`🔥 [ExperienceRepo.delete] Error (id: ${id}):`, error);
      throw error;
    }
  }
}

export default new ExperienceRepository();
