// admin/repositories/application_repositories.js
import Application from '../models/application.js';
import Enterprise from '../models/enterprise.js';
import Modality from '../models/modality.js';
import Workday from '../models/workday.js';
import District from '../models/district.js';
import Semester from '../models/semester.js';
import { Op } from 'sequelize';

const showLogs = process.env.SHOW_DB_ERRORS === 'true' || process.env.NODE_ENV === 'development';

class ApplicationRepository {
  /**
   * Obtiene todas las applications sin paginación
   */
  async findAll(options = {}) {
    try {
      const { where = {}, include = [], order = [['id', 'DESC']] } = options;
      return await Application.findAll({
        where,
        include,
        order,
      });
    } catch (error) {
      if (showLogs) console.error('🔥 [ApplicationRepo.findAll] Error:', error);
      throw error;
    }
  }

  /**
   * Obtiene applications con paginación y filtros
   */
  async findAllPaginated(options = {}) {
    try {
      const {
        where = {},
        offset = 0,
        limit = 10,
        order = [['id', 'DESC']],
        include = [
          { model: Enterprise, as: 'enterprise', attributes: ['id', 'name'] },
          { model: Modality, as: 'modality', attributes: ['id', 'name'] },
          { model: Workday, as: 'workday', attributes: ['id', 'name'] },
          { model: District, as: 'district', attributes: ['id', 'name'] },
          { model: Semester, as: 'semester', attributes: ['id', 'name'] },
        ],
      } = options;

      return await Application.findAndCountAll({
        where,
        offset,
        limit,
        order,
        include,
        distinct: true, // Evita conteos duplicados al usar includes
      });
    } catch (error) {
      if (showLogs) console.error('🔥 [ApplicationRepo.findAllPaginated] Error:', error);
      throw error;
    }
  }

  /**
   * Cuenta las applications con filtros
   */
  async count(where = {}) {
    try {
      return await Application.count({ where });
    } catch (error) {
      if (showLogs) console.error('🔥 [ApplicationRepo.count] Error:', error);
      throw error;
    }
  }

  /**
   * Busca application por ID con sus relaciones asociadas
   */
  async findById(id, options = {}) {
    try {
      const {
        include = [
          { model: Enterprise, as: 'enterprise', attributes: ['id', 'name'] },
          { model: Modality, as: 'modality' },
          { model: Workday, as: 'workday' },
          { model: District, as: 'district' },
          { model: Semester, as: 'semester' },
        ]
      } = options;

      return await Application.findByPk(id, { include });
    } catch (error) {
      if (showLogs) console.error(`🔥 [ApplicationRepo.findById] Error (id: ${id}):`, error);
      throw error;
    }
  }

  /**
   * Crea una nueva application
   */
  async create(data, options = {}) {
    try {
      return await Application.create(data, options);
    } catch (error) {
      if (showLogs) console.error('🔥 [ApplicationRepo.create] Error:', error);
      throw error;
    }
  }

  /**
   * Actualiza una application por ID
   */
  async update(id, data, options = {}) {
    try {
      const application = await Application.findByPk(id);
      if (!application) return null;
      return await application.update(data, options);
    } catch (error) {
      if (showLogs) console.error(`🔥 [ApplicationRepo.update] Error (id: ${id}):`, error);
      throw error;
    }
  }

  /**
   * Elimina una application por ID
   */
  async delete(id, options = {}) {
    try {
      const application = await Application.findByPk(id);
      if (!application) return null;
      await application.destroy(options);
      return true;
    } catch (error) {
      if (showLogs) console.error(`🔥 [ApplicationRepo.delete] Error (id: ${id}):`, error);
      throw error;
    }
  }
}

export default new ApplicationRepository();
