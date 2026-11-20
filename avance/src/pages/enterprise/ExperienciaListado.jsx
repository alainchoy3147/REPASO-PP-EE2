// src/pages/enterprise/ExperienciaListado.jsx
import { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './ExperienciaListado.css';
import axios from 'axios';

export default function ExperienciaListado() {
  const navigate = useNavigate();

  const [experiences, setExperiences] = useState([]);
  const [students, setStudents] = useState([]);
  const [message, setMessage] = useState("");
  const [statusMessage, setStatusMessage] = useState(false);

  // Estados de filtros
  const [search, setSearch] = useState("");
  const [studentId, setStudentId] = useState("");

  // Estados de paginación
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [offset, setOffset] = useState(0);

  // Cargar catálogo para el filtro (estudiantes)
  useEffect(() => {
    const _cargarCatalogos = async () => {
      try {
        const studentsRes = await axios.get('/api/v1/students/simple');
        setStudents(studentsRes.data.data || []);
      } catch (error) {
        console.error('Error al cargar catálogos de filtros:', error);
      }
    };
    _cargarCatalogos();
  }, []);

  // Recargar experiencias cuando cambie la página o el límite
  useEffect(() => {
    _cargarExperiencias(page, limit);
  }, [page, limit]);

  const _cargarExperiencias = async (
    currentPage = page,
    currentLimit = limit,
    filtros = { search, studentId }
  ) => {
    try {
      const params = {
        page: currentPage,
        limit: currentLimit,
      };

      if (filtros.search.trim() !== "") params.search = filtros.search.trim();
      if (filtros.studentId !== "") params.studentId = filtros.studentId;

      const response = await axios.get('/api/v1/experiences', { params });
      const data = response.data.data;

      setExperiences(data.list || []);
      setTotal(data.total || 0);
      setTotalPages(data.pages || 1);
      setOffset(data.offset || 0);
      setMessage(response.data.message);
      setStatusMessage(response.data.success);
    } catch (error) {
      console.error(error);
      setMessage(
        error.response?.data?.message || "Error al listar las experiencias"
      );
      setStatusMessage(false);
    }
  };

  // Enviar formulario de filtros
  const _filtrar = (e) => {
    e.preventDefault();
    if (page === 1) {
      _cargarExperiencias(1, limit, { search, studentId });
    } else {
      setPage(1); // Dispara el useEffect con page = 1
    }
  };

  // Limpiar filtros
  const _limpiarFiltros = () => {
    setSearch("");
    setStudentId("");

    const filtrosVacios = { search: "", studentId: "" };
    if (page === 1) {
      _cargarExperiencias(1, limit, filtrosVacios);
    } else {
      setPage(1);
    }
  };

  const _eliminar = async (e, id) => {
    try {
      const response = await axios.delete('/api/v1/experiences/' + id);
      await _cargarExperiencias(page, limit);

      setMessage(response.data.message);
      setStatusMessage(response.data.success);
    } catch (error) {
      console.error(error);
      setMessage(
        error.response?.data?.message || "Error al eliminar la experiencia"
      );
      setStatusMessage(false);
    }
  };

  const _editar = (e, id) => {
    navigate('/enterprise/experiences/' + id + '/edit');
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h1>Listado de Experiencias</h1>
          <p className="mb-0">Bienvenido al panel de empresa.</p>
        </div>

        <NavLink to="/enterprise/experiences/new" className="btn btn-secondary">
          Agregar Experiencia
        </NavLink>
      </div>

      {message !== "" && (
        <div
          className={`alert ${statusMessage ? 'alert-success' : 'alert-danger'}`}
          role="alert"
          id="alertMessage"
        >
          {message}
        </div>
      )}

      {/* =====================================================
          FORMULARIO DE FILTROS
          ===================================================== */}
      <form onSubmit={_filtrar} className="card p-3 mb-3">
        <div className="row g-2 align-items-end">
          {/* Búsqueda por puesto o empresa */}
          <div className="col-md-6">
            <label htmlFor="search" className="form-label">
              Buscar (Puesto o Empresa)
            </label>
            <input
              type="text"
              id="search"
              className="form-control"
              placeholder="Ej. Practicante o Tech Solutions"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Filtro por Estudiante (cargado desde /api/v1/students/simple) */}
          <div className="col-md-6">
            <label htmlFor="studentId" className="form-label">
              Estudiante
            </label>
            <select
              id="studentId"
              className="form-select"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
            >
              <option value="">Todos los estudiantes</option>
              {Array.isArray(students) && students.map((student) => (
                <option key={student.id} value={student.id}>
                  {student.names} {student.last_names}
                </option>
              ))}
            </select>
          </div>

          {/* Botones de acción del filtro */}
          <div className="col-12 d-flex justify-content-end gap-2 mt-2">
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={_limpiarFiltros}
            >
              Limpiar
            </button>
            <button type="submit" className="btn btn-primary">
              Filtrar
            </button>
          </div>
        </div>
      </form>

      {/* =====================================================
          TABLA DE EXPERIENCIAS
          ===================================================== */}
      <div className="table-responsive">
        <table className="table table-hover align-middle">
          <thead>
            <tr>
              <th>ID</th>
              <th>Puesto</th>
              <th>Empresa</th>
              <th>Estudiante</th>
              <th>Inicio</th>
              <th>Fin</th>
              <th>Operaciones</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(experiences) && experiences.length > 0 ? (
              experiences.map((experience) => (
                <tr key={experience.id}>
                  <td>{experience.id}</td>
                  <td>{experience.name}</td>
                  <td>{experience.enterprise || '—'}</td>
                  <td>
                    {experience.student
                      ? `${experience.student.names} ${experience.student.last_names}`
                      : '—'}
                  </td>
                  <td>{experience.start_date || '—'}</td>
                  <td>{experience.end_date || 'Actualidad'}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-warning me-1"
                      onClick={(e) => _editar(e, experience.id)}
                    >
                      Editar
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={(e) => _eliminar(e, experience.id)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center py-4 text-muted">
                  No se encontraron experiencias con los filtros seleccionados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* =====================================================
          CONTROLES DE PAGINACIÓN
          ===================================================== */}
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mt-3">
        <div className="d-flex align-items-center gap-2">
          <label htmlFor="limitSelect" className="form-label mb-0">
            Filas por página:
          </label>
          <select
            id="limitSelect"
            className="form-select form-select-sm"
            style={{ width: '80px' }}
            value={limit}
            onChange={(e) => {
              setLimit(Number(e.target.value));
              setPage(1);
            }}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>

          <span className="text-muted small ms-2">
            {total > 0
              ? `Mostrando ${offset + 1}–${Math.min(offset + limit, total)} de ${total} experiencias`
              : 'Mostrando 0 experiencias'}
          </span>
        </div>

        <nav aria-label="Paginación de experiencias">
          <ul className="pagination pagination-sm mb-0">
            <li className={`page-item ${page <= 1 ? 'disabled' : ''}`}>
              <button type="button" className="page-link" onClick={() => setPage(1)} disabled={page <= 1}>
                Primero
              </button>
            </li>
            <li className={`page-item ${page <= 1 ? 'disabled' : ''}`}>
              <button type="button" className="page-link" onClick={() => setPage((prev) => Math.max(1, prev - 1))} disabled={page <= 1}>
                Anterior
              </button>
            </li>
            <li className="page-item active">
              <span className="page-link">
                Página {page} de {totalPages || 1}
              </span>
            </li>
            <li className={`page-item ${page >= totalPages ? 'disabled' : ''}`}>
              <button type="button" className="page-link" onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))} disabled={page >= totalPages}>
                Siguiente
              </button>
            </li>
            <li className={`page-item ${page >= totalPages ? 'disabled' : ''}`}>
              <button type="button" className="page-link" onClick={() => setPage(totalPages)} disabled={page >= totalPages}>
                Último
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
}
