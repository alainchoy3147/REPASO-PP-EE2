// admin/repositories/enterprise_repositories.js
import Enterprise from '../models/enterprise.js';
import District from '../models/district.js';
import User from '../models/user.js';
import { Op } from 'sequelize';

const showLogs = process.env.SHOW_DB_ERRORS === 'true' || process.env.NODE_ENV === 'development';

class EnterpriseRepository {
  /**
   * Obtiene todas las enterprises sin paginación
   */
  async findAll(options = {}) {
    try {
      const { where = {}, include = [], order = [['id', 'DESC']] } = options;
      return await Enterprise.findAll({
        where,
        include,
        order,
      });
    } catch (error) {
      if (showLogs) console.error('🔥 [EnterpriseRepo.findAll] Error:', error);
      throw error;
    }
  }

  /**
   * Obtiene enterprises con paginación y filtros
   */
  async findAllPaginated(options = {}) {
    try {
      const {
        where = {},
        offset = 0,
        limit = 10,
        order = [['id', 'DESC']],
        include = [
          { model: District, as: 'district', attributes: ['id', 'name'] },
          { model: User, as: 'user', attributes: ['id', 'email'] },
        ],
      } = options;

      return await Enterprise.findAndCountAll({
        where,
        offset,
        limit,
        order,
        include,
        distinct: true, // Evita conteos duplicados al usar includes
      });
    } catch (error) {
      if (showLogs) console.error('🔥 [EnterpriseRepo.findAllPaginated] Error:', error);
      throw error;
    }
  }

  /**
   * Cuenta las enterprises con filtros
   */
  async count(where = {}) {
    try {
      return await Enterprise.count({ where });
    } catch (error) {
      if (showLogs) console.error('🔥 [EnterpriseRepo.count] Error:', error);
      throw error;
    }
  }

  /**
   * Busca enterprise por ID con sus relaciones asociadas
   */
  async findById(id, options = {}) {
    try {
      const {
        include = [
          { model: District, as: 'district' },
          { model: User, as: 'user', attributes: ['id', 'email'] },
        ]
      } = options;

      return await Enterprise.findByPk(id, { include });
    } catch (error) {
      if (showLogs) console.error(`🔥 [EnterpriseRepo.findById] Error (id: ${id}):`, error);
      throw error;
    }
  }

  /**
   * Crea una nueva enterprise
   */
  async create(data, options = {}) {
    try {
      return await Enterprise.create(data, options);
    } catch (error) {
      if (showLogs) console.error('🔥 [EnterpriseRepo.create] Error:', error);
      throw error;
    }
  }

  /**
   * Actualiza una enterprise por ID
   */
  async update(id, data, options = {}) {
    try {
      const enterprise = await Enterprise.findByPk(id);
      if (!enterprise) return null;
      return await enterprise.update(data, options);
    } catch (error) {
      if (showLogs) console.error(`🔥 [EnterpriseRepo.update] Error (id: ${id}):`, error);
      throw error;
    }
  }

  /**
   * Elimina una enterprise por ID
   */
  async delete(id, options = {}) {
    try {
      const enterprise = await Enterprise.findByPk(id);
      if (!enterprise) return null;
      await enterprise.destroy(options);
      return true;
    } catch (error) {
      if (showLogs) console.error(`🔥 [EnterpriseRepo.delete] Error (id: ${id}):`, error);
      throw error;
    }
  }
}

export default new EnterpriseRepository();
