// src/pages/enterprise/AplicacionListado.jsx
import { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './AplicacionListado.css';
import axios from 'axios';

export default function AplicacionListado() {
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [enterprises, setEnterprises] = useState([]);
  const [modalities, setModalities] = useState([]);
  const [workdays, setWorkdays] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [message, setMessage] = useState("");
  const [statusMessage, setStatusMessage] = useState(false);

  // Estados de filtros
  const [search, setSearch] = useState("");
  const [enterpriseId, setEnterpriseId] = useState("");
  const [modalityId, setModalityId] = useState("");
  const [workdayId, setWorkdayId] = useState("");
  const [districtId, setDistrictId] = useState("");

  // Estados de paginación
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [offset, setOffset] = useState(0);

  // Cargar catálogos para los filtros (empresas, modalidades, jornadas y distritos)
  useEffect(() => {
    const _cargarCatalogos = async () => {
      try {
        const [enterprisesRes, modalitiesRes, workdaysRes, districtsRes] = await Promise.all([
          axios.get('/api/v1/enterprises/simple'),
          axios.get('/api/v1/modalities'),
          axios.get('/api/v1/workdays'),
          axios.get('/api/v1/districts'),
        ]);

        setEnterprises(enterprisesRes.data.data || []);
        setModalities(modalitiesRes.data.data || []);
        setWorkdays(workdaysRes.data.data || []);
        setDistricts(districtsRes.data.data || []);
      } catch (error) {
        console.error('Error al cargar catálogos de filtros:', error);
      }
    };
    _cargarCatalogos();
  }, []);

  // Recargar aplicaciones cuando cambie la página o el límite
  useEffect(() => {
    _cargarAplicaciones(page, limit);
  }, [page, limit]);

  const _cargarAplicaciones = async (
    currentPage = page,
    currentLimit = limit,
    filtros = { search, enterpriseId, modalityId, workdayId, districtId }
  ) => {
    try {
      const params = {
        page: currentPage,
        limit: currentLimit,
      };

      if (filtros.search.trim() !== "") params.search = filtros.search.trim();
      if (filtros.enterpriseId !== "") params.enterpriseId = filtros.enterpriseId;
      if (filtros.modalityId !== "") params.modalityId = filtros.modalityId;
      if (filtros.workdayId !== "") params.workdayId = filtros.workdayId;
      if (filtros.districtId !== "") params.districtId = filtros.districtId;

      const response = await axios.get('/api/v1/applications', { params });
      const data = response.data.data;

      setApplications(data.list || []);
      setTotal(data.total || 0);
      setTotalPages(data.pages || 1);
      setOffset(data.offset || 0);
      setMessage(response.data.message);
      setStatusMessage(response.data.success);
    } catch (error) {
      console.error(error);
      setMessage(
        error.response?.data?.message || "Error al listar las aplicaciones"
      );
      setStatusMessage(false);
    }
  };

  // Enviar formulario de filtros
  const _filtrar = (e) => {
    e.preventDefault();
    if (page === 1) {
      _cargarAplicaciones(1, limit, { search, enterpriseId, modalityId, workdayId, districtId });
    } else {
      setPage(1); // Dispara el useEffect con page = 1
    }
  };

  // Limpiar filtros
  const _limpiarFiltros = () => {
    setSearch("");
    setEnterpriseId("");
    setModalityId("");
    setWorkdayId("");
    setDistrictId("");

    const filtrosVacios = { search: "", enterpriseId: "", modalityId: "", workdayId: "", districtId: "" };
    if (page === 1) {
      _cargarAplicaciones(1, limit, filtrosVacios);
    } else {
      setPage(1);
    }
  };

  const _eliminar = async (e, id) => {
    try {
      const response = await axios.delete('/api/v1/applications/' + id);
      await _cargarAplicaciones(page, limit);

      setMessage(response.data.message);
      setStatusMessage(response.data.success);
    } catch (error) {
      console.error(error);
      setMessage(
        error.response?.data?.message || "Error al eliminar la aplicación"
      );
      setStatusMessage(false);
    }
  };

  const _editar = (e, id) => {
    navigate('/enterprise/applications/' + id + '/edit');
  };

  // Muestra solo la fecha (2026-11-01) de un valor como "2026-11-01T05:00:00.000Z"
  const _fecha = (valor) => (valor ? String(valor).slice(0, 10) : '—');

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h1>Listado de Aplicaciones</h1>
          <p className="mb-0">Bienvenido al panel de empresa.</p>
        </div>

        <NavLink to="/enterprise/applications/new" className="btn btn-secondary">
          Agregar Aplicación
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
          {/* Búsqueda por título o descripción */}
          <div className="col-md-4">
            <label htmlFor="search" className="form-label">
              Buscar (Título o Descripción)
            </label>
            <input
              type="text"
              id="search"
              className="form-control"
              placeholder="Ej. Practicante"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Filtro por Empresa (cargado desde /api/v1/enterprises) */}
          <div className="col-md-2">
            <label htmlFor="enterpriseId" className="form-label">
              Empresa
            </label>
            <select
              id="enterpriseId"
              className="form-select"
              value={enterpriseId}
              onChange={(e) => setEnterpriseId(e.target.value)}
            >
              <option value="">Todas</option>
              {Array.isArray(enterprises) && enterprises.map((enterprise) => (
                <option key={enterprise.id} value={enterprise.id}>
                  {enterprise.name}
                </option>
              ))}
            </select>
          </div>

          {/* Filtro por Modalidad (cargado desde /api/v1/modalities) */}
          <div className="col-md-2">
            <label htmlFor="modalityId" className="form-label">
              Modalidad
            </label>
            <select
              id="modalityId"
              className="form-select"
              value={modalityId}
              onChange={(e) => setModalityId(e.target.value)}
            >
              <option value="">Todas</option>
              {Array.isArray(modalities) && modalities.map((modality) => (
                <option key={modality.id} value={modality.id}>
                  {modality.name}
                </option>
              ))}
            </select>
          </div>

          {/* Filtro por Jornada (cargado desde /api/v1/workdays) */}
          <div className="col-md-2">
            <label htmlFor="workdayId" className="form-label">
              Jornada
            </label>
            <select
              id="workdayId"
              className="form-select"
              value={workdayId}
              onChange={(e) => setWorkdayId(e.target.value)}
            >
              <option value="">Todas</option>
              {Array.isArray(workdays) && workdays.map((workday) => (
                <option key={workday.id} value={workday.id}>
                  {workday.name}
                </option>
              ))}
            </select>
          </div>

          {/* Filtro por Distrito (cargado desde /api/v1/districts) */}
          <div className="col-md-2">
            <label htmlFor="districtId" className="form-label">
              Distrito
            </label>
            <select
              id="districtId"
              className="form-select"
              value={districtId}
              onChange={(e) => setDistrictId(e.target.value)}
            >
              <option value="">Todos</option>
              {Array.isArray(districts) && districts.map((district) => (
                <option key={district.id} value={district.id}>
                  {district.name}
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
          TABLA DE APLICACIONES
          ===================================================== */}
      <div className="table-responsive">
        <table className="table table-hover align-middle">
          <thead>
            <tr>
              <th>ID</th>
              <th>Título</th>
              <th>Empresa</th>
              <th>Modalidad</th>
              <th>Jornada</th>
              <th>Distrito</th>
              <th>Vacantes</th>
              <th>Sueldo</th>
              <th>Publicado</th>
              <th>Estado</th>
              <th>Operaciones</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(applications) && applications.length > 0 ? (
              applications.map((application) => (
                <tr key={application.id}>
                  <td>{application.id}</td>
                  <td>{application.title}</td>
                  <td>{application.enterprise?.name || '—'}</td>
                  <td>{application.modality?.name || '—'}</td>
                  <td>{application.workday?.name || '—'}</td>
                  <td>{application.district?.name || '—'}</td>
                  <td>{application.vacancies ?? '—'}</td>
                  <td>{application.salarry ? 'S/ ' + application.salarry : '—'}</td>
                  <td>{_fecha(application.published)}</td>
                  <td>{application.is_draft ? 'Borrador' : 'Publicado'}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-warning me-1"
                      onClick={(e) => _editar(e, application.id)}
                    >
                      Editar
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={(e) => _eliminar(e, application.id)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="11" className="text-center py-4 text-muted">
                  No se encontraron aplicaciones con los filtros seleccionados.
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
              ? `Mostrando ${offset + 1}–${Math.min(offset + limit, total)} de ${total} aplicaciones`
              : 'Mostrando 0 aplicaciones'}
          </span>
        </div>

        <nav aria-label="Paginación de aplicaciones">
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
