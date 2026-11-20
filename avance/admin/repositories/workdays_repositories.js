// admin/repositories/workdays_repositories.js
import Workday from '../models/workday.js';

const showLogs = process.env.SHOW_DB_ERRORS === 'true' || process.env.NODE_ENV === 'development';

class WorkdayRepository {
  /**
   * Obtiene todos los registros
   */
  async findAll() {
    try {
      return await Workday.findAll();
    } catch (error) {
      if (showLogs) console.error('🔥 [WorkdayRepo.findAll] Error:', error);
      throw error;
    }
  }

  /**
   * Obtiene todos los registros ordenados
   */
  async findAllSimple(options = {}) {
    try {
      const { order = [['id', 'ASC']] } = options;
      return await Workday.findAll({
        order,
      });
    } catch (error) {
      if (showLogs) console.error('🔥 [WorkdayRepo.findAllSimple] Error:', error);
      throw error;
    }
  }

  /**
   * Obtiene registros con paginación
   */
  async findAllPaginated(options = {}) {
    try {
      const { where = {}, offset = 0, limit = 10, order = [['id', 'DESC']] } = options;
      return await Workday.findAll({
        where,
        offset,
        limit,
        order,
      });
    } catch (error) {
      if (showLogs) console.error('🔥 [WorkdayRepo.findAllPaginated] Error:', error);
      throw error;
    }
  }

  /**
   * Cuenta registros con filtros
   */
  async count(where = {}) {
    try {
      return await Workday.count({ where });
    } catch (error) {
      if (showLogs) console.error('🔥 [WorkdayRepo.count] Error:', error);
      throw error;
    }
  }

  /**
   * Busca jornada por ID
   */
  async findById(id) {
    try {
      return await Workday.findByPk(id);
    } catch (error) {
      if (showLogs) console.error(`🔥 [WorkdayRepo.findById] Error (id: ${id}):`, error);
      throw error;
    }
  }

  /**
   * Crea un nuevo registro
   */
  async create(data) {
    try {
      return await Workday.create(data);
    } catch (error) {
      if (showLogs) console.error('🔥 [WorkdayRepo.create] Error:', error);
      throw error;
    }
  }

  /**
   * Actualiza un registro por ID
   */
  async update(id, data) {
    try {
      const workday = await Workday.findByPk(id);
      if (!workday) return null;
      return await workday.update(data);
    } catch (error) {
      if (showLogs) console.error(`🔥 [WorkdayRepo.update] Error (id: ${id}):`, error);
      throw error;
    }
  }

  /**
   * Elimina un registro por ID
   */
  async delete(id) {
    try {
      const workday = await Workday.findByPk(id);
      if (!workday) return null;
      await workday.destroy();
      return true;
    } catch (error) {
      if (showLogs) console.error(`🔥 [WorkdayRepo.delete] Error (id: ${id}):`, error);
      throw error;
    }
  }
}

export default new WorkdayRepository();