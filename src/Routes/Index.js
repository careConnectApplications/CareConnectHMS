import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import SignIn from "../Pages/AuthenticationScreens/SignIn";
import Dashboard from "../Pages/Dashboard";
import UserManagement from "../Pages/UserManagement";
import Report from "../Pages/Report";
import SummaryReport from "../Pages/SummaryReport";
import PrintReportSummary from "../Pages/PrintReportSummary";
import Patients from "../Pages/Patients";
import InPatient from "../Pages/InPatient";
import InPatientTimeline from "../Pages/InPatientTimeline";
import Payment from "../Pages/Payment";
import PaymentGroup from "../Pages/PaymentGroup";
import PrintPaymentReceipt from "../Pages/PrintPaymentReceipt";
import Settings from "../Pages/Settings";
import ProfileSettings from "../Pages/ProfileSettings";
import SinglePatient from "../Pages/SinglePatient";
import ScheduleAppointment from "../Pages/ScheduleAppointment";
import DoctorSchedule from "../Pages/DoctorSchedule";
import ScheduleProcedure from "../Pages/ScheduleProcedure";
import DoctorScheduleDetails from "../Pages/DoctorScheduleDetails";
import LabProcessing from "../Pages/LabProcessing";
import LabReport from "../Pages/LabReport";
import PrintLabReport from "../Pages/PrintLabReport";
import Encounter from "../Pages/Encounter";
import AddClinicalEncounter from "../Pages/AddClinicalEncounter";
import ClinicalEncounterEdit from "../Pages/ClinicalEncounterEdit";
import AddANC from "../Pages/AddANC";
import AddANCv2 from "../Pages/AddANCv2";
import AncFollowUp from "../Pages/AncFollowUp";
import Inventory from "../Pages/Inventory";
import Pharmacy from "../Pages/Pharmacy";
import PharmacyNew from "../Pages/PharmacyNew";
import NurseCare from "../Pages/NurseCare";
import RadiologyPage from "../Pages/RadiologyPage";
import PrivateRoutes from "./PrivateRoute";
import OutPatientRoutes from "./OutPatientRoutes";
import RecordsRoutes from "./RecordsRoutes";
import InPatientRoutes from "./InPatientRoutes";
import LabRoutes from "./LabRoutes";
import RadiologyRoutes from "./RadiologyRoutes";
import ScheduleAppointmentRoutes from "./ScheduleAppointmentRoutes";
import ScheduleProcedureRoutes from "./ScheduleProcedureRoutes";
import PharmacyRoutes from "./PharmacyRoutes";
import InventoryRoutes from "./InventoryRoutes";
import BillingRoutes from "./BillingRoutes";
import HODBillingRoutes from "./HODBillingRoutes";
import UserManagementRoutes from "./UserManagementRoutes";
import ReferTheatreRoutes from "./ReferTheatreRoutes";
import ClinicalReportRoutes from "./ClinicalReportRoutes";
import SingleTheatreReferPage from "../Pages/SingleTheatreReferPage";
import TheatreTimeline from "../Pages/TheatreTimeline";
import AddNewPreAnathetics from "../Pages/AddNewPreAnathetics";
import AddOperationalConsent from "../Pages/AddOperationalConsent";
import EditPreAnathetics from "../Pages/EditPreAnathetics";
import EditOperationConsent from "../Pages/EditOperationConsent";
import CashierReport from "../Pages/CashierReport";
import EditTheatrePrevisitDocumentation from "../Pages/EditTheatrePrevisitDocumentation";
import AddTheatrePrevisitDocumentation from "../Pages/AddTheatrePrevisitDocumentation";
import EditAnaesthesiaForm from "../Pages/EditAnaesthesiaForm";
import AddAnaesthesiaForm from "../Pages/AddAnaesthesiaForm";
import TheatreFoodGiven from "../Pages/TheatreFoodGiven";
import TheatreDrugGiven from "../Pages/TheatreDrugGiven";

export default function IndexRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route element={<PrivateRoutes />}>
          <Route
            path="/dashboard/profile-settings"
            element={<ProfileSettings />}
          />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route element={<RecordsRoutes />}>
            <Route path="/dashboard/settings" element={<Settings />} />
          </Route>
          <Route element={<OutPatientRoutes />}>
            <Route
              path="/dashboard/doctor-schedule"
              element={<DoctorSchedule />}
            />
            <Route
              path="/dashboard/doctor-schedule-details/:id"
              element={<DoctorScheduleDetails />}
            />
            <Route
              path="/dashboard/doctor-encounter/:id"
              element={<Encounter />}
            />
            <Route
              path="/dashboard/add-clinical-encounter/:id"
              element={<AddClinicalEncounter />}
            />
            <Route
              path="/dashboard/edit-clinical-encounter/:id"
              element={<ClinicalEncounterEdit />}
            />
            <Route path="/dashboard/add-new-anc/:id" element={<AddANC />} />
            <Route path="/dashboard/add-anc/:id" element={<AddANCv2 />} />
            <Route
              path="/dashboard/anc-follow-up/:id"
              element={<AncFollowUp />}
            />
          </Route>
          <Route element={<InPatientRoutes />}>
            <Route path="/dashboard/nurse-care" element={<NurseCare />} />
            <Route path="/dashboard/in-patient" element={<InPatient />} />
            <Route
              path="/dashboard/in-patient-timeline/:id"
              element={<InPatientTimeline />}
            />
          </Route>
          <Route element={<LabRoutes />}>
            <Route
              path="/dashboard/lab-process/lab-processing"
              element={<LabProcessing />}
            />
            <Route
              path="/dashboard/lab-process/report"
              element={<LabReport />}
            />
            <Route
              path="/dashboard/lab-process/report/:id"
              element={<PrintLabReport />}
            />
          </Route>

          <Route element={<RadiologyRoutes />}>
            <Route path="/dashboard/radiology" element={<RadiologyPage />} />
          </Route>

          <Route element={<ScheduleAppointmentRoutes />}>
            <Route
              path="/dashboard/schedule-appointment"
              element={<ScheduleAppointment />}
            />
            <Route path="/dashboard/patient" element={<Patients />} />
            <Route path="/dashboard/patient/:id" element={<SinglePatient />} />
          </Route>

          <Route element={<ScheduleProcedureRoutes />}>
            <Route
              path="/dashboard/schedule-procedure"
              element={<ScheduleProcedure />}
            />
          </Route>
          <Route element={<PharmacyRoutes />}>
            <Route path="/dashboard/pharmacy" element={<Pharmacy />} />
            <Route path="/dashboard/pharmacy-new" element={<PharmacyNew />} />
          </Route>

          <Route element={<InventoryRoutes />}>
            <Route path="/dashboard/inventory" element={<Inventory />} />
          </Route>

          <Route element={<BillingRoutes />}>
            <Route path="/dashboard/billing-payment" element={<Payment />} />
            <Route
              path="/dashboard/billing-payment-group"
              element={<PaymentGroup />}
            />
            <Route
              path="/dashboard/billing-payment/receipt/:id"
              element={<PrintPaymentReceipt />}
            />
          </Route>
          <Route element={<HODBillingRoutes />}>
            <Route
              path="/dashboard/billing/cashier-report"
              element={<CashierReport />}
            />
          </Route>

          <Route element={<UserManagementRoutes />}>
            <Route
              path="/dashboard/user-management"
              element={<UserManagement />}
            />
          </Route>
          <Route element={<ClinicalReportRoutes />}>
            <Route
              path="/dashboard/report-analytics/report"
              element={<Report />}
            />
            <Route
              path="/dashboard/report-analytics/summary"
              element={<SummaryReport />}
            />
            <Route
              path="/dashboard/report-analytics/print-summary"
              element={<PrintReportSummary />}
            />
          </Route>
          <Route element={<ReferTheatreRoutes />}>
            <Route
              path="/dashboard/single-theatre"
              element={<SingleTheatreReferPage />}
            />
            <Route
              path="/dashboard/single-theatre/patient-timeline/:id"
              element={<TheatreTimeline />}
            />
            <Route
              path="/dashboard/add-new-preAnathetics/:id"
              element={<AddNewPreAnathetics />}
            />
            <Route
              path="/dashboard/add-new-operational-consent/:id"
              element={<AddOperationalConsent />}
            />
            <Route
              path="/dashboard/add-theatre-previsit-documentation/:id"
              element={<AddTheatrePrevisitDocumentation />}
            />
            <Route
              path="/dashboard/add-theatre-anaesthesia-form/:id"
              element={<AddAnaesthesiaForm />}
            />

            <Route
              path="/dashboard/edit-preAnathetics/:id"
              element={<EditPreAnathetics />}
            />
            <Route
              path="/dashboard/edit-operational-consent/:id"
              element={<EditOperationConsent />}
            />
            <Route
              path="/dashboard/edit-theatre-previsit-documentation/:id"
              element={<EditTheatrePrevisitDocumentation />}
            />
            <Route
              path="/dashboard/edit-theatre-anaesthesia-form/:id"
              element={<EditAnaesthesiaForm />}
            />
            <Route
              path="/dashboard/food-given/:id"
              element={<TheatreFoodGiven />}
            />
                        <Route
              path="/dashboard/drug-given/:id"
              element={<TheatreDrugGiven />}
            />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
