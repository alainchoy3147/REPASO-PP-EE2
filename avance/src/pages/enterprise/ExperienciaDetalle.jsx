// src/pages/enterprise/ExperienciaDetalle.jsx
import { useState, useEffect } from 'react';
import { NavLink, useParams } from 'react-router-dom';
import './ExperienciaDetalle.css';
import axios from 'axios';

export default function ExperienciaDetalle() {
  const { id } = useParams();

  const [message, setMessage] = useState("");
  const [statusMessage, setStatusMessage] = useState(false);

  // Catálogo (llave foránea student_id)
  const [students, setStudents] = useState([]);

  // Campos del modelo Experience
  const [name, setName] = useState("");
  const [enterprise, setEnterprise] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [studentId, setStudentId] = useState("");

  // Cargar catálogo de estudiantes
  useEffect(() => {
    const _cargarCatalogos = async () => {
      try {
        const studentsRes = await axios.get('/api/v1/students/simple');
        setStudents(studentsRes.data.data || []);
      } catch (error) {
        console.error('Error al cargar catálogos:', error);
      }
    };
    _cargarCatalogos();
  }, []);

  // Si existe :id, cargar los datos de la experiencia para editar
  useEffect(() => {
    const _obtenerExperiencia = async () => {
      if (id !== undefined) {
        try {
          const response = await axios.get('/api/v1/experiences/' + id);
          const experience = response.data.data;

          setName(experience.name || "");
          setEnterprise(experience.enterprise || "");
          setDescription(experience.description || "");
          setStartDate(experience.start_date || "");
          setEndDate(experience.end_date || "");
          setStudentId(experience.student_id || "");
        } catch (error) {
          console.error(error);
          setMessage(
            error.response?.data?.message || "Error al obtener la experiencia"
          );
          setStatusMessage(false);
        }
      }
    };
    _obtenerExperiencia();
  }, [id]);

  const _limpiarFormulario = () => {
    setName("");
    setEnterprise("");
    setDescription("");
    setStartDate("");
    setEndDate("");
    setStudentId("");
  };

  const _guardarExperiencia = async (e) => {
    e.preventDefault();

    const payload = {
      name: name.trim(),
      enterprise: enterprise.trim() || null,
      description: description.trim() || null,
      start_date: startDate || null,
      end_date: endDate || null,
      student_id: studentId !== "" ? Number(studentId) : null,
    };

    try {
      let response;

      if (id === undefined) {
        response = await axios.post('/api/v1/experiences', payload);
        if (response.data.success) {
          _limpiarFormulario();
        }
      } else {
        response = await axios.put('/api/v1/experiences/' + id, payload);
      }

      setMessage(response.data.message);
      setStatusMessage(response.data.success);
    } catch (error) {
      console.error(error);
      setMessage(
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Error al guardar la experiencia"
      );
      setStatusMessage(false);
    }
  };

  return (
    <>
      <h1>{id === undefined ? "Nueva Experiencia" : "Editar Experiencia"}</h1>

      {message !== "" && (
        <div
          className={`alert ${statusMessage ? 'alert-success' : 'alert-danger'}`}
          role="alert"
          id="alertMessage"
        >
          {message}
        </div>
      )}

      <NavLink to="/enterprise/experiences" className="btn btn-secondary mb-3">
        Retroceder
      </NavLink>

      <form onSubmit={_guardarExperiencia} className="card p-4">
        <div className="row g-3">
          {/* Puesto */}
          <div className="col-md-6">
            <label htmlFor="name" className="form-label">
              Puesto *
            </label>
            <input
              type="text"
              id="name"
              className="form-control"
              placeholder="Ej. Practicante de Desarrollo"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={60}
              required
            />
          </div>

          {/* Empresa (texto libre en esta tabla) */}
          <div className="col-md-6">
            <label htmlFor="enterprise" className="form-label">
              Empresa *
            </label>
            <input
              type="text"
              id="enterprise"
              className="form-control"
              placeholder="Ej. Tech Solutions"
              value={enterprise}
              onChange={(e) => setEnterprise(e.target.value)}
              maxLength={60}
              required
            />
          </div>

          {/* Estudiante (llave foránea student_id, obligatoria) */}
          <div className="col-md-6">
            <label htmlFor="student_id" className="form-label">
              Estudiante *
            </label>
            <select
              id="student_id"
              className="form-select"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              required
            >
              <option value="">Seleccionar estudiante</option>
              {Array.isArray(students) && students.map((student) => (
                <option key={student.id} value={student.id}>
                  {student.names} {student.last_names}
                </option>
              ))}
            </select>
          </div>

          {/* Fecha de inicio */}
          <div className="col-md-3">
            <label htmlFor="start_date" className="form-label">
              Fecha de inicio *
            </label>
            <input
              type="date"
              id="start_date"
              className="form-control"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
          </div>

          {/* Fecha de fin */}
          <div className="col-md-3">
            <label htmlFor="end_date" className="form-label">
              Fecha de fin
            </label>
            <input
              type="date"
              id="end_date"
              className="form-control"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
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
              placeholder="¿Qué hizo el estudiante en este puesto?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="col-12">
            <button type="submit" className="btn btn-primary">
              Guardar Experiencia
            </button>
          </div>
        </div>
      </form>
    </>
  );
}
