import { isActive, isOutPatient,isOutPatientParent,isRecordStaff,isInPatient,
  isScheduleAppointmentStaff,isScheduleProcedureStaff,isLabStaff,isRadiologyStaff,
  isPharmacyStaff,isInventoryStaff,isBillingStaff,isUserManagerStaff,isTheatreStaff,isClinicalReport,isBillingStaffHOD } from "../Authentication/Index";
import { MdOutlineAnalytics } from "react-icons/md";
import { FaUserInjured, FaUsers } from "react-icons/fa";
import { BiSolidReport } from "react-icons/bi";
import { FaUserNurse } from "react-icons/fa";
import { RiSettings3Fill } from "react-icons/ri";
import { MdDashboard } from "react-icons/md";
import { MdOutlinePayments } from "react-icons/md";
import { RiCalendarScheduleFill } from "react-icons/ri";
import { ImLab } from "react-icons/im";
import { MdInventory2 } from "react-icons/md";
import { MdLocalPharmacy } from "react-icons/md";
import { FaRadiation } from "react-icons/fa";
import { MdLocalHospital } from 'react-icons/md';
export const NavList = (location) => {
  const checkActiveLab = () => {
    let result = "";

    if (
      isActive(location, "/dashboard/lab-process/lab-processing") ||
      isActive(location, "/dashboard/lab-process/report")
    ) {
      result = true;
      return result;
    } else {
      result = false;
      return result;
    }
  };

  const checkReport = () => {
    let result = "";

    if (
      isActive(location, "/dashboard/report-analytics/report") ||
      isActive(location, "/dashboard/report-analytics/summary")
    ) {
      result = true;
      return result;
    } else {
      result = false;
      return result;
    }
  };
  const checkActivePatient = () => {
    let result = "";

    if (
      isActive(location, "/dashboard/patient") ||
      isActive(location, "/dashboard/doctor-schedule")
    ) {
      result = true;
      return result;
    } else {
      result = false;
      return result;
    }
  };
  const checkActiveInPatient = () => {
    let result = "";

    if (
      isActive(location, "/dashboard/in-patient") ||
      isActive(location, "/dashboard/nurse-care")
    ) {
      result = true;
      return result;
    } else {
      result = false;
      return result;
    }
  };

  let List = [
    {
      name: "overview",
      icon: <MdDashboard />,
      link: "/dashboard",
      active: isActive(location, "/dashboard"),
      display: true,
    },
    {
      name: "Out Patient",
      icon:  <FaUserNurse />,
      link: "#",
      active: isActive(location, "#"),
      display:  isOutPatientParent(),
      children: [
        {
          name: "Patient Registration",
          icon: <FaUserInjured />,
          link: "/dashboard/patient",
          active: isActive(location, "/dashboard/patient"), 
          display: isScheduleAppointmentStaff(),
        },
        {
          name: "Out Patient",
          icon: <RiCalendarScheduleFill />,
          link: "/dashboard/doctor-schedule",
          active: isActive(location, "/dashboard/doctor-schedule"),
          display: isOutPatient(),
        },
      ],
    },
    {
      name: "In Patient",
      icon: <FaUserInjured />,
      link: "#",
      active: isActive(location, "#"),
      display: isInPatient(),
      children: [
        {
          name: "Nursing Care",
          icon: <FaUserInjured />,
          link: "/dashboard/nurse-care",
          active: isActive(location, "/dashboard/nurse-care"), 
          display: isInPatient(),
        },
        {
          name: "In Patient",
          icon: <RiCalendarScheduleFill />,
          link: "/dashboard/in-patient",
          active: isActive(location, "/dashboard/in-patient"),
          display: isInPatient(),
        },
      ],
    },

   
   
    {
      name: "Schedule Appointment",
      icon: <RiCalendarScheduleFill />,
      link: "/dashboard/schedule-appointment",
      active: isActive(location, "/dashboard/schedule-appointment"),
      display: isScheduleAppointmentStaff(),
    },
    {
      name: "Schedule Procedure",
      icon: <RiCalendarScheduleFill />,
      link: "/dashboard/schedule-procedure",
      active: isActive(location, "/dashboard/schedule-procedure"),
      display: isScheduleProcedureStaff(),
    },

   

    {
      name: "lab Process",
      icon: <ImLab />,
      link: "#",
      active: isActive(location, "#"),
      display: isLabStaff(),
      children: [
        {
          name: "Lab Processing",
          icon: <MdOutlineAnalytics />,
          link: "/dashboard/lab-process/lab-processing",
          active: isActive(location, "/dashboard/lab-process/lab-processing"),
          display: isLabStaff(),
        },

        {
          name: "report",
          icon: <MdOutlineAnalytics />,
          link: "/dashboard/lab-process/report",
          active: isActive(location, "/dashboard/lab-process/report"),
          display: isLabStaff(),
        },
      ],
    },
    {
      name: "radiology",
      icon: <FaRadiation/>,
      link: "/dashboard/radiology",
      active: isActive(location, "/dashboard/radiology"),
      display: isRadiologyStaff(),
    },
    {
      name: "theatre",
      icon: <MdLocalHospital/>,
      link: "/dashboard/single-theatre",
      active: isActive(location, "/dashboard/single-theatre"),
      display: isTheatreStaff(),
    },
    {
      name: "pharmacy",
      icon: <MdLocalPharmacy />,
      link: "#",
      active: isActive(location, "#"),
      display: isPharmacyStaff(),
      children: [
        {
          name: "Pharmacy",
          icon: <MdLocalPharmacy />,
          link: "/dashboard/pharmacy-new",
          active: isActive(location, "/dashboard/pharmacy-new"),
          display: isPharmacyStaff(),
        },
       
      ],
    },
   
    {
      name: "inventory",
      icon: <MdInventory2 />,
      link: "/dashboard/inventory",
      active: isActive(location, "/dashboard/inventory"),
      display: isInventoryStaff(),
    },

    {
      name: "Billing",
      icon: <MdOutlinePayments />,
      link: "#",
      active: isActive(location, "#"),
      display: isBillingStaff(),
      children: [
        {
          name: "Payment",
          icon: <MdOutlinePayments />,
          link: "/dashboard/billing-payment",
          active: isActive(location, "/dashboard/billing-payment"),
          display: isBillingStaff(),
        },

       
        {
          name: "cashier Report",
          link: "/dashboard/billing/cashier-report",
          active: isActive(location, "/dashboard/billing/cashier-report"),
          display: isBillingStaffHOD(),
        },

      ],
    },
    {
      name: "user management",
      icon: <FaUsers />,
      link: "/dashboard/user-management",
      active: isActive(location, "/dashboard/user-management"),
      display: isUserManagerStaff(),
    },
    {
      name: "Report & Analytics",
      icon: <BiSolidReport />,
      link: "#",
      active: isActive(location, "#"),
      display: isClinicalReport(),
      children: [
        {
          name: "report",
          link: "/dashboard/report-analytics/report",
          active: isActive(location, "/dashboard/report-analytics/report"),
          display: isClinicalReport(),
        },

        {
          name: "summary",
          link: "/dashboard/report-analytics/summary",
          active: isActive(location, "/dashboard/report-analytics/summary"),
          display: isClinicalReport(),
        },
      
      ],
    },

    {
      name: "settings",
      icon: <RiSettings3Fill />,
      link: "/dashboard/settings",
      active: isActive(location, "/dashboard/settings"),
      display: isRecordStaff(),
    },
  ];

  return List;
};
