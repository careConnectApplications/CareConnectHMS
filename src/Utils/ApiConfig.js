export const nigeriaStateApiUrl = "https://nga-states-lga.onrender.com";
// Test Base URL

export const baseUrl = `${window.location.protocol}//${window.location.hostname}:5000/api/v1`;

  // export const baseUrl = `http://20.164.19.147:5000/api/v1`;

// export const baseUrl = `${window.location.protocol}//${window.location.hostname}/api/v1`;
// export let FacilityName = "TEST HOSPITAL"

const baseChecker = `${window.location.hostname}`;

export let FacilityName = "";

if (baseChecker === "ehealthcareconnect.com") {
  FacilityName = "GENERAL HOSPITAL, KATSINA";
} else if (baseChecker === "ghfta.ehealthcareconnect.com") {
  FacilityName = "GENERAL HOSPITAL, FUNTUA";
} else if (baseChecker === "tymch.ehealthcareconnect.com") {
  FacilityName = "TURAI YAR'ADUA CHILDREN AND MATERNITY SPECIALIST HOSPITAL";
} else if (baseChecker === "ghmlf.ehealthcareconnect.com") {
  FacilityName = "GENERAL HOSPITAL, MALUMFASHI";
} else if (baseChecker === "ghdtm.ehealthcareconnect.com") {
  FacilityName = "GENERAL HOSPITAL, DUTSINMA";
} else if (baseChecker === "ghknk.ehealthcareconnect.com") {
  FacilityName = "GENERAL HOSPITAL, KANKIA";
} else if (baseChecker === "ghman.ehealthcareconnect.com") {
  FacilityName = "GENERAL HOSPITAL, MANI";
} else if (baseChecker === "yerwaphc.ehealthcareconnect.com") {
  FacilityName = "YERWA PRIMARY HEALTHCARE CENTRE, MAIDUGURI";
} else if (baseChecker === "mkachallaphc.ehealthcareconnect.com") {
  FacilityName = "MALA KACHALLA PRIMARY HEALTHCARE CENTRE, MAIDUGURI";
} else if (baseChecker === "20.164.19.147") {
  FacilityName = "TEST HOSPITAL";
} else {
  FacilityName = "GENERAL HOSPITAL, KANKIA";
}

export const token = localStorage.getItem("token");
