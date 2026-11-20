// src/pages/enterprise/EmpresaDetalle.jsx
import { useState, useEffect } from 'react';
import { NavLink, useParams } from 'react-router-dom';
import './EmpresaDetalle.css';
import axios from 'axios';

export default function EmpresaDetalle() {
  const { id } = useParams();

  const [message, setMessage] = useState("");
  const [statusMessage, setStatusMessage] = useState(false);

  // Catálogo (llave foránea district_id)
  const [districts, setDistricts] = useState([]);

  // Campos del modelo Enterprise
  const [name, setName] = useState("");
  const [ruc, setRuc] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [address, setAddress] = useState("");
  const [pictureUrl, setPictureUrl] = useState("");
  const [description, setDescription] = useState("");
  const [districtId, setDistrictId] = useState("");
  const [userId, setUserId] = useState("");

  // Cargar catálogo de distritos
  useEffect(() => {
    const _cargarCatalogos = async () => {
      try {
        const districtsRes = await axios.get('/api/v1/districts');
        setDistricts(districtsRes.data.data || []);
      } catch (error) {
        console.error('Error al cargar catálogos:', error);
      }
    };
    _cargarCatalogos();
  }, []);

  // Si existe :id, cargar los datos de la empresa para editar
  useEffect(() => {
    const _obtenerEmpresa = async () => {
      if (id !== undefined) {
        try {
          const response = await axios.get('/api/v1/enterprises/' + id);
          const enterprise = response.data.data;

          setName(enterprise.name || "");
          setRuc(enterprise.ruc || "");
          setEmail(enterprise.email || "");
          setPhone(enterprise.phone || "");
          setWebsiteUrl(enterprise.website_url || "");
          setAddress(enterprise.address || "");
          setPictureUrl(enterprise.picture_url || "");
          setDescription(enterprise.description || "");
          setDistrictId(enterprise.district_id || "");
          setUserId(enterprise.user_id || "");
        } catch (error) {
          console.error(error);
          setMessage(
            error.response?.data?.message || "Error al obtener la empresa"
          );
          setStatusMessage(false);
        }
      }
    };
    _obtenerEmpresa();
  }, [id]);

  const _limpiarFormulario = () => {
    setName("");
    setRuc("");
    setEmail("");
    setPhone("");
    setWebsiteUrl("");
    setAddress("");
    setPictureUrl("");
    setDescription("");
    setDistrictId("");
    setUserId("");
  };

  const _guardarEmpresa = async (e) => {
    e.preventDefault();

    const payload = {
      name: name.trim(),
      ruc: ruc.trim(),
      email: email.trim(),
      phone: phone.trim() || null,
      website_url: websiteUrl.trim() || null,
      address: address.trim() || null,
      picture_url: pictureUrl.trim() || null,
      description: description.trim() || null,
      district_id: districtId !== "" ? Number(districtId) : null,
      user_id: userId !== "" ? Number(userId) : null,
    };

    try {
      let response;

      if (id === undefined) {
        response = await axios.post('/api/v1/enterprises', payload);
        if (response.data.success) {
          _limpiarFormulario();
        }
      } else {
        response = await axios.put('/api/v1/enterprises/' + id, payload);
      }

      setMessage(response.data.message);
      setStatusMessage(response.data.success);
    } catch (error) {
      console.error(error);
      setMessage(
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Error al guardar la empresa"
      );
      setStatusMessage(false);
    }
  };

  return (
    <>
      <h1>{id === undefined ? "Nueva Empresa" : "Editar Empresa"}</h1>

      {message !== "" && (
        <div
          className={`alert ${statusMessage ? 'alert-success' : 'alert-danger'}`}
          role="alert"
          id="alertMessage"
        >
          {message}
        </div>
      )}

      <NavLink to="/enterprise/enterprises" className="btn btn-secondary mb-3">
        Retroceder
      </NavLink>

      <form onSubmit={_guardarEmpresa} className="card p-4">
        <div className="row g-3">
          {/* Nombre */}
          <div className="col-md-6">
            <label htmlFor="name" className="form-label">
              Nombre *
            </label>
            <input
              type="text"
              id="name"
              className="form-control"
              placeholder="Ej. Tech Solutions"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={60}
              required
            />
          </div>

          {/* RUC */}
          <div className="col-md-3">
            <label htmlFor="ruc" className="form-label">
              RUC *
            </label>
            <input
              type="text"
              id="ruc"
              className="form-control"
              placeholder="Ej. 20123456781"
              value={ruc}
              onChange={(e) => setRuc(e.target.value)}
              maxLength={11}
              required
            />
          </div>

          {/* Teléfono */}
          <div className="col-md-3">
            <label htmlFor="phone" className="form-label">
              Teléfono
            </label>
            <input
              type="text"
              id="phone"
              className="form-control"
              placeholder="Ej. 014567890"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              maxLength={15}
            />
          </div>

          {/* Correo electrónico */}
          <div className="col-md-6">
            <label htmlFor="email" className="form-label">
              Correo electrónico *
            </label>
            <input
              type="email"
              id="email"
              className="form-control"
              placeholder="Ej. contacto@empresa.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              maxLength={45}
              required
            />
          </div>

          {/* Página web */}
          <div className="col-md-6">
            <label htmlFor="website_url" className="form-label">
              Página web
            </label>
            <input
              type="text"
              id="website_url"
              className="form-control"
              placeholder="https://..."
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
              maxLength={100}
            />
          </div>

          {/* Dirección */}
          <div className="col-md-6">
            <label htmlFor="address" className="form-label">
              Dirección
            </label>
            <input
              type="text"
              id="address"
              className="form-control"
              placeholder="Ej. Av. Primavera 123"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              maxLength={100}
            />
          </div>

          {/* Distrito (llave foránea district_id) */}
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

          {/* ID de Usuario asociado (igual que en EstudianteDetalle) */}
          <div className="col-md-3">
            <label htmlFor="user_id" className="form-label">
              ID de Usuario (user_id)
            </label>
            <input
              type="number"
              id="user_id"
              className="form-control"
              placeholder="Ej. 11"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
            />
          </div>

          {/* URL del logo */}
          <div className="col-12">
            <label htmlFor="picture_url" className="form-label">
              URL del logo
            </label>
            <input
              type="text"
              id="picture_url"
              className="form-control"
              placeholder="https://..."
              value={pictureUrl}
              onChange={(e) => setPictureUrl(e.target.value)}
              maxLength={100}
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
              placeholder="¿A qué se dedica la empresa?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="col-12">
            <button type="submit" className="btn btn-primary">
              Guardar Empresa
            </button>
          </div>
        </div>
      </form>
    </>
  );
}
