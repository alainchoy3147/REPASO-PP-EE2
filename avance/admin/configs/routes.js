// admin/configs/routes.js
import { Router } from 'express';
import * as admins from '../controllers/admin_controllers.js';
import * as carrers from '../controllers/carrer_controllers.js';
//import * as students from '../controllers/student_controllers.js';
import * as studentApis from '../apis/student_api.js';
import * as turilloApis from '../apis/turillo_api.js';
import * as owners from '../controllers/owner_controllers.js';
import * as enterprises from '../controllers/enterprise_controllers.js';
import * as nationApis from '../apis/nations_apis.js';
import * as carrerApis from '../apis/carrers_apis.js';
import * as profileApis from '../apis/profiles_apis.js';
import * as districtApis from '../apis/districts_apis.js';
import * as semesterApis from '../apis/semesters_apis.js';
import * as applicationApis from '../apis/application_api.js';
import * as experienceApis from '../apis/experience_api.js';
import * as modalityApis from '../apis/modalities_apis.js';
import * as workdayApis from '../apis/workdays_apis.js';
import * as enterpriseApis from '../apis/enterprise_api.js';

import { redirectIfAuthenticated, requireAuth, soloOwner, soloEnterprise, soloLogueado } from '../../configs/middlewares.js'; 

const router = Router();

// react views
router.get('/admin', requireAuth, admins.home);
router.get('/admin/players', requireAuth, admins.home);
router.get('/admin/teams', requireAuth, admins.home);
router.get('/admin/leagues', requireAuth, admins.home);
router.get('/admin/nations', requireAuth, admins.home);
router.get('/admin/catalogs', requireAuth, admins.home);

// api nations
router.get('/api/v1/nations', nationApis.listNations);
router.get('/api/v1/nations/:id', nationApis.getNationById);
router.post('/api/v1/nations', nationApis.createNation);
router.put('/api/v1/nations/:id', nationApis.updateNation);
router.delete('/api/v1/nations/:id', nationApis.deleteNation);

// api carrers
router.get('/api/v1/carrers', carrerApis.listCarrersSimple);
router.post('/api/v1/carrers', carrerApis.createCarrer);
router.delete('/api/v1/carrers/:id', carrerApis.deleteCarrer);
router.get('/api/v1/carrers/:id', carrerApis.getCarrerById);
router.put('/api/v1/carrers/:id', carrerApis.updateCarrer);

// api profiles
router.get('/api/v1/profiles', profileApis.listProfilesSimple);
router.post('/api/v1/profiles', profileApis.createProfile);
router.delete('/api/v1/profiles/:id', profileApis.deleteProfile);
router.get('/api/v1/profiles/:id', profileApis.getProfileById);
router.put('/api/v1/profiles/:id', profileApis.updatedProfile);

// api students (NUEVO)
router.get('/api/v1/students/test', studentApis.test);
router.get('/api/v1/students/simple', studentApis.listStudentsSimple);
router.get('/api/v1/students', studentApis.listStudents);
router.get('/api/v1/students/:id', studentApis.getStudentById);
router.post('/api/v1/students', studentApis.createStudent);
router.put('/api/v1/students/:id', studentApis.updateStudent);
router.delete('/api/v1/students/:id', studentApis.deleteStudent);

// api turillos (NUEVO)
router.get('/api/v1/turillos/test', turilloApis.test);
router.get('/api/v1/turillos/simple', turilloApis.listTurillosSimple);
router.get('/api/v1/turillos', turilloApis.listTurillos);
router.get('/api/v1/turillos/:id', turilloApis.getTurilloById);
router.post('/api/v1/turillos', turilloApis.createTurillo);
router.put('/api/v1/turillos/:id', turilloApis.updateTurillo);
router.delete('/api/v1/turillos/:id', turilloApis.deleteTurillo);

// api districts
router.get('/api/v1/districts', districtApis.listDistrictsSimple);
router.get('/api/v1/districts/paginated', districtApis.listDistricts);
router.get('/api/v1/districts/:id', districtApis.getDistrictById);
router.post('/api/v1/districts', districtApis.createDistrict);
router.put('/api/v1/districts/:id', districtApis.updateDistrict);
router.delete('/api/v1/districts/:id', districtApis.deleteDistrict);

// api semesters
router.get('/api/v1/semesters', semesterApis.listSemestersSimple);
router.get('/api/v1/semesters/paginated', semesterApis.listSemesters);
router.get('/api/v1/semesters/:id', semesterApis.getSemesterById);
router.post('/api/v1/semesters', semesterApis.createSemester);
router.put('/api/v1/semesters/:id', semesterApis.updateSemester);
router.delete('/api/v1/semesters/:id', semesterApis.deleteSemester);

// api applications (NUEVO)
router.get('/api/v1/applications/test', applicationApis.test);
router.get('/api/v1/applications/simple', applicationApis.listApplicationsSimple);
router.get('/api/v1/applications', applicationApis.listApplications);
router.get('/api/v1/applications/:id', applicationApis.getApplicationById);
router.post('/api/v1/applications', applicationApis.createApplication);
router.put('/api/v1/applications/:id', applicationApis.updateApplication);
router.delete('/api/v1/applications/:id', applicationApis.deleteApplication);

// api experiences (NUEVO)
router.get('/api/v1/experiences/test', experienceApis.test);
router.get('/api/v1/experiences/simple', experienceApis.listExperiencesSimple);
router.get('/api/v1/experiences', experienceApis.listExperiences);
router.get('/api/v1/experiences/:id', experienceApis.getExperienceById);
router.post('/api/v1/experiences', experienceApis.createExperience);
router.put('/api/v1/experiences/:id', experienceApis.updateExperience);
router.delete('/api/v1/experiences/:id', experienceApis.deleteExperience);

// api modalities (catálogo para applications)
router.get('/api/v1/modalities', modalityApis.listModalitiesSimple);
router.get('/api/v1/modalities/paginated', modalityApis.listModalities);
router.get('/api/v1/modalities/:id', modalityApis.getModalityById);
router.post('/api/v1/modalities', modalityApis.createModality);
router.put('/api/v1/modalities/:id', modalityApis.updateModality);
router.delete('/api/v1/modalities/:id', modalityApis.deleteModality);

// api workdays (catálogo para applications)
router.get('/api/v1/workdays', workdayApis.listWorkdaysSimple);
router.get('/api/v1/workdays/paginated', workdayApis.listWorkdays);
router.get('/api/v1/workdays/:id', workdayApis.getWorkdayById);
router.post('/api/v1/workdays', workdayApis.createWorkday);
router.put('/api/v1/workdays/:id', workdayApis.updateWorkday);
router.delete('/api/v1/workdays/:id', workdayApis.deleteWorkday);

// api enterprises (NUEVO)
router.get('/api/v1/enterprises/test', enterpriseApis.test);
router.get('/api/v1/enterprises/simple', enterpriseApis.listEnterprisesSimple);
router.get('/api/v1/enterprises', enterpriseApis.listEnterprises);
router.get('/api/v1/enterprises/:id', enterpriseApis.getEnterpriseById);
router.post('/api/v1/enterprises', enterpriseApis.createEnterprise);
router.put('/api/v1/enterprises/:id', enterpriseApis.updateEnterprise);
router.delete('/api/v1/enterprises/:id', enterpriseApis.deleteEnterprise);

// carrers
router.get('/admin/carrers', carrers.home);

// students (NUEVO)
//router.get('/admin/students', requireAuth, students.home);

// owner & enterprise
router.get('/owner', soloLogueado, soloOwner, owners.home);
router.get('/enterprise', enterprises.home);
router.get('/enterprise/carrers', enterprises.home);
router.get('/enterprise/carrers/new', enterprises.home);
router.get('/enterprise/carrers/:id/edit', enterprises.home);
router.get('/enterprise/profiles', enterprises.home);
router.get('/enterprise/profiles/new', enterprises.home);
router.get('/enterprise/profiles/:id/edit', enterprises.home);
router.get('/enterprise/convocatorias', enterprises.home);
router.get('/enterprise/convocatorias/nueva', enterprises.home);
router.get('/enterprise/postulantes', enterprises.home);
router.get('/enterprise/students', enterprises.home);
router.get('/enterprise/students/:id', enterprises.home);
router.get('/enterprise/turillos', enterprises.home);
router.get('/enterprise/turillos/:id', enterprises.home);
router.get('/enterprise/turillos/:id/edit', enterprises.home);
router.get('/enterprise/turillos/new', enterprises.home);
router.get('/enterprise/applications', enterprises.home);
router.get('/enterprise/applications/new', enterprises.home);
router.get('/enterprise/applications/:id/edit', enterprises.home);
router.get('/enterprise/experiences', enterprises.home);
router.get('/enterprise/experiences/new', enterprises.home);
router.get('/enterprise/experiences/:id/edit', enterprises.home);
router.get('/enterprise/enterprises', enterprises.home);
router.get('/enterprise/enterprises/new', enterprises.home);
router.get('/enterprise/enterprises/:id/edit', enterprises.home);
router.get('/enterprise/perfil', enterprises.home);
router.get('/enterprise/resenas', enterprises.home);
router.get('/enterprise/cambiar-contrasena', enterprises.home);

export default router;