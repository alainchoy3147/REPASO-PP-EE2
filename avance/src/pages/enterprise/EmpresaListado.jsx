// src/pages/enterprise/EmpresaListado.jsx
import { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './EmpresaListado.css';
import axios from 'axios';

export default function EmpresaListado() {
  const navigate = useNavigate();

  const [enterprises, setEnterprises] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [message, setMessage] = useState("");
  const [statusMessage, setStatusMessage] = useState(false);

  // Estados de filtros
  const [search, setSearch] = useState("");
  const [districtId, setDistrictId] = useState("");

  // Estados de paginación
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [offset, setOffset] = useState(0);

  // Cargar catálogo para el filtro (distritos)
  useEffect(() => {
    const _cargarCatalogos = async () => {
      try {
        const districtsRes = await axios.get('/api/v1/districts');
        setDistricts(districtsRes.data.data || []);
      } catch (error) {
        console.error('Error al cargar catálogos de filtros:', error);
      }
    };
    _cargarCatalogos();
  }, []);

  // Recargar empresas cuando cambie la página o el límite
  useEffect(() => {
    _cargarEmpresas(page, limit);
  }, [page, limit]);

  const _cargarEmpresas = async (
    currentPage = page,
    currentLimit = limit,
    filtros = { search, districtId }
  ) => {
    try {
      const params = {
        page: currentPage,
        limit: currentLimit,
      };

      if (filtros.search.trim() !== "") params.search = filtros.search.trim();
      if (filtros.districtId !== "") params.districtId = filtros.districtId;

      const response = await axios.get('/api/v1/enterprises', { params });
      const data = response.data.data;

      setEnterprises(data.list || []);
      setTotal(data.total || 0);
      setTotalPages(data.pages || 1);
      setOffset(data.offset || 0);
      setMessage(response.data.message);
      setStatusMessage(response.data.success);
    } catch (error) {
      console.error(error);
      setMessage(
        error.response?.data?.message || "Error al listar las empresas"
      );
      setStatusMessage(false);
    }
  };

  // Enviar formulario de filtros
  const _filtrar = (e) => {
    e.preventDefault();
    if (page === 1) {
      _cargarEmpresas(1, limit, { search, districtId });
    } else {
      setPage(1); // Dispara el useEffect con page = 1
    }
  };

  // Limpiar filtros
  const _limpiarFiltros = () => {
    setSearch("");
    setDistrictId("");

    const filtrosVacios = { search: "", districtId: "" };
    if (page === 1) {
      _cargarEmpresas(1, limit, filtrosVacios);
    } else {
      setPage(1);
    }
  };

  const _eliminar = async (e, id) => {
    try {
      const response = await axios.delete('/api/v1/enterprises/' + id);
      await _cargarEmpresas(page, limit);

      setMessage(response.data.message);
      setStatusMessage(response.data.success);
    } catch (error) {
      console.error(error);
      setMessage(
        error.response?.data?.message || "Error al eliminar la empresa"
      );
      setStatusMessage(false);
    }
  };

  const _editar = (e, id) => {
    navigate('/enterprise/enterprises/' + id + '/edit');
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h1>Listado de Empresas</h1>
          <p className="mb-0">Bienvenido al panel de empresa.</p>
        </div>

        <NavLink to="/enterprise/enterprises/new" className="btn btn-secondary">
          Agregar Empresa
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
              Buscar (Nombre, RUC o Email)
            </label>
            <input
              type="text"
              id="search"
              className="form-control"
              placeholder="Ej. Tech Solutions o 20123456781"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Filtro por Distrito (cargado desde /api/v1/districts) */}
          <div className="col-md-6">
            <label htmlFor="districtId" className="form-label">
              Distrito
            </label>
            <select
              id="districtId"
              className="form-select"
              value={districtId}
              onChange={(e) => setDistrictId(e.target.value)}
            >
              <option value="">Todos los distritos</option>
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
          TABLA DE EXPERIENCIAS
          ===================================================== */}
      <div className="table-responsive">
        <table className="table table-hover align-middle">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>RUC</th>
              <th>Email</th>
              <th>Teléfono</th>
              <th>Distrito</th>
              <th>Usuario</th>
              <th>Operaciones</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(enterprises) && enterprises.length > 0 ? (
              enterprises.map((enterprise) => (
                <tr key={enterprise.id}>
                  <td>{enterprise.id}</td>
                  <td>{enterprise.name}</td>
                  <td>{enterprise.ruc}</td>
                  <td>{enterprise.email}</td>
                  <td>{enterprise.phone || '—'}</td>
                  <td>{enterprise.district?.name || '—'}</td>
                  <td>{enterprise.user?.email || '—'}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-warning me-1"
                      onClick={(e) => _editar(e, enterprise.id)}
                    >
                      Editar
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={(e) => _eliminar(e, enterprise.id)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center py-4 text-muted">
                  No se encontraron empresas con los filtros seleccionados.
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
              ? `Mostrando ${offset + 1}–${Math.min(offset + limit, total)} de ${total} empresas`
              : 'Mostrando 0 empresas'}
          </span>
        </div>

        <nav aria-label="Paginación de empresas">
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
