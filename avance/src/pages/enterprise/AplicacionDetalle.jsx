// src/pages/enterprise/AplicacionDetalle.jsx
import { useState, useEffect } from 'react';
import { NavLink, useParams } from 'react-router-dom';
import './AplicacionDetalle.css';
import axios from 'axios';

export default function AplicacionDetalle() {
  const { id } = useParams();

  const [message, setMessage] = useState("");
  const [statusMessage, setStatusMessage] = useState(false);

  // Catálogos (llaves foráneas)
  const [enterprises, setEnterprises] = useState([]);
  const [modalities, setModalities] = useState([]);
  const [workdays, setWorkdays] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [semesters, setSemesters] = useState([]);

  // Campos del modelo Application
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [benefits, setBenefits] = useState("");
  const [functions, setFunctions] = useState("");
  const [vacancies, setVacancies] = useState("");
  const [salarry, setSalarry] = useState("");
  const [published, setPublished] = useState("");
  const [closed, setClosed] = useState("");
  const [emailNotification, setEmailNotification] = useState(false);
  const [isDraft, setIsDraft] = useState(true);
  const [enterpriseId, setEnterpriseId] = useState("");
  const [modalityId, setModalityId] = useState("");
  const [workdayId, setWorkdayId] = useState("");
  const [districtId, setDistrictId] = useState("");
  const [sementerId, setSementerId] = useState("");

  // Cargar catálogos (empresas, modalidades, jornadas, distritos y semestres)
  useEffect(() => {
    const _cargarCatalogos = async () => {
      try {
        const [enterprisesRes, modalitiesRes, workdaysRes, districtsRes, semestersRes] = await Promise.all([
          axios.get('/api/v1/enterprises/simple'),
          axios.get('/api/v1/modalities'),
          axios.get('/api/v1/workdays'),
          axios.get('/api/v1/districts'),
          axios.get('/api/v1/semesters'),
        ]);

        setEnterprises(enterprisesRes.data.data || []);
        setModalities(modalitiesRes.data.data || []);
        setWorkdays(workdaysRes.data.data || []);
        setDistricts(districtsRes.data.data || []);
        setSemesters(semestersRes.data.data || []);
      } catch (error) {
        console.error('Error al cargar catálogos:', error);
      }
    };
    _cargarCatalogos();
  }, []);

  // Si existe :id, cargar los datos de la aplicación para editar
  useEffect(() => {
    const _obtenerAplicacion = async () => {
      if (id !== undefined) {
        try {
          const response = await axios.get('/api/v1/applications/' + id);
          const application = response.data.data;

          setTitle(application.title || "");
          setDescription(application.description || "");
          setBenefits(application.benefits || "");
          setFunctions(application.functions || "");
          setVacancies(application.vacancies ?? "");
          setSalarry(application.salarry ?? "");
          // las fechas llegan como "2026-11-01T05:00:00.000Z", el input date necesita "2026-11-01"
          setPublished(application.published ? application.published.slice(0, 10) : "");
          setClosed(application.closed ? application.closed.slice(0, 10) : "");
          setEmailNotification(application.email_notification || false);
          setIsDraft(application.is_draft ?? true);
          setEnterpriseId(application.enterprise_id || "");
          setModalityId(application.modality_id || "");
          setWorkdayId(application.workday_id || "");
          setDistrictId(application.district_id || "");
          setSementerId(application.sementer_id || "");
        } catch (error) {
          console.error(error);
          setMessage(
            error.response?.data?.message || "Error al obtener la aplicación"
          );
          setStatusMessage(false);
        }
      }
    };
    _obtenerAplicacion();
  }, [id]);

  const _limpiarFormulario = () => {
    setTitle("");
    setDescription("");
    setBenefits("");
    setFunctions("");
    setVacancies("");
    setSalarry("");
    setPublished("");
    setClosed("");
    setEmailNotification(false);
    setIsDraft(true);
    setEnterpriseId("");
    setModalityId("");
    setWorkdayId("");
    setDistrictId("");
    setSementerId("");
  };

  const _guardarAplicacion = async (e) => {
    e.preventDefault();

    const payload = {
      title: title.trim(),
      description: description.trim() || null,
      benefits: benefits.trim() || null,
      functions: functions.trim() || null,
      vacancies: vacancies !== "" ? Number(vacancies) : null,
      salarry: salarry !== "" ? Number(salarry) : null,
      published: published || null,
      closed: closed || null,
      email_notification: emailNotification,
      is_draft: isDraft,
      enterprise_id: enterpriseId !== "" ? Number(enterpriseId) : null,
      modality_id: modalityId !== "" ? Number(modalityId) : null,
      workday_id: workdayId !== "" ? Number(workdayId) : null,
      district_id: districtId !== "" ? Number(districtId) : null,
      sementer_id: sementerId !== "" ? Number(sementerId) : null,
    };

    try {
      let response;

      if (id === undefined) {
        response = await axios.post('/api/v1/applications', payload);
        if (response.data.success) {
          _limpiarFormulario();
        }
      } else {
        response = await axios.put('/api/v1/applications/' + id, payload);
      }

      setMessage(response.data.message);
      setStatusMessage(response.data.success);
    } catch (error) {
      console.error(error);
      setMessage(
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Error al guardar la aplicación"
      );
      setStatusMessage(false);
    }
  };

  return (
    <>
      <h1>{id === undefined ? "Nueva Aplicación" : "Editar Aplicación"}</h1>

      {message !== "" && (
        <div
          className={`alert ${statusMessage ? 'alert-success' : 'alert-danger'}`}
          role="alert"
          id="alertMessage"
        >
          {message}
        </div>
      )}

      <NavLink to="/enterprise/applications" className="btn btn-secondary mb-3">
        Retroceder
      </NavLink>

      <form onSubmit={_guardarAplicacion} className="card p-4">
        <div className="row g-3">
          {/* Título */}
          <div className="col-md-8">
            <label htmlFor="title" className="form-label">
              Título *
            </label>
            <input
              type="text"
              id="title"
              className="form-control"
              placeholder="Ej. Practicante de Desarrollo Web"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={40}
              required
            />
          </div>

          {/* Empresa (obligatoria en la BD) */}
          <div className="col-md-4">
            <label htmlFor="enterprise_id" className="form-label">
              Empresa *
            </label>
            <select
              id="enterprise_id"
              className="form-select"
              value={enterpriseId}
              onChange={(e) => setEnterpriseId(e.target.value)}
              required
            >
              <option value="">Seleccionar empresa</option>
              {Array.isArray(enterprises) && enterprises.map((enterprise) => (
                <option key={enterprise.id} value={enterprise.id}>
                  {enterprise.name}
                </option>
              ))}
            </select>
          </div>

          {/* Modalidad */}
          <div className="col-md-3">
            <label htmlFor="modality_id" className="form-label">
              Modalidad
            </label>
            <select
              id="modality_id"
              className="form-select"
              value={modalityId}
              onChange={(e) => setModalityId(e.target.value)}
            >
              <option value="">Seleccionar modalidad</option>
              {Array.isArray(modalities) && modalities.map((modality) => (
                <option key={modality.id} value={modality.id}>
                  {modality.name}
                </option>
              ))}
            </select>
          </div>

          {/* Jornada */}
          <div className="col-md-3">
            <label htmlFor="workday_id" className="form-label">
              Jornada
            </label>
            <select
              id="workday_id"
              className="form-select"
              value={workdayId}
              onChange={(e) => setWorkdayId(e.target.value)}
            >
              <option value="">Seleccionar jornada</option>
              {Array.isArray(workdays) && workdays.map((workday) => (
                <option key={workday.id} value={workday.id}>
                  {workday.name}
                </option>
              ))}
            </select>
          </div>

          {/* Distrito */}
          <div className="col-md-3">
            <label htmlFor="district_id" className="form-label">
              Distrito
            </label>
            <select
              id="district_id"
              className="form-select"
              value={districtId}
              onChange={(e) => setDistrictId(e.target.value)}
            >
              <option value="">Seleccionar distrito</option>
              {Array.isArray(districts) && districts.map((district) => (
                <option key={district.id} value={district.id}>
                  {district.name}
                </option>
              ))}
            </select>
          </div>

          {/* Semestre */}
          <div className="col-md-3">
            <label htmlFor="sementer_id" className="form-label">
              Semestre
            </label>
            <select
              id="sementer_id"
              className="form-select"
              value={sementerId}
              onChange={(e) => setSementerId(e.target.value)}
            >
              <option value="">Seleccionar semestre</option>
              {Array.isArray(semesters) && semesters.map((semester) => (
                <option key={semester.id} value={semester.id}>
                  {semester.name}
                </option>
              ))}
            </select>
          </div>

          {/* Vacantes */}
          <div className="col-md-3">
            <label htmlFor="vacancies" className="form-label">
              Vacantes
            </label>
            <input
              type="number"
              id="vacancies"
              className="form-control"
              placeholder="Ej. 2"
              min="1"
              value={vacancies}
              onChange={(e) => setVacancies(e.target.value)}
            />
          </div>

          {/* Sueldo */}
          <div className="col-md-3">
            <label htmlFor="salarry" className="form-label">
              Sueldo (S/)
            </label>
            <input
              type="number"
              id="salarry"
              className="form-control"
              placeholder="Ej. 1200.00"
              step="0.01"
              min="0"
              value={salarry}
              onChange={(e) => setSalarry(e.target.value)}
            />
          </div>

          {/* Fecha de publicación */}
          <div className="col-md-3">
            <label htmlFor="published" className="form-label">
              Fecha de publicación
            </label>
            <input
              type="date"
              id="published"
              className="form-control"
              value={published}
              onChange={(e) => setPublished(e.target.value)}
            />
          </div>

          {/* Fecha de cierre */}
          <div className="col-md-3">
            <label htmlFor="closed" className="form-label">
              Fecha de cierre
            </label>
            <input
              type="date"
              id="closed"
              className="form-control"
              value={closed}
              onChange={(e) => setClosed(e.target.value)}
            />
          </div>

          {/* Descripción */}
          <div className="col-12">
            <label htmlFor="description" className="form-label">
              Descripción
            </label>
            <textarea
              id="description"
              className="form-control"
              rows="3"
              placeholder="Descripción de la convocatoria..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Funciones */}
          <div className="col-md-6">
            <label htmlFor="functions" className="form-label">
              Funciones
            </label>
            <textarea
              id="functions"
              className="form-control"
              rows="3"
              value={functions}
              onChange={(e) => setFunctions(e.target.value)}
            />
          </div>

          {/* Beneficios */}
          <div className="col-md-6">
            <label htmlFor="benefits" className="form-label">
              Beneficios
            </label>
            <textarea
              id="benefits"
              className="form-control"
              rows="3"
              value={benefits}
              onChange={(e) => setBenefits(e.target.value)}
            />
          </div>

          {/* Checkboxes (BOOLEAN) */}
          <div className="col-md-6">
            <div className="form-check">
              <input
                type="checkbox"
                id="email_notification"
                className="form-check-input"
                checked={emailNotification}
                onChange={(e) => setEmailNotification(e.target.checked)}
              />
              <label htmlFor="email_notification" className="form-check-label">
                Notificar por correo
              </label>
            </div>
          </div>

          <div className="col-md-6">
            <div className="form-check">
              <input
                type="checkbox"
                id="is_draft"
                className="form-check-input"
                checked={isDraft}
                onChange={(e) => setIsDraft(e.target.checked)}
              />
              <label htmlFor="is_draft" className="form-check-label">
                Guardar como borrador
              </label>
            </div>
          </div>

          <div className="col-12">
            <button type="submit" className="btn btn-primary">
              Guardar Aplicación
            </button>
          </div>
        </div>
      </form>
    </>
  );
}
