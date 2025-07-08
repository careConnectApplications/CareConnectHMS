import axios from "axios";
import { baseUrl, nigeriaStateApiUrl, token } from "./ApiConfig";

export const ProviderLoginApi = (Payload) => {
  // console.log("CreateAccountPayload", Payload);

  let data = JSON.stringify(Payload);
  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: `${baseUrl}/auth/signin`,
    headers: {
      "Content-Type": "application/json",
    },
    data: data,
  };

  return axios
    .request(config)
    .then((response) => {
      //console.log(JSON.stringify(response.data));
      return response;
    })
    .catch((error) => {
      console.log("error", error.response);
      if (error.response.data.msg) {
        throw new Error(error.response.data.msg);
      } else if (error.response.data) {
        throw new Error(error.response);
      } else if (error.request) {
        throw new Error(error.msg);
      } else {
        throw new Error(error.msg);
      }
    });
};

export const AddUserApi = (userData) => {
  console.log("AddUserApi", userData);

  let data = JSON.stringify(userData);
  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: `${baseUrl}/auth/signup`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    data: data,
  };

  return axios
    .request(config)
    .then((response) => {
      console.log(JSON.stringify(response.data));
      return response;
    })
    .catch((error) => {
      console.log("error", error.response);
      if (error.response.data.msg) {
        throw new Error(error.response.data.msg);
      } else if (error.response.data) {
        throw new Error(error.response);
      } else if (error.request) {
        throw new Error(error.msg);
      } else {
        throw new Error(error.msg);
      }
    });
};
export const UpdateUserApi = (userData, id) => {
  let data = JSON.stringify(userData);
  let config = {
    method: "put",
    maxBodyLength: Infinity,
    url: `${baseUrl}/users/updateusers/${id}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    data: data,
  };

  return axios
    .request(config)
    .then((response) => {
      console.log(JSON.stringify(response.data));
      return response;
    })
    .catch((error) => {
      console.log("error", error.response);
      if (error.response.data.msg) {
        throw new Error(error.response.data.msg);
      } else if (error.response.data) {
        throw new Error(error.response);
      } else if (error.request) {
        throw new Error(error.msg);
      } else {
        throw new Error(error.msg);
      }
    });
};

export const UpdateUserStatusApi = (id) => {
  let config = {
    method: "put",
    maxBodyLength: Infinity,
    url: `${baseUrl}/users/updatestatus/${id}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  return axios
    .request(config)
    .then((response) => {
      console.log(JSON.stringify(response.data));
      return response;
    })
    .catch((error) => {
      console.log("error", error.response);
      if (error.response.data.msg) {
        throw new Error(error.response.data.msg);
      } else if (error.response.data) {
        throw new Error(error.response);
      } else if (error.request) {
        throw new Error(error.msg);
      } else {
        throw new Error(error.msg);
      }
    });
};
export const UpdatePriceStatusApi = (id) => {
  let config = {
    method: "put",
    maxBodyLength: Infinity,
    url: `${baseUrl}/settings/updatepricestatus/${id}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  return axios
    .request(config)
    .then((response) => {
      console.log(JSON.stringify(response.data));
      return response;
    })
    .catch((error) => {
      console.log("error", error.response);
      if (error.response.data.msg) {
        throw new Error(error.response.data.msg);
      } else if (error.response.data) {
        throw new Error(error.response);
      } else if (error.request) {
        throw new Error(error.msg);
      } else {
        throw new Error(error.msg);
      }
    });
};

export const confirmPaymentAPI = (id) => {
  let config = {
    method: "put",
    maxBodyLength: Infinity,
    url: `${baseUrl}/billing/confirmpayment/${id}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  return axios
    .request(config)
    .then((response) => {
      console.log(JSON.stringify(response.data));
      return response;
    })
    .catch((error) => {
      console.log("error", error.response);
      if (error.response.data.msg) {
        throw new Error(error.response.data.msg);
      } else if (error.response.data) {
        throw new Error(error.response);
      } else if (error.request) {
        throw new Error(error.msg);
      } else {
        throw new Error(error.msg);
      }
    });
};
export const confirmAllPaymentAPI = (id) => {
  let config = {
    method: "put",
    maxBodyLength: Infinity,
    url: `${baseUrl}/billing/confirmgrouppayment/${id}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  return axios
    .request(config)
    .then((response) => {
      console.log(JSON.stringify(response.data));
      return response;
    })
    .catch((error) => {
      console.log("error", error.response);
      if (error.response.data.msg) {
        throw new Error(error.response.data.msg);
      } else if (error.response.data) {
        throw new Error(error.response);
      } else if (error.request) {
        throw new Error(error.msg);
      } else {
        throw new Error(error.msg);
      }
    });
};

export const GetAllUsersApi = () => {
  // Configure the GET request
  let config = {
    method: "get",
    url: `${baseUrl}/users/getallusers`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  return axios
    .request(config)
    .then((response) => {
      return response.data; // Return the data part of the response
    })
    .catch((error) => {
      console.log("Error fetching users:", error.response);
      if (error.response && error.response.data.msg) {
        throw new Error(error.response.data.msg);
      } else if (error.response && error.response.data) {
        throw new Error(error.response);
      } else if (error.request) {
        throw new Error(error.msg);
      } else {
        throw new Error(error.msg);
      }
    });
};
export const GetReportSettingsApi = () => {
  // Configure the GET request
  let config = {
    method: "get",
    url: `${baseUrl}/reports/settings`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  return axios
    .request(config)
    .then((response) => {
      return response.data; // Return the data part of the response
    })
    .catch((error) => {
      console.log("Error fetching users:", error.response);
      if (error.response && error.response.data.msg) {
        throw new Error(error.response.data.msg);
      } else if (error.response && error.response.data) {
        throw new Error(error.response);
      } else if (error.request) {
        throw new Error(error.msg);
      } else {
        throw new Error(error.msg);
      }
    });
};
export const GetReportSummarySettingsApi = () => {
  // Configure the GET request
  let config = {
    method: "get",
    url: `${baseUrl}/reports/settingsummaryresponse`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  return axios
    .request(config)
    .then((response) => {
      return response.data; // Return the data part of the response
    })
    .catch((error) => {
      console.log("Error fetching users:", error.response);
      if (error.response && error.response.data.msg) {
        throw new Error(error.response.data.msg);
      } else if (error.response && error.response.data) {
        throw new Error(error.response);
      } else if (error.request) {
        throw new Error(error.msg);
      } else {
        throw new Error(error.msg);
      }
    });
};
export const GetDiagnosisICApi = (payload) => {
  console.log("paylaodAPIIIII", payload);

  let data = JSON.stringify(payload);
  // Configure the GET request
  let config = {
    method: "POST",
    url: `${baseUrl}/readicdten`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    data: data,
  };

  return axios
    .request(config)
    .then((response) => {
      return response.data; // Return the data part of the response
    })
    .catch((error) => {
      console.log("Error fetching users:", error.response);
      if (error.response && error.response.data.msg) {
        throw new Error(error.response.data.msg);
      } else if (error.response && error.response.data) {
        throw new Error(error.response);
      } else if (error.request) {
        throw new Error(error.msg);
      } else {
        throw new Error(error.msg);
      }
    });
};
export const GetFullReportApi = (type, group, start, end) => {
  // Configure the GET request
  let config = {
    method: "get",
    url: `${baseUrl}/reports/reports/${type}/${group}/${start}/${end}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  return axios
    .request(config)
    .then((response) => {
      return response.data; // Return the data part of the response
    })
    .catch((error) => {
      console.log("Error fetching users:", error.response);
      if (error.response && error.response.data.msg) {
        throw new Error(error.response.data.msg);
      } else if (error.response && error.response.data) {
        throw new Error(error.response);
      } else if (error.request) {
        throw new Error(error.msg);
      } else {
        throw new Error(error.msg);
      }
    });
};
export const GetFullReportSummaryApi = (type, start, end) => {
  // Configure the GET request
  let config = {
    method: "get",
    url: `${baseUrl}/reports/reportsummary/${type}/${start}/${end}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  return axios
    .request(config)
    .then((response) => {
      return response.data; // Return the data part of the response
    })
    .catch((error) => {
      console.log("Error fetching users:", error.response);
      if (error.response && error.response.data.msg) {
        throw new Error(error.response.data.msg);
      } else if (error.response && error.response.data) {
        throw new Error(error.response);
      } else if (error.request) {
        throw new Error(error.msg);
      } else {
        throw new Error(error.msg);
      }
    });
};
export const GetAllPatientsHistoryApi = (
  clinic,
  postPerPage,
  pageNo,
  Status
) => {
  // Configure the GET request
  let config = {
    method: "get",
    url: `${baseUrl}/appointment/getallmedicalhistoryoptimized/${clinic}?page=${pageNo}&size=${postPerPage}&status=${Status}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  return axios
    .request(config)
    .then((response) => {
      return response.data; // Return the data part of the response
    })
    .catch((error) => {
      console.log("Error fetching users:", error.response);
      if (error.response && error.response.data.msg) {
        throw new Error(error.response.data.msg);
      } else if (error.response && error.response.data) {
        throw new Error(error.response);
      } else if (error.request) {
        throw new Error(error.msg);
      } else {
        throw new Error(error.msg);
      }
    });
};
export const GetAllPatientsHistoryFilteredApi = (
  clinic,
  postPerPage,
  pageNo,
  Status,
  key,
  value
) => {
  // Configure the GET request
  let config = {
    method: "get",
    url: `${baseUrl}/appointment/getallmedicalhistoryoptimized/${clinic}?page=${pageNo}&size=${postPerPage}&status=${Status}&${key}=${value}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  return axios
    .request(config)
    .then((response) => {
      return response.data; // Return the data part of the response
    })
    .catch((error) => {
      console.log("Error fetching users:", error.response);
      if (error.response && error.response.data.msg) {
        throw new Error(error.response.data.msg);
      } else if (error.response && error.response.data) {
        throw new Error(error.response);
      } else if (error.request) {
        throw new Error(error.msg);
      } else {
        throw new Error(error.msg);
      }
    });
};
export const GetAllScheduledLabApi = (postPerPage, pageNo, status) => {
  // Configure the GET request
  let config = {
    method: "get",
    url: `${baseUrl}/lab/readallscheduledlaboptimized?status=${status}&page=${pageNo}&size=${postPerPage}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  return axios
    .request(config)
    .then((response) => {
      return response.data; // Return the data part of the response
    })
    .catch((error) => {
      console.log("Error fetching users:", error.response);
      if (error.response && error.response.data.msg) {
        throw new Error(error.response.data.msg);
      } else if (error.response && error.response.data) {
        throw new Error(error.response);
      } else if (error.request) {
        throw new Error(error.msg);
      } else {
        throw new Error(error.msg);
      }
    });
};

export const GetAllScheduledLabFilteredApi = (
  postPerPage,
  pageNo,
  status,
  key,
  value
) => {
  // Configure the GET request
  let config = {
    method: "get",
    url: `${baseUrl}/lab/readallscheduledlaboptimized?status=${status}&page=${pageNo}&size=${postPerPage}&${key}=${value}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  return axios
    .request(config)
    .then((response) => {
      return response.data; // Return the data part of the response
    })
    .catch((error) => {
      console.log("Error fetching users:", error.response);
      if (error.response && error.response.data.msg) {
        throw new Error(error.response.data.msg);
      } else if (error.response && error.response.data) {
        throw new Error(error.response);
      } else if (error.request) {
        throw new Error(error.msg);
      } else {
        throw new Error(error.msg);
      }
    });
};
export const GetAllLabReportApi = () => {
  // Configure the GET request
  let config = {
    method: "get",
    url: `${baseUrl}/lab/listlabreport`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  return axios
    .request(config)
    .then((response) => {
      return response.data; // Return the data part of the response
    })
    .catch((error) => {
      console.log("Error fetching users:", error.response);
      if (error.response && error.response.data.msg) {
        throw new Error(error.response.data.msg);
      } else if (error.response && error.response.data) {
        throw new Error(error.response);
      } else if (error.request) {
        throw new Error(error.msg);
      } else {
        throw new Error(error.msg);
      }
    });
};
export const GetAllPatientLabReportApi = (id) => {
  // Configure the GET request
  let config = {
    method: "get",
    url: `${baseUrl}/lab/listlabreportbypatient/${id}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  return axios
    .request(config)
    .then((response) => {
      return response.data; // Return the data part of the response
    })
    .catch((error) => {
      console.log("Error fetching users:", error.response);
      if (error.response && error.response.data.msg) {
        throw new Error(error.response.data.msg);
      } else if (error.response && error.response.data) {
        throw new Error(error.response);
      } else if (error.request) {
        throw new Error(error.msg);
      } else {
        throw new Error(error.msg);
      }
    });
};
export const GetAllPatientPharmacyApi = (id) => {
  // Configure the GET request
  let config = {
    method: "get",
    url: `${baseUrl}/pharmacy/readallpharmacytransactionbypartient/${id}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  return axios
    .request(config)
    .then((response) => {
      return response.data; // Return the data part of the response
    })
    .catch((error) => {
      console.log("Error fetching users:", error.response);
      if (error.response && error.response.data.msg) {
        throw new Error(error.response.data.msg);
      } else if (error.response && error.response.data) {
        throw new Error(error.response);
      } else if (error.request) {
        throw new Error(error.msg);
      } else {
        throw new Error(error.msg);
      }
    });
};
export const GetAllAdmissionHistoryApi = (id) => {
  // Configure the GET request
  let config = {
    method: "get",
    url: `${baseUrl}/admission/getalladmissionbypatient/${id}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  return axios
    .request(config)
    .then((response) => {
      return response.data; // Return the data part of the response
    })
    .catch((error) => {
      console.log("Error fetching users:", error.response);
      if (error.response && error.response.data.msg) {
        throw new Error(error.response.data.msg);
      } else if (error.response && error.response.data) {
        throw new Error(error.response);
      } else if (error.request) {
        throw new Error(error.msg);
      } else {
        throw new Error(error.msg);
      }
    });
};
export const GetAllProcedureHistoryApi = (id) => {
  // Configure the GET request
  let config = {
    method: "get",
    url: `${baseUrl}/procedure/readallprocedurebypatient/${id}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  return axios
    .request(config)
    .then((response) => {
      return response.data; // Return the data part of the response
    })
    .catch((error) => {
      console.log("Error fetching users:", error.response);
      if (error.response && error.response.data.msg) {
        throw new Error(error.response.data.msg);
      } else if (error.response && error.response.data) {
        throw new Error(error.response);
      } else if (error.request) {
        throw new Error(error.msg);
      } else {
        throw new Error(error.msg);
      }
    });
};
export const GetAllProcedureByClinicApi = (clinic) => {
  // Configure the GET request
  let config = {
    method: "get",
    url: `${baseUrl}/procedure/readallprocedurebyclinic/${clinic}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  return axios
    .request(config)
    .then((response) => {
      return response.data; // Return the data part of the response
    })
    .catch((error) => {
      console.log("Error fetching users:", error.response);
      if (error.response && error.response.data.msg) {
        throw new Error(error.response.data.msg);
      } else if (error.response && error.response.data) {
        throw new Error(error.response);
      } else if (error.request) {
        throw new Error(error.msg);
      } else {
        throw new Error(error.msg);
      }
    });
};
export const GetAllImmunizationHistoryApi = (id) => {
  // Configure the GET request
  let config = {
    method: "get",
    url: `${baseUrl}/immunization/readallimmunizationbypatient/${id}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  return axios
    .request(config)
    .then((response) => {
      return response.data; // Return the data part of the response
    })
    .catch((error) => {
      console.log("Error fetching users:", error.response);
      if (error.response && error.response.data.msg) {
        throw new Error(error.response.data.msg);
      } else if (error.response && error.response.data) {
        throw new Error(error.response);
      } else if (error.request) {
        throw new Error(error.msg);
      } else {
        throw new Error(error.msg);
      }
    });
};
export const GetAllPartographHistoryApi = (id) => {
  // Configure the GET request
  let config = {
    method: "get",
    url: `${baseUrl}/pathogragh/readallpathographbypatient/${id}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  return axios
    .request(config)
    .then((response) => {
      return response.data; // Return the data part of the response
    })
    .catch((error) => {
      console.log("Error fetching users:", error.response);
      if (error.response && error.response.data.msg) {
        throw new Error(error.response.data.msg);
      } else if (error.response && error.response.data) {
        throw new Error(error.response);
      } else if (error.request) {
        throw new Error(error.msg);
      } else {
        throw new Error(error.msg);
      }
    });
};
export const GetAllFamilyPlanningApi = (id) => {
  // Configure the GET request
  let config = {
    method: "get",
    url: `${baseUrl}/familyplanning/readallfamilyplanningbypatient/${id}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  return axios
    .request(config)
    .then((response) => {
      return response.data; // Return the data part of the response
    })
    .catch((error) => {
      console.log("Error fetching users:", error.response);
      if (error.response && error.response.data.msg) {
        throw new Error(error.response.data.msg);
      } else if (error.response && error.response.data) {
        throw new Error(error.response);
      } else if (error.request) {
        throw new Error(error.msg);
      } else {
        throw new Error(error.msg);
      }
    });
};
export const GetAllAncFollowUpApi = (id) => {
  // Configure the GET request
  let config = {
    method: "get",
    url: `${baseUrl}/anc/readallancfollowupbyanc/${id}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  return axios
    .request(config)
    .then((response) => {
      return response.data; // Return the data part of the response
    })
    .catch((error) => {
      console.log("Error fetching users:", error.response);
      if (error.response && error.response.data.msg) {
        throw new Error(error.response.data.msg);
      } else if (error.response && error.response.data) {
        throw new Error(error.response);
      } else if (error.request) {
        throw new Error(error.msg);
      } else {
        throw new Error(error.msg);
      }
    });
};
export const GetAllAncFollowUpApiv3 = (id) => {
  // Configure the GET request
  let config = {
    method: "get",
    url: `${baseUrl}/anc/readallancfollowupbyancv3/${id}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  return axios
    .request(config)
    .then((response) => {
      return response.data; // Return the data part of the response
    })
    .catch((error) => {
      console.log("Error fetching users:", error.response);
      if (error.response && error.response.data.msg) {
        throw new Error(error.response.data.msg);
      } else if (error.response && error.response.data) {
        throw new Error(error.response);
      } else if (error.request) {
        throw new Error(error.msg);
      } else {
        throw new Error(error.msg);
      }
    });
};
export const GetAllReferralApi = (id) => {
  // Configure the GET request
  let config = {
    method: "get",
    url: `${baseUrl}/referrer/readallreferrerbypatient/${id}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  return axios
    .request(config)
    .then((response) => {
      return response.data; // Return the data part of the response
    })
    .catch((error) => {
      console.log("Error fetching users:", error.response);
      if (error.response && error.response.data.msg) {
        throw new Error(error.response.data.msg);
      } else if (error.response && error.response.data) {
        throw new Error(error.response);
      } else if (error.request) {
        throw new Error(error.msg);
      } else {
        throw new Error(error.msg);
      }
    });
};
export const GetAllDeliveryNoteApi = (id) => {
  // Configure the GET request
  let config = {
    method: "get",
    url: `${baseUrl}/deliverynote/readalldeliverynotepatient/${id}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  return axios
    .request(config)
    .then((response) => {
      return response.data; // Return the data part of the response
    })
    .catch((error) => {
      console.log("Error fetching users:", error.response);
      if (error.response && error.response.data.msg) {
        throw new Error(error.response.data.msg);
      } else if (error.response && error.response.data) {
        throw new Error(error.response);
      } else if (error.request) {
        throw new Error(error.msg);
      } else {
        throw new Error(error.msg);
      }
    });
};

export const GetReportApi = (id) => {
  // Configure the GET request
  let config = {
    method: "get",
    url: `${baseUrl}/lab/printlabreport/${id}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  return axios
    .request(config)
    .then((response) => {
      return response.data; // Return the data part of the response
    })
    .catch((error) => {
      console.log("Error fetching users:", error.response);
      if (error.response && error.response.data.msg) {
        throw new Error(error.response.data.msg);
      } else if (error.response && error.response.data) {
        throw new Error(error.response);
      } else if (error.request) {
        throw new Error(error.msg);
      } else {
        throw new Error(error.msg);
      }
    });
};
export const GetPaymentReceiptApi = (id) => {
  // Configure the GET request
  let config = {
    method: "get",
    url: `${baseUrl}/billing/printreceipt/${id}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  return axios
    .request(config)
    .then((response) => {
      return response.data; // Return the data part of the response
    })
    .catch((error) => {
      console.log("Error fetching users:", error.response);
      if (error.response && error.response.data.msg) {
        throw new Error(error.response.data.msg);
      } else if (error.response && error.response.data) {
        throw new Error(error.response);
      } else if (error.request) {
        throw new Error(error.msg);
      } else {
        throw new Error(error.msg);
      }
    });
};
export const GetAllTodayQueueHistoryApi = (clinic) => {
  // Configure the GET request
  let config = {
    method: "get",
    url: `${baseUrl}/appointment/queue/${clinic}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  return axios
    .request(config)
    .then((response) => {
      return response.data; // Return the data part of the response
    })
    .catch((error) => {
      console.log("Error fetching users:", error.response);
      if (error.response && error.response.data.msg) {
        throw new Error(error.response.data.msg);
      } else if (error.response && error.response.data) {
        throw new Error(error.response);
      } else if (error.request) {
        throw new Error(error.msg);
      } else {
        throw new Error(error.msg);
      }
    });
};
export const GetAllVitalsApi = (id) => {
  // Configure the GET request
  let config = {
    method: "get",
    url: `${baseUrl}/appointment/readallvitalchartByAppointment/${id}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  return axios
    .request(config)
    .then((response) => {
      return response.data; // Return the data part of the response
    })
    .catch((error) => {
      console.log("Error fetching users:", error.response);
      if (error.response && error.response.data.msg) {
        throw new Error(error.response.data.msg);
      } else if (error.response && error.response.data) {
        throw new Error(error.response);
      } else if (error.request) {
        throw new Error(error.msg);
      } else {
        throw new Error(error.msg);
      }
    });
};
export const GetSinglePatientHistoryApi = (id) => {
  // Configure the GET request
  let config = {
    method: "get",
    url: `${baseUrl}/appointment/singlepatientmedicalhistory/${id}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  return axios
    .request(config)
    .then((response) => {
      return response.data; // Return the data part of the response
    })
    .catch((error) => {
      console.log("Error fetching users:", error.response);
      if (error.response && error.response.data.msg) {
        throw new Error(error.response.data.msg);
      } else if (error.response && error.response.data) {
        throw new Error(error.response);
      } else if (error.request) {
        throw new Error(error.msg);
      } else {
        throw new Error(error.msg);
      }
    });
};
export const GetPreviousANCApi = (id) => {
  // Configure the GET request
  let config = {
    method: "get",
    url: `${baseUrl}/anc/readallancbypatient/${id}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  return axios
    .request(config)
    .then((response) => {
      return response.data; // Return the data part of the response
    })
    .catch((error) => {
      console.log("Error fetching users:", error.response);
      if (error.response && error.response.data.msg) {
        throw new Error(error.response.data.msg);
      } else if (error.response && error.response.data) {
        throw new Error(error.response);
      } else if (error.request) {
        throw new Error(error.msg);
      } else {
        throw new Error(error.msg);
      }
    });
};
export const GetPreviousANCV2Api = (id) => {
  // Configure the GET request
  let config = {
    method: "get",
    url: `${baseUrl}/anc/readallancbypatientv2/${id}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  return axios
    .request(config)
    .then((response) => {
      return response.data; // Return the data part of the response
    })
    .catch((error) => {
      console.log("Error fetching users:", error.response);
      if (error.response && error.response.data.msg) {
        throw new Error(error.response.data.msg);
      } else if (error.response && error.response.data) {
        throw new Error(error.response);
      } else if (error.request) {
        throw new Error(error.msg);
      } else {
        throw new Error(error.msg);
      }
    });
};
export const GetPreviousANCV3Api = (id) => {
  // Configure the GET request
  let config = {
    method: "get",
    url: `${baseUrl}/anc/readallancbypatientv3/${id}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  return axios
    .request(config)
    .then((response) => {
      return response.data; // Return the data part of the response
    })
    .catch((error) => {
      console.log("Error fetching users:", error.response);
      if (error.response && error.response.data.msg) {
        throw new Error(error.response.data.msg);
      } else if (error.response && error.response.data) {
        throw new Error(error.response);
      } else if (error.request) {
        throw new Error(error.msg);
      } else {
        throw new Error(error.msg);
      }
    });
};
export const GetPreviousClinicalEncounterApi = (id) => {
  // Configure the GET request
  let config = {
    method: "get",
    url: `${baseUrl}/appointment/getallpreviousclinicalencounter/${id}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  return axios
    .request(config)
    .then((response) => {
      return response.data; // Return the data part of the response
    })
    .catch((error) => {
      console.log("Error fetching users:", error.response);
      if (error.response && error.response.data.msg) {
        throw new Error(error.response.data.msg);
      } else if (error.response && error.response.data) {
        throw new Error(error.response);
      } else if (error.request) {
        throw new Error(error.msg);
      } else {
        throw new Error(error.msg);
      }
    });
};
export const GetPreviousEncounterApi = (id) => {
  // Configure the GET request
  let config = {
    method: "get",
    url: `${baseUrl}/appointment/getallpreviousencounter/${id}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  return axios
    .request(config)
    .then((response) => {
      return response.data; // Return the data part of the response
    })
    .catch((error) => {
      console.log("Error fetching users:", error.response);
      if (error.response && error.response.data.msg) {
        throw new Error(error.response.data.msg);
      } else if (error.response && error.response.data) {
        throw new Error(error.response);
      } else if (error.request) {
        throw new Error(error.msg);
      } else {
        throw new Error(error.msg);
      }
    });
};
export const GetPreviousPreAnatheticsApi = (id) => {
  // Configure the GET request
  let config = {
    method: "get",
    url: `${baseUrl}/theatreadmission/readpreanatheticsformbytheatreadmission/${id}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  return axios
    .request(config)
    .then((response) => {
      return response.data; // Return the data part of the response
    })
    .catch((error) => {
      console.log("Error fetching users:", error.response);
      if (error.response && error.response.data.msg) {
        throw new Error(error.response.data.msg);
      } else if (error.response && error.response.data) {
        throw new Error(error.response);
      } else if (error.request) {
        throw new Error(error.msg);
      } else {
        throw new Error(error.msg);
      }
    });
};
export const GetPreviousOperationalConsentApi = (id) => {
  // Configure the GET request
  let config = {
    method: "get",
    url: `${baseUrl}/theatreadmission/readconscentformbytheatreadmission/${id}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  return axios
    .request(config)
    .then((response) => {
      return response.data; // Return the data part of the response
    })
    .catch((error) => {
      console.log("Error fetching users:", error.response);
      if (error.response && error.response.data.msg) {
        throw new Error(error.response.data.msg);
      } else if (error.response && error.response.data) {
        throw new Error(error.response);
      } else if (error.request) {
        throw new Error(error.msg);
      } else {
        throw new Error(error.msg);
      }
    });
};
export const GetAllPaymentApi = () => {
  // Configure the GET request
  let config = {
    method: "get",
    url: `${baseUrl}/billing/getallpatientbillinghistory`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  return axios
    .request(config)
    .then((response) => {
      return response.data; // Return the data part of the response
    })
    .catch((error) => {
      console.log("Error fetching users:", error.response);
      if (error.response && error.response.data.msg) {
        throw new Error(error.response.data.msg);
      } else if (error.response && error.response.data) {
        throw new Error(error.response);
      } else if (error.request) {
        throw new Error(error.msg);
      } else {
        throw new Error(error.msg);
      }
    });
};
export const GetAllPaymentGroupApi = () => {
  // Configure the GET request
  let config = {
    method: "get",
    url: `${baseUrl}/billing/groupreadallpayment`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  return axios
    .request(config)
    .then((response) => {
      return response.data; // Return the data part of the response
    })
    .catch((error) => {
      console.log("Error fetching users:", error.response);
      if (error.response && error.response.data.msg) {
        throw new Error(error.response.data.msg);
      } else if (error.response && error.response.data) {
        throw new Error(error.response);
      } else if (error.request) {
        throw new Error(error.msg);
      } else {
        throw new Error(error.msg);
      }
    });
};
export const GetAllPaidPaymentGroupApi = () => {
  // Configure the GET request
  let config = {
    method: "get",
    url: `${baseUrl}/billing/groupreadallpayment/paid`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  return axios
    .request(config)
    .then((response) => {
      return response.data; // Return the data part of the response
    })
    .catch((error) => {
      console.log("Error fetching users:", error.response);
      if (error.response && error.response.data.msg) {
        throw new Error(error.response.data.msg);
      } else if (error.response && error.response.data) {
        throw new Error(error.response);
      } else if (error.request) {
        throw new Error(error.msg);
      } else {
        throw new Error(error.msg);
      }
    });
};
export const GetAllPaymentDetailApi = (id) => {
  // Configure the GET request
  let config = {
    method: "get",
    url: `${baseUrl}/billing/readpaymentbyreferencenumber/${id}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  return axios
    .request(config)
    .then((response) => {
      return response.data; // Return the data part of the response
    })
    .catch((error) => {
      console.log("Error fetching users:", error.response);
      if (error.response && error.response.data.msg) {
        throw new Error(error.response.data.msg);
      } else if (error.response && error.response.data) {
        throw new Error(error.response);
      } else if (error.request) {
        throw new Error(error.msg);
      } else {
        throw new Error(error.msg);
      }
    });
};
export const GetAllPriceApi = () => {
  // Configure the GET request
  let config = {
    method: "get",
    url: `${baseUrl}/settings/getallprices`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  return axios
    .request(config)
    .then((response) => {
      return response.data; // Return the data part of the response
    })
    .catch((error) => {
      console.log("Error fetching users:", error.response);
      if (error.response && error.response.data.msg) {
        throw new Error(error.response.data.msg);
      } else if (error.response && error.response.data) {
        throw new Error(error.response);
      } else if (error.request) {
        throw new Error(error.msg);
      } else {
        throw new Error(error.msg);
      }
    });
};
export const GetAllClinicApi = () => {
  // Configure the GET request
  let config = {
    method: "get",
    url: `${baseUrl}/settings/getallclinic`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  return axios
    .request(config)
    .then((response) => {
      return response.data; // Return the data part of the response
    })
    .catch((error) => {
      console.log("Error fetching users:", error.response);
      if (error.response && error.response.data.msg) {
        throw new Error(error.response.data.msg);
      } else if (error.response && error.response.data) {
        throw new Error(error.response);
      } else if (error.request) {
        throw new Error(error.msg);
      } else {
        throw new Error(error.msg);
      }
    });
};
export const GetOnlyClinicApi = () => {
  // Configure the GET request
  let config = {
    method: "get",
    url: `${baseUrl}/settings/getonlyclinic`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  return axios
    .request(config)
    .then((response) => {
      return response.data; // Return the data part of the response
    })
    .catch((error) => {
      console.log("Error fetching users:", error.response);
      if (error.response && error.response.data.msg) {
        throw new Error(error.response.data.msg);
      } else if (error.response && error.response.data) {
        throw new Error(error.response);
      } else if (error.request) {
        throw new Error(error.msg);
      } else {
        throw new Error(error.msg);
      }
    });
};
export const GetAllServiceApi = () => {
  // Configure the GET request
  let config = {
    method: "get",
    url: `${baseUrl}/settings/getallservicetypes`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  return axios
    .request(config)
    .then((response) => {
      return response.data; // Return the data part of the response
    })
    .catch((error) => {
      console.log("Error fetching users:", error.response);
      if (error.response && error.response.data.msg) {
        throw new Error(error.response.data.msg);
      } else if (error.response && error.response.data) {
        throw new Error(error.response);
      } else if (error.request) {
        throw new Error(error.msg);
      } else {
        throw new Error(error.msg);
      }
    });
};
export const GetAllWardApi = () => {
  // Configure the GET request
  let config = {
    method: "get",
    url: `${baseUrl}/settings/getallward`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  return axios
    .request(config)
    .then((response) => {
      return response.data; // Return the data part of the response
    })
    .catch((error) => {
      console.log("Error fetching users:", error.response);
      if (error.response && error.response.data.msg) {
        throw new Error(error.response.data.msg);
      } else if (error.response && error.response.data) {
        throw new Error(error.response);
      } else if (error.request) {
        throw new Error(error.msg);
      } else {
        throw new Error(error.msg);
      }
    });
};
export const GetAllSingleLabHistoryApi = (id) => {
  // Configure the GET request
  let config = {
    method: "get",
    url: `${baseUrl}/lab/readlabbypatientid/${id}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  return axios
    .request(config)
    .then((response) => {
      return response.data; // Return the data part of the response
    })
    .catch((error) => {
      console.log("Error fetching users:", error.response);
      if (error.response && error.response.data.msg) {
        throw new Error(error.response.data.msg);
      } else if (error.response && error.response.data) {
        throw new Error(error.response);
      } else if (error.request) {
        throw new Error(error.msg);
      } else {
        throw new Error(error.msg);
      }
    });
};

export const AddPatientApi = (patientData) => {
  console.log("patientDataAPI", patientData);
  let data = JSON.stringify(patientData);
  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: `${baseUrl}/patientsmanagement/createpatients`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    data: data,
  };

  return axios
    .request(config)
    .then((response) => {
      console.log("patientResponse", response);
      return response;
    })
    .catch((error) => {
      console.log("error", error.response);
      if (error.response.data.msg) {
        throw new Error(error.response.data.msg);
      } else if (error.response.data) {
        throw new Error(error.response);
      } else if (error.request) {
        throw new Error(error.msg);
      } else {
        throw new Error(error.msg);
      }
    });
};
export const AdmitPatientApi = (payload, id) => {
  console.log("AdmitPatientApi", payload);
  let data = JSON.stringify(payload);
  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: `${baseUrl}/admission/referadmission/${id}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    data: data,
  };

  return axios
    .request(config)
    .then((response) => {
      console.log("patientResponse", response);
      return response;
    })
    .catch((error) => {
      console.log("error", error.response);
      if (error.response.data.msg) {
        throw new Error(error.response.data.msg);
      } else if (error.response.data) {
        throw new Error(error.response);
      } else if (error.request) {
        throw new Error(error.msg);
      } else {
        throw new Error(error.msg);
      }
    });
};
export const UpdatePriceSettingAPI = (payload, id) => {
  let data = JSON.stringify(payload);
  let config = {
    method: "PUT",
    maxBodyLength: Infinity,
    url: `${baseUrl}/settings/updateprices/${id}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    data: data,
  };

  return axios
    .request(config)
    .then((response) => {
      console.log(JSON.stringify(response.data));
      return response;
    })
    .catch((error) => {
      console.log("error", error.response);
      if (error.response.data.msg) {
        throw new Error(error.response.data.msg);
      } else if (error.response.data) {
        throw new Error(error.response);
      } else if (error.request) {
        throw new Error(error.msg);
      } else {
        throw new Error(error.msg);
      }
    });
};
export const UpdateClinicSettingAPI = (payload, id) => {
  let data = JSON.stringify(payload);
  let config = {
    method: "PUT",
    maxBodyLength: Infinity,
    url: `${baseUrl}/settings/updateclinics/${id}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    data: data,
  };

  return axios
    .request(config)
    .then((response) => {
      console.log(JSON.stringify(response.data));
      return response;
    })
    .catch((error) => {
      console.log("error", error.response);
      if (error.response.data.msg) {
        throw new Error(error.response.data.msg);
      } else if (error.response.data) {
        throw new Error(error.response);
      } else if (error.request) {
        throw new Error(error.msg);
      } else {
        throw new Error(error.msg);
      }
    });
};

export const UpdateServiceTypeSettingAPI = (payload, id) => {
  let data = JSON.stringify(payload);
  let config = {
    method: "PUT",
    maxBodyLength: Infinity,
    url: `${baseUrl}/settings/updateservicetypes/${id}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    data: data,
  };

  return axios
    .request(config)
    .then((response) => {
      console.log(JSON.stringify(response.data));
      return response;
    })
    .catch((error) => {
      console.log("error", error.response);
      if (error.response.data.msg) {
        throw new Error(error.response.data.msg);
      } else if (error.response.data) {
        throw new Error(error.response);
      } else if (error.request) {
        throw new Error(error.msg);
      } else {
        throw new Error(error.msg);
      }
    });
};
export const UpdateWardAPI = (payload, id) => {
  let data = JSON.stringify(payload);
  let config = {
    method: "PUT",
    maxBodyLength: Infinity,
    url: `${baseUrl}/settings/updateward/${id}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    data: data,
  };

  return axios
    .request(config)
    .then((response) => {
      console.log(JSON.stringify(response.data));
      return response;
    })
    .catch((error) => {
      console.log("error", error.response);
      if (error.response.data.msg) {
        throw new Error(error.response.data.msg);
      } else if (error.response.data) {
        throw new Error(error.response);
      } else if (error.request) {
        throw new Error(error.msg);
      } else {
        throw new Error(error.msg);
      }
    });
};

export const UpdateExaminedPatientAPI = (payload, id) => {
  let data = JSON.stringify(payload);
  let config = {
    method: "PUT",
    maxBodyLength: Infinity,
    url: `${baseUrl}/appointment/updateappointment/${id}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    data: data,
  };

  return axios
    .request(config)
    .then((response) => {
      console.log(JSON.stringify(response.data));
      return response;
    })
    .catch((error) => {
      console.log("error", error.response);
      if (error.response.data.msg) {
        throw new Error(error.response.data.msg);
      } else if (error.response.data) {
        throw new Error(error.response);
      } else if (error.request) {
        throw new Error(error.msg);
      } else {
        throw new Error(error.msg);
      }
    });
};
export const AddEncounterAPI = (payload, id) => {
  let data = JSON.stringify(payload);
  console.log("AddEncounterAPI_payload", payload);
  let config = {
    method: "POST",
    maxBodyLength: Infinity,
    url: `${baseUrl}/appointment/addencounter/${id}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    data: data,
  };

  return axios
    .request(config)
    .then((response) => {
      console.log(JSON.stringify(response.data));
      return response;
    })
    .catch((error) => {
      console.log("error", error.response);
      if (error.response.data.msg) {
        throw new Error(error.response.data.msg);
      } else if (error.response.data) {
        throw new Error(error.response);
      } else if (error.request) {
        throw new Error(error.msg);
      } else {
        throw new Error(error.msg);
      }
    });
};
export const AddClinicalEncounterAPI = (payload, id) => {
  let data = JSON.stringify(payload);
  console.log("AddClinicalEncounterAPI", payload);
  let config = {
    method: "POST",
    maxBodyLength: Infinity,
    url: `${baseUrl}/appointment/addclinicalencounter/${id}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    data: data,
  };

  return axios
    .request(config)
    .then((response) => {
      console.log(JSON.stringify(response.data));
      return response;
    })
    .catch((error) => {
      console.log("error", error.response);
      if (error.response.data.msg) {
        throw new Error(error.response.data.msg);
      } else if (error.response.data) {
        throw new Error(error.response);
      } else if (error.request) {
        throw new Error(error.msg);
      } else {
        throw new Error(error.msg);
      }
    });
};
export const AddPreAnatheticsAPI = (payload, id) => {
  let data = JSON.stringify(payload);
  console.log("AddPreAnatheticsAPI", payload);
  let config = {
    method: "POST",
    maxBodyLength: Infinity,
    url: `${baseUrl}/theatreadmission/fillpreanatheticsform/${id}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    data: data,
  };

  return axios
    .request(config)
    .then((response) => {
      console.log(JSON.stringify(response.data));
      return response;
    })
    .catch((error) => {
      console.log("error", error.response);
      if (error.response.data.msg) {
        throw new Error(error.response.data.msg);
      } else if (error.response.data) {
        throw new Error(error.response);
      } else if (error.request) {
        throw new Error(error.msg);
      } else {
        throw new Error(error.msg);
      }
    });
};
export const AddOperationalConsentAPI = (payload, id) => {
  let data = JSON.stringify(payload);

  let config = {
    method: "POST",
    maxBodyLength: Infinity,
    url: `${baseUrl}/theatreadmission/fillconscentform/${id}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    data: data,
  };

  return axios
    .request(config)
    .then((response) => {
      console.log(JSON.stringify(response.data));
      return response;
    })
    .catch((error) => {
      console.log("error", error.response);
      if (error.response.data.msg) {
        throw new Error(error.response.data.msg);
      } else if (error.response.data) {
        throw new Error(error.response);
      } else if (error.request) {
        throw new Error(error.msg);
      } else {
        throw new Error(error.msg);
      }
    });
};
export const EditOperationalConsentAPI = (payload, id) => {
  let data = JSON.stringify(payload);

  let config = {
    method: "PUT",
    maxBodyLength: Infinity,
    url: `${baseUrl}/theatreadmission/updatefillconscentform/${id}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    data: data,
  };

  return axios
    .request(config)
    .then((response) => {
      console.log(JSON.stringify(response.data));
      return response;
    })
    .catch((error) => {
      console.log("error", error.response);
      if (error.response.data.msg) {
        throw new Error(error.response.data.msg);
      } else if (error.response.data) {
        throw new Error(error.response);
      } else if (error.request) {
        throw new Error(error.msg);
      } else {
        throw new Error(error.msg);
      }
    });
};

export const EditPreAnatheticsAPI = (payload, id) => {
  let data = JSON.stringify(payload);

  let config = {
    method: "PUT",
    maxBodyLength: Infinity,
    url: `${baseUrl}/theatreadmission/updatepreanatheticsconscentform/${id}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    data: data,
  };

  return axios
    .request(config)
    .then((response) => {
      console.log(JSON.stringify(response.data));
      return response;
    })
    .catch((error) => {
      console.log("error", error.response);
      if (error.response.data.msg) {
        throw new Error(error.response.data.msg);
      } else if (error.response.data) {
        throw new Error(error.response);
      } else if (error.request) {
        throw new Error(error.msg);
      } else {
        throw new Error(error.msg);
      }
    });
};
export const CreateAncAPI = (payload, id) => {
  let data = JSON.stringify(payload);
  console.log("CreateAncAPI_payload", payload);
  let config = {
    method: "POST",
    maxBodyLength: Infinity,
    url: `${baseUrl}/anc/createanc/${id}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    data: data,
  };

  return axios
    .request(config)
    .then((response) => {
      console.log(JSON.stringify(response.data));
      return response;
    })
    .catch((error) => {
      console.log("error", error.response);
      if (error.response.data.msg) {
        throw new Error(error.response.data.msg);
      } else if (error.response.data) {
        throw new Error(error.response);
      } else if (error.request) {
        throw new Error(error.msg);
      } else {
        throw new Error(error.msg);
      }
    });
};
export const CreateAncV2API = (payload, id) => {
  let data = JSON.stringify(payload);
  console.log("CreateAncAPI_payload", payload);
  let config = {
    method: "POST",
    maxBodyLength: Infinity,
    url: `${baseUrl}/anc/createancv2/${id}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    data: data,
  };

  return axios
    .request(config)
    .then((response) => {
      console.log(JSON.stringify(response.data));
      return response;
    })
    .catch((error) => {
      console.log("error", error.response);
      if (error.response.data.msg) {
        throw new Error(error.response.data.msg);
      } else if (error.response.data) {
        throw new Error(error.response);
      } else if (error.request) {
        throw new Error(error.msg);
      } else {
        throw new Error(error.msg);
      }
    });
};
export const CreateAncV3API = (payload, id) => {
  let data = JSON.stringify(payload);
  console.log("CreateAncAPI_payload", payload);
  let config = {
    method: "POST",
    maxBodyLength: Infinity,
    url: `${baseUrl}/anc/createancv3/${id}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    data: data,
  };

  return axios
    .request(config)
    .then((response) => {
      console.log(JSON.stringify(response.data));
      return response;
    })
    .catch((error) => {
      console.log("error", error.response);
      if (error.response.data.msg) {
        throw new Error(error.response.data.msg);
      } else if (error.response.data) {
        throw new Error(error.response);
      } else if (error.request) {
        throw new Error(error.msg);
      } else {
        throw new Error(error.msg);
      }
    });
};
export const EditAncV3API = (payload, id) => {
  let data = JSON.stringify(payload);
  console.log("CreateAncAPI_payload", payload);
  let config = {
    method: "PUT",
    maxBodyLength: Infinity,
    url: `${baseUrl}/anc/updateancsv3/${id}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    data: data,
  };

  return axios
    .request(config)
    .then((response) => {
      console.log(JSON.stringify(response.data));
      return response;
    })
    .catch((error) => {
      console.log("error", error.response);
      if (error.response.data.msg) {
        throw new Error(error.response.data.msg);
      } else if (error.response.data) {
        throw new Error(error.response);
      } else if (error.request) {
        throw new Error(error.msg);
      } else {
        throw new Error(error.msg);
      }
    });
};
export const AddImmunizationAPI = (payload, id) => {
  let data = JSON.stringify(payload);

  let config = {
    method: "POST",
    maxBodyLength: Infinity,
    url: `${baseUrl}/immunization/createimmunizations/${id}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    data: data,
  };

  return axios
    .request(config)
    .then((response) => {
      console.log(JSON.stringify(response.data));
      return response;
    })
    .catch((error) => {
      console.log("error", error.response);
      if (error.response.data.msg) {
        throw new Error(error.response.data.msg);
      } else if (error.response.data) {
        throw new Error(error.response);
      } else if (error.request) {
        throw new Error(error.msg);
      } else {
        throw new Error(error.msg);
      }
    });
};
export const AddReferralAPI = (payload, id) => {
  let data = JSON.stringify(payload);

  let config = {
    method: "POST",
    maxBodyLength: Infinity,
    url: `${baseUrl}/referrer/createreferrers/${id}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    data: data,
  };

  return axios
    .request(config)
    .then((response) => {
      console.log(JSON.stringify(response.data));
      return response;
    })
    .catch((error) => {
      console.log("error", error.response);
      if (error.response.data.msg) {
        throw new Error(error.response.data.msg);
      } else if (error.response.data) {
        throw new Error(error.response);
      } else if (error.request) {
        throw new Error(error.msg);
      } else {
        throw new Error(error.msg);
      }
    });
};
export const AddDeliveryNoteAPI = (payload, id) => {
  let data = JSON.stringify(payload);

  let config = {
    method: "POST",
    maxBodyLength: Infinity,
    url: `${baseUrl}/deliverynote/createdeliverynote/${id}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    data: data,
  };

  return axios
    .request(config)
    .then((response) => {
      console.log(JSON.stringify(response.data));
      return response;
    })
    .catch((error) => {
      console.log("error", error.response);
      if (error.response.data.msg) {
        throw new Error(error.response.data.msg);
      } else if (error.response.data) {
        throw new Error(error.response);
      } else if (error.request) {
        throw new Error(error.msg);
      } else {
        throw new Error(error.msg);
      }
    });
};
export const AddANCFollowUpAPI = (payload, id) => {
  let data = JSON.stringify(payload);

  let config = {
    method: "POST",
    maxBodyLength: Infinity,
    url: `${baseUrl}/anc/createancfollowupsv2/${id}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    data: data,
  };

  return axios
    .request(config)
    .then((response) => {
      console.log(JSON.stringify(response.data));
      return response;
    })
    .catch((error) => {
      console.log("error", error.response);
      if (error.response.data.msg) {
        throw new Error(error.response.data.msg);
      } else if (error.response.data) {
        throw new Error(error.response);
      } else if (error.request) {
        throw new Error(error.msg);
      } else {
        throw new Error(error.msg);
      }
    });
};
export const AddANCFollowUpAPIv3 = (payload, id) => {
  let data = JSON.stringify(payload);

  let config = {
    method: "POST",
    maxBodyLength: Infinity,
    url: `${baseUrl}/anc/createancfollowupsv3/${id}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    data: data,
  };

  return axios
    .request(config)
    .then((response) => {
      console.log(JSON.stringify(response.data));
      return response;
    })
    .catch((error) => {
      console.log("error", error.response);
      if (error.response.data.msg) {
        throw new Error(error.response.data.msg);
      } else if (error.response.data) {
        throw new Error(error.response);
      } else if (error.request) {
        throw new Error(error.msg);
      } else {
        throw new Error(error.msg);
      }
    });
};
export const AddProcedureAPI = (payload, id) => {
  console.log("AddProcedureAPI", payload, "id", id);
  let data = JSON.stringify(payload);

  let config = {
    method: "POST",
    maxBodyLength: Infinity,
    url: `${baseUrl}/procedure/scheduleprocedureorder/${id}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    data: data,
  };

  return axios
    .request(config)
    .then((response) => {
      console.log(JSON.stringify(response.data));
      return response;
    })
    .catch((error) => {
      console.log("error", error.response);
      if (error.response.data.msg) {
        throw new Error(error.response.data.msg);
      } else if (error.response.data) {
        throw new Error(error.response);
      } else if (error.request) {
        throw new Error(error.msg);
      } else {
        throw new Error(error.msg);
      }
    });
};
export const AddReferralResponseAPI = (payload, id) => {
  let data = JSON.stringify(payload);

  let config = {
    method: "POST",
    maxBodyLength: Infinity,
    url: `${baseUrl}/referrer/acceptreferrers/${id}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    data: data,
  };

  return axios
    .request(config)
    .then((response) => {
      console.log(JSON.stringify(response.data));
      return response;
    })
    .catch((error) => {
      console.log("error", error.response);
      if (error.response.data.msg) {
        throw new Error(error.response.data.msg);
      } else if (error.response.data) {
        throw new Error(error.response);
      } else if (error.request) {
        throw new Error(error.msg);
      } else {
        throw new Error(error.msg);
      }
    });
};
export const AddReferralScheduleAPI = (payload, id) => {
  let data = JSON.stringify(payload);

  let config = {
    method: "PUT",
    maxBodyLength: Infinity,
    url: `${baseUrl}/referrer/scheduleappointment/${id}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    data: data,
  };

  return axios
    .request(config)
    .then((response) => {
      console.log(JSON.stringify(response.data));
      return response;
    })
    .catch((error) => {
      console.log("error", error.response);
      if (error.response.data.msg) {
        throw new Error(error.response.data.msg);
      } else if (error.response.data) {
        throw new Error(error.response);
      } else if (error.request) {
        throw new Error(error.msg);
      } else {
        throw new Error(error.msg);
      }
    });
};
export const AddEntriesAPI = (payload, id) => {
  let data = JSON.stringify(payload);

  let config = {
    method: "POST",
    maxBodyLength: Infinity,
    url: `${baseUrl}/pathogragh/createpathographs/${id}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    data: data,
  };

  return axios
    .request(config)
    .then((response) => {
      console.log(JSON.stringify(response.data));
      return response;
    })
    .catch((error) => {
      console.log("error", error.response);
      if (error.response.data.msg) {
        throw new Error(error.response.data.msg);
      } else if (error.response.data) {
        throw new Error(error.response);
      } else if (error.request) {
        throw new Error(error.msg);
      } else {
        throw new Error(error.msg);
      }
    });
};
export const AddFamilyPlanAPI = (payload, id) => {
  let data = JSON.stringify(payload);

  let config = {
    method: "POST",
    maxBodyLength: Infinity,
    url: `${baseUrl}/familyplanning/createfamilyplanning/${id}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    data: data,
  };

  return axios
    .request(config)
    .then((response) => {
      console.log(JSON.stringify(response.data));
      return response;
    })
    .catch((error) => {
      console.log("error", error.response);
      if (error.response.data.msg) {
        throw new Error(error.response.data.msg);
      } else if (error.response.data) {
        throw new Error(error.response);
      } else if (error.request) {
        throw new Error(error.msg);
      } else {
        throw new Error(error.msg);
      }
    });
};
export const UpdateEntriesAPI = (payload, id) => {
  let data = JSON.stringify(payload);

  let config = {
    method: "PUT",
    maxBodyLength: Infinity,
    url: `${baseUrl}/pathogragh/updatepathographs/${id}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    data: data,
  };

  return axios
    .request(config)
    .then((response) => {
      console.log(JSON.stringify(response.data));
      return response;
    })
    .catch((error) => {
      console.log("error", error.response);
      if (error.response.data.msg) {
        throw new Error(error.response.data.msg);
      } else if (error.response.data) {
        throw new Error(error.response);
      } else if (error.request) {
        throw new Error(error.msg);
      } else {
        throw new Error(error.msg);
      }
    });
};
export const UpdateFamilyPlaningAPI = (payload, id) => {
  let data = JSON.stringify(payload);

  let config = {
    method: "PUT",
    maxBodyLength: Infinity,
    url: `${baseUrl}/familyplanning/updatefamilyplanning/${id}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    data: data,
  };

  return axios
    .request(config)
    .then((response) => {
      console.log(JSON.stringify(response.data));
      return response;
    })
    .catch((error) => {
      console.log("error", error.response);
      if (error.response.data.msg) {
        throw new Error(error.response.data.msg);
      } else if (error.response.data) {
        throw new Error(error.response);
      } else if (error.request) {
        throw new Error(error.msg);
      } else {
        throw new Error(error.msg);
      }
    });
};
export const UpdateImmunizationAPI = (payload, id) => {
  let data = JSON.stringify(payload);

  let config = {
    method: "PUT",
    maxBodyLength: Infinity,
    url: `${baseUrl}/immunization/updateimmunizations/${id}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    data: data,
  };

  return axios
    .request(config)
    .then((response) => {
      console.log(JSON.stringify(response.data));
      return response;
    })
    .catch((error) => {
      console.log("error", error.response);
      if (error.response.data.msg) {
        throw new Error(error.response.data.msg);
      } else if (error.response.data) {
        throw new Error(error.response);
      } else if (error.request) {
        throw new Error(error.msg);
      } else {
        throw new Error(error.msg);
      }
    });
};
export const UpdateReferralAPI = (payload, id) => {
  let data = JSON.stringify(payload);

  let config = {
    method: "PUT",
    maxBodyLength: Infinity,
    url: `${baseUrl}/referrer/updatereferrers/${id}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    data: data,
  };

  return axios
    .request(config)
    .then((response) => {
      console.log(JSON.stringify(response.data));
      return response;
    })
    .catch((error) => {
      console.log("error", error.response);
      if (error.response.data.msg) {
        throw new Error(error.response.data.msg);
      } else if (error.response.data) {
        throw new Error(error.response);
      } else if (error.request) {
        throw new Error(error.msg);
      } else {
        throw new Error(error.msg);
      }
    });
};
export const UpdateDeliveryNoteAPI = (payload, id) => {
  let data = JSON.stringify(payload);

  let config = {
    method: "PUT",
    maxBodyLength: Infinity,
    url: `${baseUrl}/deliverynote/updatedeliverynote/${id}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    data: data,
  };

  return axios
    .request(config)
    .then((response) => {
      console.log(JSON.stringify(response.data));
      return response;
    })
    .catch((error) => {
      console.log("error", error.response);
      if (error.response.data.msg) {
        throw new Error(error.response.data.msg);
      } else if (error.response.data) {
        throw new Error(error.response);
      } else if (error.request) {
        throw new Error(error.msg);
      } else {
        throw new Error(error.msg);
      }
    });
};
export const UpdateAncFollowupAPI = (payload, id) => {
  let data = JSON.stringify(payload);

  let config = {
    method: "PUT",
    maxBodyLength: Infinity,
    url: `${baseUrl}/anc/updateancfollowupsv2/${id}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    data: data,
  };

  return axios
    .request(config)
    .then((response) => {
      console.log(JSON.stringify(response.data));
      return response;
    })
    .catch((error) => {
      console.log("error", error.response);
      if (error.response.data.msg) {
        throw new Error(error.response.data.msg);
      } else if (error.response.data) {
        throw new Error(error.response);
      } else if (error.request) {
        throw new Error(error.msg);
      } else {
        throw new Error(error.msg);
      }
    });
};
export const UpdateAncFollowupAPIv3 = (payload, id) => {
  let data = JSON.stringify(payload);

  let config = {
    method: "PUT",
    maxBodyLength: Infinity,
    url: `${baseUrl}/anc/updateancfollowupsv3/${id}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    data: data,
  };

  return axios
    .request(config)
    .then((response) => {
      console.log(JSON.stringify(response.data));
      return response;
    })
    .catch((error) => {
      console.log("error", error.response);
      if (error.response.data.msg) {
        throw new Error(error.response.data.msg);
      } else if (error.response.data) {
        throw new Error(error.response);
      } else if (error.request) {
        throw new Error(error.msg);
      } else {
        throw new Error(error.msg);
      }
    });
};
export const UpdateProcedureAPI = (payload, id) => {
  let data = JSON.stringify(payload);

  let config = {
    method: "PUT",
    maxBodyLength: Infinity,
    url: `${baseUrl}/procedure/updateprocedure/${id}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    data: data,
  };

  return axios
    .request(config)
    .then((response) => {
      console.log(JSON.stringify(response.data));
      return response;
    })
    .catch((error) => {
      console.log("error", error.response);
      if (error.response.data.msg) {
        throw new Error(error.response.data.msg);
      } else if (error.response.data) {
        throw new Error(error.response);
      } else if (error.request) {
        throw new Error(error.msg);
      } else {
        throw new Error(error.msg);
      }
    });
};
export const UpdatePathCompleteAPI = (id) => {
  let config = {
    method: "PUT",
    maxBodyLength: Infinity,
    url: `${baseUrl}/pathogragh/markascompletepathographs/${id}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  return axios
    .request(config)
    .then((response) => {
      console.log(JSON.stringify(response.data));
      return response;
    })
    .catch((error) => {
      console.log("error", error.response);
      if (error.response.data.msg) {
        throw new Error(error.response.data.msg);
      } else if (error.response.data) {
        throw new Error(error.response);
      } else if (error.request) {
        throw new Error(error.msg);
      } else {
        throw new Error(error.msg);
      }
    });
};
export const UpdateAdmissionStatusAPI = (payload, id) => {
  let data = JSON.stringify(payload);

  let config = {
    method: "PUT",
    maxBodyLength: Infinity,
    url: `${baseUrl}/admission/updateadmissionstatus/${id}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    data: data,
  };

  return axios
    .request(config)
    .then((response) => {
      console.log(JSON.stringify(response.data));
      return response;
    })
    .catch((error) => {
      console.log("error", error.response);
      if (error.response.data.msg) {
        throw new Error(error.response.data.msg);
      } else if (error.response.data) {
        throw new Error(error.response);
      } else if (error.request) {
        throw new Error(error.msg);
      } else {
        throw new Error(error.msg);
      }
    });
};
export const AddPriceSettingsApi = (payload) => {
  let data = JSON.stringify(payload);
  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: `${baseUrl}/settings/createprices`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    data: data,
  };

  return axios
    .request(config)
    .then((response) => {
      console.log(JSON.stringify(response.data));
      return response;
    })
    .catch((error) => {
      console.log("error", error.response);
      if (error.response.data.msg) {
        throw new Error(error.response.data.msg);
      } else if (error.response.data) {
        throw new Error(error.response);
      } else if (error.request) {
        throw new Error(error.msg);
      } else {
        throw new Error(error.msg);
      }
    });
};
export const AddClinicSettingsApi = (payload) => {
  let data = JSON.stringify(payload);
  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: `${baseUrl}/settings/createclinics`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    data: data,
  };

  return axios
    .request(config)
    .then((response) => {
      console.log(JSON.stringify(response.data));
      return response;
    })
    .catch((error) => {
      console.log("error", error.response);
      if (error.response.data.msg) {
        throw new Error(error.response.data.msg);
      } else if (error.response.data) {
        throw new Error(error.response);
      } else if (error.request) {
        throw new Error(error.msg);
      } else {
        throw new Error(error.msg);
      }
    });
};
export const AddServiceTypeSettingsApi = (payload) => {
  let data = JSON.stringify(payload);
  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: `${baseUrl}/settings/createservicetypes`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    data: data,
  };

  return axios
    .request(config)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      console.log("error", error.response);
      if (error.response.data.msg) {
        throw new Error(error.response.data.msg);
      } else if (error.response.data) {
        throw new Error(error.response);
      } else if (error.request) {
        throw new Error(error.msg);
      } else {
        throw new Error(error.msg);
      }
    });
};
export const AddWardSettingsApi = (payload) => {
  console.log("AddWardSettingsApi", payload);
  let data = JSON.stringify(payload);
  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: `${baseUrl}/settings/createward`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    data: data,
  };

  return axios
    .request(config)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      console.log("error", error.response);
      if (error.response.data.msg) {
        throw new Error(error.response.data.msg);
      } else if (error.response.data) {
        throw new Error(error.response);
      } else if (error.request) {
        throw new Error(error.msg);
      } else {
        throw new Error(error.msg);
      }
    });
};
export const ExaminePatientApi = (payload, id) => {
  let data = JSON.stringify(payload);
  let config = {
    method: "PUT",
    maxBodyLength: Infinity,
    url: `${baseUrl}/appointment/examinepatient/${id}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    data: data,
  };

  return axios
    .request(config)
    .then((response) => {
      console.log(JSON.stringify(response.data));
      return response;
    })
    .catch((error) => {
      if (error.response.data.msg) {
        throw new Error(error.response.data.msg);
      } else if (error.response.data) {
        throw new Error(error.response);
      } else if (error.request) {
        throw new Error(error.msg);
      } else {
        throw new Error(error.msg);
      }
    });
};
export const TakeVitalApi = (payload, id) => {
  console.log("TakeVitalApi payload", payload);
  let data = JSON.stringify(payload);
  let config = {
    method: "PUT",
    maxBodyLength: Infinity,
    url: `${baseUrl}/nursingcare/updatevitalchart/${id}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    data: data,
  };

  return axios
    .request(config)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      console.log("error", error.response);
      if (error.response.data.msg) {
        throw new Error(error.response.data.msg);
      } else if (error.response.data) {
        throw new Error(error.response);
      } else if (error.request) {
        throw new Error(error.msg);
      } else {
        throw new Error(error.msg);
      }
    });
};
export const RequestLabOrderApi = (payload, id) => {
  console.log("payloadrequest...", payload, "id", id);
  let data = JSON.stringify(payload);
  let config = {
    method: "POST",
    maxBodyLength: Infinity,
    url: `${baseUrl}/appointment/laborder/${id}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    data: data,
  };

  return axios
    .request(config)
    .then((response) => {
      console.log(JSON.stringify(response.data));
      return response;
    })
    .catch((error) => {
      console.log("error", error.response);
      if (error.response.data.msg) {
        throw new Error(error.response.data.msg);
      } else if (error.response.data) {
        throw new Error(error.response);
      } else if (error.request) {
        throw new Error(error.msg);
      } else {
        throw new Error(error.msg);
      }
    });
};
export const RequestLabOrderStandAloneApi = (payload, id) => {
  let data = JSON.stringify(payload);
  let config = {
    method: "POST",
    maxBodyLength: Infinity,
    url: `${baseUrl}/appointment/laborder/${id}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    data: data,
  };

  return axios
    .request(config)
    .then((response) => {
      console.log(JSON.stringify(response.data));
      return response;
    })
    .catch((error) => {
      console.log("error", error.response);
      if (error.response.data.msg) {
        throw new Error(error.response.data.msg);
      } else if (error.response.data) {
        throw new Error(error.response);
      } else if (error.request) {
        throw new Error(error.msg);
      } else {
        throw new Error(error.msg);
      }
    });
};
export const ProcessLabApi = (payload, id) => {
  let data = JSON.stringify(payload);
  let config = {
    method: "PUT",
    maxBodyLength: Infinity,
    url: `${baseUrl}/lab/labresultprocessing/${id}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    data: data,
  };

  return axios
    .request(config)
    .then((response) => {
      console.log(JSON.stringify(response.data));
      return response;
    })
    .catch((error) => {
      console.log("error", error.response);
      if (error.response.data.msg) {
        throw new Error(error.response.data.msg);
      } else if (error.response.data) {
        throw new Error(error.response);
      } else if (error.request) {
        throw new Error(error.msg);
      } else {
        throw new Error(error.msg);
      }
    });
};
export const UpdatePatientApi = (patientData, id) => {
  let data = JSON.stringify(patientData);
  let config = {
    method: "put",
    maxBodyLength: Infinity,
    url: `${baseUrl}/patientsmanagement/updatepatients/${id}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    data: data,
  };

  return axios
    .request(config)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      console.log("error", error.response);
      if (error.response.data.msg) {
        throw new Error(error.response.data.msg);
      } else if (error.response.data) {
        throw new Error(error.response);
      } else if (error.request) {
        throw new Error(error.msg);
      } else {
        throw new Error(error.msg);
      }
    });
};

export const GetAllPatientsApi = (pageNo, postPerPage) => {
  // Configure the GET request
  let config = {
    method: "get",
    url: `${baseUrl}/patientsmanagement/getallpatients?page=${pageNo}&size=${postPerPage}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  return axios
    .request(config)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.log("Error fetching patients details:", error.response);
      if (error.response && error.response.data.msg) {
        throw new Error(error.response.data.msg);
      } else if (error.response && error.response.data) {
        throw new Error(error.response);
      } else if (error.request) {
        throw new Error(error.msg);
      } else {
        throw new Error(error.msg);
      }
    });
};
export const GetAllPaymentGroupOptApi = (pageNo, postPerPage, status) => {
  // Configure the GET request
  let config = {
    method: "get",
    url: `${baseUrl}/billing/groupreadallpaymentoptimized?status=${status}&page=${pageNo}&size=${postPerPage}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  return axios
    .request(config)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.log("Error fetching patients details:", error.response);
      if (error.response && error.response.data.msg) {
        throw new Error(error.response.data.msg);
      } else if (error.response && error.response.data) {
        throw new Error(error.response);
      } else if (error.request) {
        throw new Error(error.msg);
      } else {
        throw new Error(error.msg);
      }
    });
};
export const GetAllFilteredPaymentGroupOptApi = (
  status,
  key,
  value,
  pageNo,
  postPerPage
) => {
  // Configure the GET request
  let config = {
    method: "get",
    url: `${baseUrl}/billing/groupreadallpaymentoptimized?status=${status}&${key}=${value}&page=${pageNo}&size=${postPerPage}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  return axios
    .request(config)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.log("Error fetching patients details:", error.response);
      if (error.response && error.response.data.msg) {
        throw new Error(error.response.data.msg);
      } else if (error.response && error.response.data) {
        throw new Error(error.response);
      } else if (error.request) {
        throw new Error(error.msg);
      } else {
        throw new Error(error.msg);
      }
    });
};
export const GetAllFilteredPatientsApi = (key, value, pageNo, postPerPage) => {
  // Configure the GET request
  let config = {
    method: "get",
    url: `${baseUrl}/patientsmanagement/getallpatients?${key}=${value}&page=${pageNo}&size=${postPerPage}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  return axios
    .request(config)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.log("Error fetching patients details:", error.response);
      if (error.response && error.response.data.msg) {
        throw new Error(error.response.data.msg);
      } else if (error.response && error.response.data) {
        throw new Error(error.response);
      } else if (error.request) {
        throw new Error(error.msg);
      } else {
        throw new Error(error.msg);
      }
    });
};
export const GetAllFilteredScheduledApi = (key, value, pageNo, postPerPage) => {
  // Configure the GET request
  let config = {
    method: "get",
    url: `${baseUrl}/appointment/getallschedulesoptimized?${key}=${value}&page=${pageNo}&size=${postPerPage}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  return axios
    .request(config)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.log("Error  details:", error.response);
      if (error.response && error.response.data.msg) {
        throw new Error(error.response.data.msg);
      } else if (error.response && error.response.data) {
        throw new Error(error.response);
      } else if (error.request) {
        throw new Error(error.msg);
      } else {
        throw new Error(error.msg);
      }
    });
};

export const SettingsApi = () => {
  let config = {
    method: "get",
    url: `${baseUrl}/auth/settings`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  return axios
    .request(config)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.log("Error fetching users:", error.response);
      if (error.response && error.response.data.msg) {
        throw new Error(error.response.data.msg);
      } else if (error.response && error.response.data) {
        throw new Error(error.response);
      } else if (error.request) {
        throw new Error(error.msg);
      } else {
        throw new Error(error.msg);
      }
    });
};

export const BulkUploadApi = (formData) => {
  console.log("BulkUploadApi", formData);

  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: `${baseUrl}/users/bulkuploadusers`,
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
    data: formData,
  };

  return axios
    .request(config)
    .then((response) => {
      console.log("Bulk Upload Success:", JSON.stringify(response.data));
      return response.data;
    })
    .catch((error) => {
      console.log("Error in Bulk Upload:", error.response);
      if (error.response && error.response.data.msg) {
        throw new Error(error.response.data.msg);
      } else if (error.response && error.response.data) {
        throw new Error(error.response);
      } else if (error.request) {
        throw new Error(error.msg);
      } else {
        throw new Error(error.msg);
      }
    });
};
export const DownloadSampleFileApi = () => {
  let config = {
    method: "get",
    url: `${baseUrl}/downloads/downloadtemplate/userbulkdownloadtemplate`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    responseType: "blob",
  };

  return axios
    .request(config)
    .then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "SampleBulkUploadTemplate.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
      return response;
    })
    .catch((error) => {
      console.error(
        "Error downloading the sample file:",
        error.response || error.message
      );
      throw new Error(
        error.response?.data?.msg || "Failed to download the file."
      );
    });
};

// Fetch all states
export const getAllStates = async () => {
  try {
    const response = await axios.get(`${nigeriaStateApiUrl}/fetch`);
    return response.data;
  } catch (error) {
    console.error("Error fetching states:", error);
    return [];
  }
};

// Fetch LGAs for a specific state
export const getLGAsForState = async (state) => {
  try {
    const response = await axios.get(`${nigeriaStateApiUrl}`, {
      params: { state },
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching LGAs for state ${state}:`, error);
    return [];
  }
};

export const ScheduleAppointmentApi = (payload) => {
  console.log("scheduleappointpayload", payload);

  let data = JSON.stringify(payload);
  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: `${baseUrl}/appointment/scheduleappointment`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    data: data,
  };

  return axios
    .request(config)
    .then((response) => {
      console.log(JSON.stringify(response.data));
      return response;
    })
    .catch((error) => {
      console.log("error", error.response);
      if (error.response?.data?.msg) {
        throw new Error(error.response.data.msg);
      } else if (error.response?.data) {
        throw new Error(JSON.stringify(error.response.data));
      } else if (error.request) {
        throw new Error(error.message);
      } else {
        throw new Error(error.message);
      }
    });
};

export const GetAllSchedulesApi = (pageNo, postPerPage) => {
  let config = {
    method: "get",
    maxBodyLength: Infinity,
    url: `${baseUrl}/appointment/getallschedulesoptimized?page=${pageNo}&size=${postPerPage}`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  return axios
    .request(config)
    .then((response) => {
      console.log("Get All Schedules Success:", JSON.stringify(response.data));
      return response.data;
    })
    .catch((error) => {
      console.log("Error in Get All Schedules:", error.response);
      if (error.response && error.response.data.msg) {
        throw new Error(error.response.data.msg);
      } else if (error.response && error.response.data) {
        throw new Error(error.response);
      } else if (error.request) {
        throw new Error(error.msg);
      } else {
        throw new Error(error.msg);
      }
    });
};

export const UpdateAppointmentApi = (appointmentId, payload) => {
  console.log("updateAppointmentPayload", payload);

  let data = JSON.stringify(payload);
  let config = {
    method: "put",
    maxBodyLength: Infinity,
    url: `${baseUrl}/appointment/updateappointment/${appointmentId}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    data: data,
  };

  return axios
    .request(config)
    .then((response) => {
      console.log(JSON.stringify(response.data));
      return response;
    })
    .catch((error) => {
      console.log("error", error.response);
      if (error.response?.data?.msg) {
        throw new Error(error.response.data.msg);
      } else if (error.response?.data) {
        throw new Error(JSON.stringify(error.response.data));
      } else if (error.request) {
        throw new Error(error.message);
      } else {
        throw new Error(error.message);
      }
    });
};
export const getPatientData = (id) => {
  const config = {
    method: "get",
    maxBodyLength: Infinity,
    url: `${baseUrl}/patientsmanagement/getonepatients/${id}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  return axios
    .request(config)
    .then((response) => {
      console.log(JSON.stringify(response.data));
      return response.data.queryresult;
    })
    .catch((error) => {
      console.log("error", error.response);
      if (error.response?.data?.msg) {
        throw new Error(error.response.data.msg);
      } else if (error.response?.data) {
        throw new Error(error.response.data);
      } else if (error.request) {
        throw new Error(error.msg || "No response received from server.");
      } else {
        throw new Error(error.message || "Unexpected error occurred.");
      }
    });
};

export const updatePatientPicture = (id, pictureFile) => {
  // const formData = new FormData();
  //formData.append('file', pictureFile);

  const config = {
    method: "post",
    maxBodyLength: Infinity,
    url: `${baseUrl}/patientsmanagement/uploadpatientphoto/${id}`,
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
    data: pictureFile,
  };

  return axios
    .request(config)
    .then((response) => {
      console.log("Response Data:", JSON.stringify(response.data));
      return response.data;
    })
    .catch((error) => {
      console.error("Error:", error.response);
      if (error.response?.data?.msg) {
        throw new Error(error.response.data.msg);
      } else if (error.response?.data) {
        throw new Error(error.response.data);
      } else if (error.request) {
        throw new Error(error.msg || "No response received from server.");
      } else {
        throw new Error(error.message || "Unexpected error occurred.");
      }
    });
};
export const PharmacyBulkUploadApi = (formData) => {
  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: `${baseUrl}/pharmacy/bulkstockupload`,
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
    data: formData,
  };

  return axios
    .request(config)
    .then((response) => {
      console.log("Bulk Upload Success:", JSON.stringify(response.data));
      return response.data;
    })
    .catch((error) => {
      console.log("Error in Bulk Upload:", error.response);
      if (error.response && error.response.data.msg) {
        throw new Error(error.response.data.msg);
      } else if (error.response && error.response.data) {
        throw new Error(error.response);
      } else if (error.request) {
        throw new Error(error.msg);
      } else {
        throw new Error(error.msg);
      }
    });
};
export const DownloadPharmacySampleFileApi = () => {
  let config = {
    method: "get",
    url: `${baseUrl}/downloads/downloadtemplate/stockbulkdownloadtemplate`,

    headers: {
      Authorization: `Bearer ${token}`,
    },
    responseType: "blob",
  };

  return axios
    .request(config)
    .then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "SampleBulkUploadTemplate.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
      return response;
    })
    .catch((error) => {
      console.error(
        "Error downloading the sample file:",
        error.response || error.message
      );
      throw new Error(
        error.response?.data?.msg || "Failed to download the file."
      );
    });
};

export const fetchPharmacyStock = () => {
  let config = {
    method: "get",
    maxBodyLength: Infinity,
    url: `${baseUrl}/pharmacy/getallpharmacystock`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  return axios
    .request(config)
    .then((response) => {
      console.log("Get All Stock Success:", JSON.stringify(response.data));
      return response.data;
    })
    .catch((error) => {
      console.log("Error in Get All Stock:", error.response);
      if (error.response && error.response.data.msg) {
        throw new Error(error.response.data.msg);
      } else if (error.response && error.response.data) {
        throw new Error(error.response);
      } else if (error.request) {
        throw new Error(error.msg);
      } else {
        throw new Error(error.msg);
      }
    });
};
export const AddStockApi = (stockData) => {
  let data = JSON.stringify(stockData);
  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: `${baseUrl}/pharmacy/createstock`,

    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    data: data,
  };

  return axios
    .request(config)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      console.log("error", error.response);
      if (error.response.data.msg) {
        throw new Error(error.response.data.msg);
      } else if (error.response.data) {
        throw new Error(error.response);
      } else if (error.request) {
        throw new Error(error.msg);
      } else {
        throw new Error(error.msg);
      }
    });
};
export const UpdateStockApi = (stockData, id) => {
  let data = JSON.stringify(stockData);
  let config = {
    method: "put",
    maxBodyLength: Infinity,
    url: `${baseUrl}/pharmacy/updatestocks/${id}`,

    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    data: data,
  };

  return axios
    .request(config)
    .then((response) => {
      console.log(JSON.stringify(response.data));
      return response;
    })
    .catch((error) => {
      console.log("error", error.response);
      if (error.response.data.msg) {
        throw new Error(error.response.data.msg);
      } else if (error.response.data) {
        throw new Error(error.response);
      } else if (error.request) {
        throw new Error(error.msg);
      } else {
        throw new Error(error.msg);
      }
    });
};
export const PlaceOrderApi = async (payload, id) => {
  let data = JSON.stringify(payload);
  console.log("ConfirmOrderApi", id, payload);

  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: `${baseUrl}/pharmacy/pharmacyorder/${id}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    data: data,
  };

  return axios
    .request(config)
    .then((response) => {
      console.log(JSON.stringify(response.data));
      return response.data;
    })
    .catch((error) => {
      console.log("Error placing order:", error.response);
      if (error.response?.data?.msg) {
        throw new Error(error.response.data.msg);
      } else if (error.response?.data) {
        throw new Error(JSON.stringify(error.response.data));
      } else if (error.request) {
        throw new Error("No response received from the server.");
      } else {
        throw new Error(error.message);
      }
    });
};

export const ReadAllPharmacyApi = () => {
  let config = {
    method: "get",
    maxBodyLength: Infinity,
    url: `${baseUrl}/pharmacy/readallpharmacytransaction`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  return axios
    .request(config)
    .then((response) => {
      console.log(
        "Get All Transaction Success:",
        JSON.stringify(response.data)
      );
      return response.data;
    })
    .catch((error) => {
      console.log("Error in Get All Transaction:", error.response);
      if (error.response && error.response.data.msg) {
        throw new Error(error.response.data.msg);
      } else if (error.response && error.response.data) {
        throw new Error(error.response);
      } else if (error.request) {
        throw new Error(error.msg);
      } else {
        throw new Error(error.msg);
      }
    });
};
export const DispenseApi = (prescriptionId) => {
  console.log("Dispensing prescription with ID:", prescriptionId);
  const config = {
    method: "put",
    maxBodyLength: Infinity,
    url: `${baseUrl}/pharmacy/dispense/${prescriptionId}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  return axios
    .request(config)
    .then((response) => {
      console.log("Dispense API Response:", JSON.stringify(response.data));
      return response.data;
    })
    .catch((error) => {
      console.error("Dispense API Error:", error.response);
      if (error.response?.data?.msg) {
        throw new Error(error.response.data.msg);
      } else if (error.response?.data) {
        throw new Error(JSON.stringify(error.response.data));
      } else if (error.request) {
        throw new Error("No response received from the server.");
      } else {
        throw new Error(error.message);
      }
    });
};

export const GetAllReferredForAdmissionApi = (wardId) => {
  const config = {
    method: "get",
    maxBodyLength: Infinity,

    url: `${baseUrl}/admission/getallreferedforadmission/${wardId}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  return axios
    .request(config)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.log("Error fetching referred admissions:", error.response);
      if (error.response && error.response.data.msg) {
        throw new Error(error.response.data.msg);
      } else if (error.response && error.response.data) {
        throw new Error(error.response);
      } else if (error.request) {
        throw new Error(error.msg);
      } else {
        throw new Error(error.msg);
      }
    });
};

export const GetAllAdmittedApi = (ward) => {
  let config = {
    method: "get",
    maxBodyLength: Infinity,
    url: `${baseUrl}/admission/getallreferedforadmission/${ward}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  return axios
    .request(config)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.log("Error fetching referred admissions:", error.response);
      if (error.response && error.response.data.msg) {
        throw new Error(error.response.data.msg);
      } else if (error.response && error.response.data) {
        throw new Error(error.response);
      } else if (error.request) {
        throw new Error(error.msg);
      } else {
        throw new Error(error.msg);
      }
    });
};

export const UpdateAdmissionStatusApi = (id, payload) => {
  let data = JSON.stringify(payload);
  let config = {
    method: "put",
    maxBodyLength: Infinity,
    url: `${baseUrl}/admission/updateadmissionstatus/${id}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    data: data,
  };

  return axios
    .request(config)
    .then((response) => {
      console.log(
        "Update Admission Status Success:",
        JSON.stringify(response.data)
      );
      return response;
    })
    .catch((error) => {
      console.error("Error updating admission status:", error.response);
      if (error.response?.data?.msg) {
        throw new Error(error.response.data.msg);
      } else if (error.response?.data) {
        throw new Error(JSON.stringify(error.response.data));
      } else if (error.request) {
        throw new Error("No response received from the server.");
      } else {
        throw new Error(error.message);
      }
    });
};
export const CreateVitalChartApi = (payload, admissionId) => {
  // console.log("CreateVitalChartApi Id payload:", payload);
  console.log("CreateVitalChartApi Id :", admissionId);

  const data = JSON.stringify(payload);
  const config = {
    method: "post",
    maxBodyLength: Infinity,
    url: `${baseUrl}/nursingcare/createvitalchart/${admissionId}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    data: data,
  };

  return axios
    .request(config)
    .then((response) => {
      console.log(
        "CreateVitalChartApi response:",
        JSON.stringify(response.data)
      );
      return response;
    })
    .catch((error) => {
      console.log("CreateVitalChartApi error:", error.response);
      if (error.response?.data?.msg) {
        throw new Error(error.response.data.msg);
      } else if (error.response?.data) {
        throw new Error(error.response.data);
      } else if (error.request) {
        throw new Error(error.message);
      } else {
        throw new Error(error.message);
      }
    });
};
export const ReadAllVitalsByPatientApi = (patientId) => {
  let config = {
    method: "get",
    maxBodyLength: Infinity,
    url: `${baseUrl}/nursingcare/readAllvitalsbypatient/${patientId}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  return axios
    .request(config)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error("Error fetching patient vitals:", error.response);

      if (error.response?.data?.msg) {
        throw new Error(error.response.data.msg);
      } else if (error.response?.data) {
        throw new Error(JSON.stringify(error.response.data));
      } else if (error.request) {
        throw new Error(error.message);
      } else {
        throw new Error(error.message);
      }
    });
};
export const ReadAllVitalChartByAdmissionApi = (admissionId) => {
  const config = {
    method: "get",
    maxBodyLength: Infinity,
    url: `${baseUrl}/nursingcare/readAllvitalsbypatient/${admissionId}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  return axios
    .request(config)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error("Error fetching vital chart data:", error.response);
      if (error.response?.data?.msg) {
        throw new Error(error.response.data.msg);
      } else if (error.response?.data) {
        throw new Error(JSON.stringify(error.response.data));
      } else if (error.request) {
        throw new Error(error.message);
      } else {
        throw new Error(error.message);
      }
    });
};
export const UpdateVitalChartApi = (payload, vitalId) => {
  let data = JSON.stringify(payload);

  let config = {
    method: "put",
    maxBodyLength: Infinity,
    url: `${baseUrl}/nursingcare/updatevitalchart/${vitalId}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    data: data,
  };

  return axios
    .request(config)
    .then((response) => {
      console.log("Updated Vital Chart:", JSON.stringify(response.data));
      return response;
    })
    .catch((error) => {
      console.error("Error updating vital chart:", error.response);
      if (error.response?.data?.msg) {
        throw new Error(error.response.data.msg);
      } else if (error.response?.data) {
        throw new Error(error.response.data);
      } else if (error.request) {
        throw new Error(error.message);
      } else {
        throw new Error(error.message);
      }
    });
};

export const CreateMedicationChartApi = (payload, admissionId) => {
  console.log("CreateMedicationChartApi payload:", payload);

  const data = JSON.stringify(payload);
  const config = {
    method: "post",
    maxBodyLength: Infinity,
    url: `${baseUrl}/nursingcare/createmedicationchart/${admissionId}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    data: data,
  };

  return axios
    .request(config)
    .then((response) => {
      console.log(
        "CreateMedicationChartApi response:",
        JSON.stringify(response.data)
      );
      return response;
    })
    .catch((error) => {
      console.error("CreateMedicationChartApi error:", error.response);
      if (error.response?.data?.msg) {
        throw new Error(error.response.data.msg);
      } else if (error.response?.data) {
        throw new Error(error.response.data);
      } else if (error.request) {
        throw new Error(error.message);
      } else {
        throw new Error(error.message);
      }
    });
};
export const ReadAllMedicationChartByAdmissionApi = (admissionId) => {
  const config = {
    method: "get",
    maxBodyLength: Infinity,
    url: `${baseUrl}/nursingcare/readallmedicationchartByAdmission/${admissionId}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  return axios
    .request(config)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error("Error fetching medication chart data:", error.response);
      if (error.response?.data?.msg) {
        throw new Error(error.response.data.msg);
      } else if (error.response?.data) {
        throw new Error(JSON.stringify(error.response.data));
      } else if (error.request) {
        throw new Error(error.message);
      } else {
        throw new Error(error.message);
      }
    });
};
export const UpdateMedicalChartApi = (payload, medicalChartId) => {
  console.log("UpdateMedicalChartApi payload:", payload);

  const data = JSON.stringify(payload);
  const config = {
    method: "put",
    maxBodyLength: Infinity,
    url: `${baseUrl}/nursingcare/updatemedicalchart/${medicalChartId}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    data: data,
  };

  return axios
    .request(config)
    .then((response) => {
      console.log("Updated Medical Chart:", JSON.stringify(response.data));
      return response;
    })
    .catch((error) => {
      console.error("Error updating medical chart:", error.response);
      if (error.response?.data?.msg) {
        throw new Error(error.response.data.msg);
      } else if (error.response?.data) {
        throw new Error(JSON.stringify(error.response.data));
      } else if (error.request) {
        throw new Error(error.message);
      } else {
        throw new Error(error.message);
      }
    });
};
export const CreateProgressReportApi = (payload, admissionId) => {
  console.log("CreateProgressReportApi payload:", payload);

  const data = JSON.stringify(payload);
  const config = {
    method: "post",
    maxBodyLength: Infinity,
    url: `${baseUrl}/nursingcare/createprogressreport/${admissionId}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    data: data,
  };

  return axios
    .request(config)
    .then((response) => {
      console.log(
        "CreateProgressReportApi response:",
        JSON.stringify(response.data)
      );
      return response;
    })
    .catch((error) => {
      console.error("CreateProgressReportApi error:", error.response);
      if (error.response?.data?.msg) {
        throw new Error(error.response.data.msg);
      } else if (error.response?.data) {
        throw new Error(error.response.data);
      } else if (error.request) {
        throw new Error(error.message);
      } else {
        throw new Error(error.message);
      }
    });
};
export const ReadAllProgressReportByAdmissionApi = (admissionId) => {
  const config = {
    method: "get",
    maxBodyLength: Infinity,
    url: `${baseUrl}/nursingcare/readallprogressreportByAdmission/${admissionId}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  return axios
    .request(config)
    .then((response) => {
      console.log(
        "ReadAllProgressReportByAdmissionApi response:",
        response.data
      );
      return response.data;
    })
    .catch((error) => {
      console.error(
        "ReadAllProgressReportByAdmissionApi error:",
        error.response
      );
      if (error.response?.data?.msg) {
        throw new Error(error.response.data.msg);
      } else if (error.response?.data) {
        throw new Error(JSON.stringify(error.response.data));
      } else if (error.request) {
        throw new Error(error.message);
      } else {
        throw new Error(error.message);
      }
    });
};
export const UpdateProgressReportApi = (payload, progressReportId) => {
  console.log("UpdateProgressReportApi payload:", payload);

  const data = JSON.stringify(payload);
  const config = {
    method: "put",
    maxBodyLength: Infinity,
    url: `${baseUrl}/nursingcare/updateprogressreport/${progressReportId}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    data: data,
  };

  return axios
    .request(config)
    .then((response) => {
      console.log(
        "UpdateProgressReportApi response:",
        JSON.stringify(response.data)
      );
      return response;
    })
    .catch((error) => {
      console.error("UpdateProgressReportApi error:", error.response);
      if (error.response?.data?.msg) {
        throw new Error(error.response.data.msg);
      } else if (error.response?.data) {
        throw new Error(JSON.stringify(error.response.data));
      } else if (error.request) {
        throw new Error(error.message);
      } else {
        throw new Error(error.message);
      }
    });
};
export const CreateInsulinApi = (payload, admissionId) => {
  console.log("CreateInsulinApi payload:", payload);

  const data = JSON.stringify(payload);
  const config = {
    method: "post",
    maxBodyLength: Infinity,
    url: `${baseUrl}/nursingcare/createinsulin/${admissionId}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    data: data,
  };

  return axios
    .request(config)
    .then((response) => {
      console.log("CreateInsulinApi response:", JSON.stringify(response.data));
      return response;
    })
    .catch((error) => {
      console.error("CreateInsulinApi error:", error.response);
      if (error.response?.data?.msg) {
        throw new Error(error.response.data.msg);
      } else if (error.response?.data) {
        throw new Error(JSON.stringify(error.response.data));
      } else if (error.request) {
        throw new Error(error.message);
      } else {
        throw new Error(error.message);
      }
    });
};
export const UpdateInsulinApi = (payload, insulinId) => {
  console.log("UpdateInsulinApi payload:", payload);

  const data = JSON.stringify(payload);
  const config = {
    method: "put",
    maxBodyLength: Infinity,
    url: `${baseUrl}/nursingcare/updateinsulin/${insulinId}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    data: data,
  };

  return axios
    .request(config)
    .then((response) => {
      console.log("UpdateInsulinApi response:", JSON.stringify(response.data));
      return response;
    })
    .catch((error) => {
      console.error("UpdateInsulinApi error:", error.response);
      if (error.response?.data?.msg) {
        throw new Error(error.response.data.msg);
      } else if (error.response?.data) {
        throw new Error(JSON.stringify(error.response.data));
      } else if (error.request) {
        throw new Error(error.message);
      } else {
        throw new Error(error.message);
      }
    });
};
export const ReadAllInsulinByAdmissionApi = (admissionId) => {
  const config = {
    method: "get",
    maxBodyLength: Infinity,
    url: `${baseUrl}/nursingcare/readallinsulinByAdmission/${admissionId}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  return axios
    .request(config)
    .then((response) => {
      console.log(
        "ReadAllInsulinByAdmissionApi response:",
        JSON.stringify(response.data)
      );
      return response.data;
    })
    .catch((error) => {
      console.error("ReadAllInsulinByAdmissionApi error:", error.response);
      if (error.response?.data?.msg) {
        throw new Error(error.response.data.msg);
      } else if (error.response?.data) {
        throw new Error(JSON.stringify(error.response.data));
      } else if (error.request) {
        throw new Error(error.message);
      } else {
        throw new Error(error.message);
      }
    });
};
// CreateTubeFeedingChartApi.js
export const CreateTubeFeedingChartApi = (payload, admissionId) => {
  console.log("CreateTubeFeedingChartApi payload:", payload);

  const data = JSON.stringify(payload);
  const config = {
    method: "post",
    maxBodyLength: Infinity,
    url: `${baseUrl}/nursingcare/createtubefeedingchart/${admissionId}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    data: data,
  };

  return axios
    .request(config)
    .then((response) => {
      console.log(
        "CreateTubeFeedingChartApi response:",
        JSON.stringify(response.data)
      );
      return response;
    })
    .catch((error) => {
      console.error("CreateTubeFeedingChartApi error:", error.response);
      if (error.response?.data?.msg) {
        throw new Error(error.response.data.msg);
      } else if (error.response?.data) {
        throw new Error(error.response.data);
      } else if (error.request) {
        throw new Error(error.message);
      } else {
        throw new Error(error.message);
      }
    });
};
// UpdateTubeFeedingChartApi.js
export const UpdateTubeFeedingChartApi = (payload, tubeFeedingChartId) => {
  console.log("UpdateTubeFeedingChartApi payload:", payload);

  const data = JSON.stringify(payload);
  const config = {
    method: "put",
    maxBodyLength: Infinity,
    url: `${baseUrl}/nursingcare/updatetubefeedingchart/${tubeFeedingChartId}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    data: data,
  };

  return axios
    .request(config)
    .then((response) => {
      console.log(
        "UpdateTubeFeedingChartApi response:",
        JSON.stringify(response.data)
      );
      return response;
    })
    .catch((error) => {
      console.error("UpdateTubeFeedingChartApi error:", error.response);
      if (error.response?.data?.msg) {
        throw new Error(error.response.data.msg);
      } else if (error.response?.data) {
        throw new Error(JSON.stringify(error.response.data));
      } else if (error.request) {
        throw new Error(error.message);
      } else {
        throw new Error(error.message);
      }
    });
};

export const ReadAllTubeFeedingChartByAdmissionApi = (admissionId) => {
  const config = {
    method: "get",
    maxBodyLength: Infinity,
    url: `${baseUrl}/nursingcare/readalltubefeedingchartbyadmission/${admissionId}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  return axios
    .request(config)
    .then((response) => {
      return response.data.queryresult.tubefeedingchartsdetails || [];
    })
    .catch((error) => {
      console.error(
        "ReadAllTubeFeedingChartByAdmissionApi error:",
        error.response
      );
      if (error.response?.data?.msg) {
        throw new Error(error.response.data.msg);
      } else if (error.response?.data) {
        throw new Error(JSON.stringify(error.response.data));
      } else if (error.request) {
        throw new Error(error.message);
      } else {
        throw new Error(error.message);
      }
    });
};
export const CreateFluidBalanceApi = (payload, admissionId) => {
  const data = JSON.stringify(payload);
  const config = {
    method: "post",
    maxBodyLength: Infinity,
    url: `${baseUrl}/nursingcare/createfluidbalance/${admissionId}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    data: data,
  };

  return axios
    .request(config)
    .then((response) => {
      console.log(
        "CreateFluidBalanceApi response:",
        JSON.stringify(response.data)
      );
      return response.data;
    })
    .catch((error) => {
      console.error("CreateFluidBalanceApi error:", error.response);
      if (error.response?.data?.msg) {
        throw new Error(error.response.data.msg);
      } else if (error.response?.data) {
        throw new Error(JSON.stringify(error.response.data));
      } else if (error.request) {
        throw new Error(error.message);
      } else {
        throw new Error(error.message);
      }
    });
};
export const UpdateFluidBalanceApi = (payload, fluidBalanceId) => {
  const data = JSON.stringify(payload);
  const config = {
    method: "put",
    maxBodyLength: Infinity,
    url: `${baseUrl}/nursingcare/updatefluidbalance/${fluidBalanceId}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    data: data,
  };

  return axios
    .request(config)
    .then((response) => {
      console.log(
        "UpdateFluidBalanceApi response:",
        JSON.stringify(response.data)
      );
      return response.data;
    })
    .catch((error) => {
      console.error("UpdateFluidBalanceApi error:", error.response);
      if (error.response?.data?.msg) {
        throw new Error(error.response.data.msg);
      } else if (error.response?.data) {
        throw new Error(JSON.stringify(error.response.data));
      } else if (error.request) {
        throw new Error(error.message);
      } else {
        throw new Error(error.message);
      }
    });
};
export const ReadAllFluidBalanceByAdmissionApi = (admissionId) => {
  const config = {
    method: "get",
    maxBodyLength: Infinity,
    url: `${baseUrl}/nursingcare/readallfluidbalancebyadmission/${admissionId}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  return axios
    .request(config)
    .then((response) => {
      console.log(
        "ReadAllFluidBalanceByAdmissionApi response:",
        JSON.stringify(response.data)
      );
      return response.data;
    })
    .catch((error) => {
      console.error("ReadAllFluidBalanceByAdmissionApi error:", error.response);
      if (error.response?.data?.msg) {
        throw new Error(error.response.data.msg);
      } else if (error.response?.data) {
        throw new Error(JSON.stringify(error.response.data));
      } else if (error.request) {
        throw new Error(error.message);
      } else {
        throw new Error(error.message);
      }
    });
};
export const CreateBloodMonitoringApi = (payload, admissionId) => {
  console.log("CreateBloodMonitoringApi payload:", payload);

  const data = JSON.stringify(payload);
  const config = {
    method: "post",
    maxBodyLength: Infinity,
    url: `${baseUrl}/nursingcare/createbloodmonitoring/${admissionId}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    data: data,
  };

  return axios
    .request(config)
    .then((response) => {
      console.log(
        "CreateBloodMonitoringApi response:",
        JSON.stringify(response.data)
      );
      return response;
    })
    .catch((error) => {
      console.error("CreateBloodMonitoringApi error:", error.response);
      if (error.response?.data?.msg) {
        throw new Error(error.response.data.msg);
      } else if (error.response?.data) {
        throw new Error(JSON.stringify(error.response.data));
      } else if (error.request) {
        throw new Error(error.message);
      } else {
        throw new Error(error.message);
      }
    });
};
export const UpdateBloodMonitoringApi = (payload, bloodMonitoringId) => {
  console.log("UpdateBloodMonitoringApi payload:", payload);

  const data = JSON.stringify(payload);
  const config = {
    method: "put",
    maxBodyLength: Infinity,
    url: `${baseUrl}/nursingcare/updatebloodmonitoring/${bloodMonitoringId}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    data: data,
  };

  return axios
    .request(config)
    .then((response) => {
      console.log(
        "UpdateBloodMonitoringApi response:",
        JSON.stringify(response.data)
      );
      return response;
    })
    .catch((error) => {
      console.error("UpdateBloodMonitoringApi error:", error.response);
      if (error.response?.data?.msg) {
        throw new Error(error.response.data.msg);
      } else if (error.response?.data) {
        throw new Error(JSON.stringify(error.response.data));
      } else if (error.request) {
        throw new Error(error.message);
      } else {
        throw new Error(error.message);
      }
    });
};
export const ReadAllBloodMonitoringByAdmissionApi = (admissionId) => {
  const config = {
    method: "get",
    maxBodyLength: Infinity,
    url: `${baseUrl}/nursingcare/readallbloodmonitoringbyadmission/${admissionId}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  return axios
    .request(config)
    .then((response) => {
      console.log(
        "ReadAllBloodMonitoringByAdmissionApi response:",
        response.data
      );
      return response.data;
    })
    .catch((error) => {
      console.error(
        "ReadAllBloodMonitoringByAdmissionApi error:",
        error.response
      );
      if (error.response?.data?.msg) {
        throw new Error(error.response.data.msg);
      } else if (error.response?.data) {
        throw new Error(JSON.stringify(error.response.data));
      } else if (error.request) {
        throw new Error(error.message);
      } else {
        throw new Error(error.message);
      }
    });
};
export const CreateRadiologyOrderApi = (payload, patientId) => {
  console.log("CreateRadiologyOrderApi payload:", payload);

  const data = JSON.stringify(payload);
  const config = {
    method: "post",
    maxBodyLength: Infinity,
    url: `${baseUrl}/radiology/radiologyorder/${patientId}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    data: data,
  };

  return axios
    .request(config)
    .then((response) => {
      console.log(
        "CreateRadiologyOrderApi response:",
        JSON.stringify(response.data)
      );
      return response;
    })
    .catch((error) => {
      console.error("CreateRadiologyOrderApi error:", error.response);
      if (error.response?.data?.msg) {
        throw new Error(error.response.data.msg);
      } else if (error.response?.data) {
        throw new Error(JSON.stringify(error.response.data));
      } else if (error.request) {
        throw new Error(error.message);
      } else {
        throw new Error(error.message);
      }
    });
};
export const ReadAllRadiologyByPatientApi = (patientId) => {
  const config = {
    method: "get",
    maxBodyLength: Infinity,
    url: `${baseUrl}/radiology/readallradiologybypatient/${patientId}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  return axios
    .request(config)
    .then((response) => {
      console.log("ReadAllRadiologyByPatientApi response:", response.data);
      return response.data;
    })
    .catch((error) => {
      console.error("ReadAllRadiologyByPatientApi error:", error.response);
      if (error.response?.data?.msg) {
        throw new Error(error.response.data.msg);
      } else if (error.response?.data) {
        throw new Error(JSON.stringify(error.response.data));
      } else if (error.request) {
        throw new Error(error.message);
      } else {
        throw new Error(error.message);
      }
    });
};
export const UpdateRadiologyApi = (payload, radiologyOrderId) => {
  console.log("UpdateRadiologyApi payload:", payload);

  const data = JSON.stringify(payload);
  const config = {
    method: "put",
    maxBodyLength: Infinity,
    url: `${baseUrl}/radiology/updateradiology/${radiologyOrderId}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    data: data,
  };

  return axios
    .request(config)
    .then((response) => {
      console.log(
        "UpdateRadiologyApi response:",
        JSON.stringify(response.data)
      );
      return response;
    })
    .catch((error) => {
      console.error("UpdateRadiologyApi error:", error.response);
      if (error.response?.data?.msg) {
        throw new Error(error.response.data.msg);
      } else if (error.response?.data) {
        throw new Error(JSON.stringify(error.response.data));
      } else if (error.request) {
        throw new Error(error.message);
      } else {
        throw new Error(error.message);
      }
    });
};
export const CreateNursingCarePlanApi = (payload, admissionId) => {
  // Convert the payload to a JSON string
  let data = JSON.stringify(payload);

  // Configure the request
  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: `${baseUrl}/nursingcare/createnursingcareplans/${admissionId}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    data: data,
  };

  // Make the API request using axios
  return axios
    .request(config)
    .then((response) => {
      console.log("Nursing Care Plan Created:", JSON.stringify(response.data));
      return response;
    })
    .catch((error) => {
      console.error("Error creating nursing care plan:", error.response);
      if (error.response?.data?.msg) {
        throw new Error(error.response.data.msg);
      } else if (error.response?.data) {
        throw new Error(error.response.data);
      } else if (error.request) {
        throw new Error(error.message);
      } else {
        throw new Error(error.message);
      }
    });
};
export const GetNursingCarePlansByAdmissionApi = (admissionId) => {
  // Configure the request
  let config = {
    method: "get",
    maxBodyLength: Infinity,
    url: `${baseUrl}/nursingcare/readallnursingcarebyadmission/${admissionId}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  // Make the API request using axios
  return axios
    .request(config)
    .then((response) => {
      console.log("Fetched Nursing Care Plans:", JSON.stringify(response.data));
      return response.data;
    })
    .catch((error) => {
      console.error("Error fetching nursing care plans:", error.response);
      if (error.response?.data?.msg) {
        throw new Error(error.response.data.msg);
      } else if (error.response?.data) {
        throw new Error(error.response.data);
      } else if (error.request) {
        throw new Error(error.message);
      } else {
        throw new Error(error.message);
      }
    });
};
export const UpdateNursingCarePlanApi = (payload, nursingCarePlanId) => {
  // Log the payload to verify its structure
  console.log("Update payload:", payload);

  const data = JSON.stringify(payload);

  const config = {
    method: "put",
    maxBodyLength: Infinity,
    url: `${baseUrl}/nursingcare/updatenursingcareplans/${nursingCarePlanId}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    data: data,
  };

  return axios
    .request(config)
    .then((response) => {
      // Log the full response from the API
      console.log("Updated Nursing Care Plan Response:", response.data);
      return response;
    })
    .catch((error) => {
      console.error("Error updating nursing care plan:", error.response);
      if (error.response?.data?.msg) {
        throw new Error(error.response.data.msg);
      } else if (error.response?.data) {
        throw new Error(error.response.data);
      } else if (error.request) {
        throw new Error(error.message);
      } else {
        throw new Error(error.message);
      }
    });
};
export const UploadRadiologyResultApi = (file, radiologyOrderId) => {
  const formData = new FormData();
  formData.append("file", file);

  const config = {
    method: "post",
    url: `${baseUrl}/radiology/uploadradiologyresult/${radiologyOrderId}`,
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
    data: formData,
  };

  return axios
    .request(config)
    .then((response) => {
      console.log("Upload Radiology Result Response:", response.data);

      if (!response.data.status) {
        const errorMsg = response.data.msg || "Upload failed";
        throw new Error(errorMsg);
      }
      return response.data;
    })
    .catch((error) => {
      let errorMessage = "";
      if (error.response && error.response.data && error.response.data.msg) {
        errorMessage = error.response.data.msg;
      } else if (error.response && error.response.data) {
        errorMessage = JSON.stringify(error.response.data);
      } else if (error.request) {
        errorMessage = error.message;
      } else {
        errorMessage = error.message;
      }
      console.error("Error uploading radiology result:", errorMessage);
      throw new Error(errorMessage);
    });
};

export const ViewMultipleRadiologyResultsApi = async (fileNames) => {
  try {
    const urls = await Promise.all(
      fileNames.map(async (fileName) => {
        const response = await axios.request({
          method: "get",
          maxBodyLength: Infinity,
          url: `${baseUrl}/uploads/${fileName}`,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          responseType: "blob",
        });
        const contentType = response.headers["content-type"] || "image/jpeg";
        const blob = new Blob([response.data], { type: contentType });
        return window.URL.createObjectURL(blob);
      })
    );
    return urls;
  } catch (error) {
    let errorMessage = "";
    if (error.response && error.response.data && error.response.data.msg) {
      errorMessage = error.response.data.msg;
    } else if (error.response && error.response.data) {
      errorMessage = JSON.stringify(error.response.data);
    } else if (error.request) {
      errorMessage = error.message;
    } else {
      errorMessage = error.message;
    }
    console.error("Error viewing multiple radiology results:", errorMessage);
    throw new Error(errorMessage);
  }
};

export const UploadProcedureResultApi = (file, procedureId) => {
  const formData = new FormData();
  formData.append("file", file);

  const config = {
    method: "post",
    url: `${baseUrl}/procedure/uploadprocedureresult/${procedureId}`,
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
    data: formData,
  };

  return axios
    .request(config)
    .then((response) => {
      console.log("Upload Procedure Result Response:", response.data);

      if (!response.data.status) {
        const errorMsg = response.data.msg || "Upload failed";
        throw new Error(errorMsg);
      }
      return response.data;
    })
    .catch((error) => {
      let errorMessage = "";
      if (error.response && error.response.data && error.response.data.msg) {
        errorMessage = error.response.data.msg;
      } else if (error.response && error.response.data) {
        errorMessage = JSON.stringify(error.response.data);
      } else if (error.request) {
        errorMessage = error.message;
      } else {
        errorMessage = error.message;
      }
      console.error("Error uploading procedure result:", errorMessage);
      throw new Error(errorMessage);
    });
};

export const ReadAllRadiologyApi = (postsPerPage, currentPage, status) => {
  let config = {
    method: "get",
    maxBodyLength: Infinity,
    url: `${baseUrl}/radiology/readallradiologyoptimized?status=${status}&page=${currentPage}&size=${postsPerPage}`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  return axios
    .request(config)
    .then((response) => {
      console.log(
        "Get All Radiology Transactions Success:",
        JSON.stringify(response.data)
      );
      return response.data;
    })
    .catch((error) => {
      console.log("Error in Get All Radiology Transactions:", error.response);
      if (error.response && error.response.data.msg) {
        throw new Error(error.response.data.msg);
      } else if (error.response && error.response.data) {
        throw new Error(error.response);
      } else if (error.request) {
        throw new Error(error.msg);
      } else {
        throw new Error(error.msg);
      }
    });
};
export const ReadAllRadiologyFilteredApi = (
  postsPerPage,
  currentPage,
  status,
  key,
  value
) => {
  let config = {
    method: "get",
    maxBodyLength: Infinity,
    url: `${baseUrl}/radiology/readallradiologyoptimized?status=${status}&page=${currentPage}&size=${postsPerPage}&${key}=${value}`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  return axios
    .request(config)
    .then((response) => {
      console.log(
        "Get All Radiology Transactions Success:",
        JSON.stringify(response.data)
      );
      return response.data;
    })
    .catch((error) => {
      console.log("Error in Get All Radiology Transactions:", error.response);
      if (error.response && error.response.data.msg) {
        throw new Error(error.response.data.msg);
      } else if (error.response && error.response.data) {
        throw new Error(error.response);
      } else if (error.request) {
        throw new Error(error.msg);
      } else {
        throw new Error(error.msg);
      }
    });
};
export const UpdateUserPasswordApi = (payload, userId, tempToken) => {
  // Convert the payload (containing the new password) to a JSON string
  let data = JSON.stringify(payload);

  let config = {
    method: "put",
    maxBodyLength: Infinity,
    url: `${baseUrl}/users/updateusers/${userId}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${tempToken}`,
    },
    data: data,
  };

  return axios
    .request(config)
    .then((response) => {
      console.log("User password updated:", JSON.stringify(response.data));
      return response;
    })
    .catch((error) => {
      console.error("Error updating user password:", error.response);
      if (error.response?.data?.msg) {
        throw new Error(error.response.data.msg);
      } else if (error.response?.data) {
        throw new Error(error.response.data);
      } else if (error.request) {
        throw new Error(error.message);
      } else {
        throw new Error(error.message);
      }
    });
};
export const DashboardApi = (payload) => {
  // Convert the payload to a JSON string
  const data = JSON.stringify(payload);

  // Retrieve the token from localStorage
  const token = localStorage.getItem("token");

  // Configure the request; assuming a POST request is required
  const config = {
    method: "get",
    maxBodyLength: Infinity,
    url: `${baseUrl}/dashboard`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    data: data,
  };

  // Make the API request using axios
  return axios
    .request(config)
    .then((response) => {
      console.log("Dashboard API response:", JSON.stringify(response.data));
      return response.data;
    })
    .catch((error) => {
      console.error("Error fetching dashboard data:", error.response);
      if (error.response?.data?.msg) {
        throw new Error(error.response.data.msg);
      } else if (error.response?.data) {
        throw new Error(error.response.data);
      } else if (error.request) {
        throw new Error(error.message);
      } else {
        throw new Error(error.message);
      }
    });
};
export const UpdatePasswordApi = (payload, userId) => {
  // Convert the payload (containing the current and new passwords) to a JSON string
  var modifiedpayload = {
    currentpassword: payload.currentPassword,
    newpassword: payload.newPassword,
  };
  let data = JSON.stringify(modifiedpayload);
  console.log("data", data);

  let config = {
    method: "put",
    maxBodyLength: Infinity,
    url: `${baseUrl}/users/updatepassword/${userId}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    data: data,
  };

  return axios
    .request(config)
    .then((response) => {
      console.log("User password updated:", JSON.stringify(response.data));
      return response;
    })
    .catch((error) => {
      console.error("Error updating user password:", error.response);
      if (error.response?.data?.msg) {
        throw new Error(error.response.data.msg);
      } else if (error.response?.data) {
        throw new Error(error.response.data);
      } else if (error.request) {
        throw new Error(error.message);
      } else {
        throw new Error(error.message);
      }
    });
};
export const AddTheatreSettingsApi = (payload) => {
  console.log("AddTheatreSettingsApi", payload);
  let data = JSON.stringify(payload);
  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: `${baseUrl}/settings/createtheatre`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    data: data,
  };

  return axios
    .request(config)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      console.log("error", error.response);
      if (error.response.data.msg) {
        throw new Error(error.response.data.msg);
      } else if (error.response.data) {
        throw new Error(error.response);
      } else if (error.request) {
        throw new Error(error.msg);
      } else {
        throw new Error(error.msg);
      }
    });
};
export const UpdateTheatreAPI = (payload, id) => {
  let data = JSON.stringify(payload);
  let config = {
    method: "PUT",
    maxBodyLength: Infinity,
    url: `${baseUrl}/settings/updatetheatre/${id}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    data: data,
  };

  return axios
    .request(config)
    .then((response) => {
      console.log(JSON.stringify(response.data));
      return response;
    })
    .catch((error) => {
      console.log("error", error.response);
      if (error.response.data.msg) {
        throw new Error(error.response.data.msg);
      } else if (error.response.data) {
        throw new Error(error.response);
      } else if (error.request) {
        throw new Error(error.msg);
      } else {
        throw new Error(error.msg);
      }
    });
};
export const GetAllTheatreApi = () => {
  let config = {
    method: "get",
    url: `${baseUrl}/settings/getalltheatre`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  return axios
    .request(config)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.log("Error fetching theatres:", error.response);
      if (error.response && error.response.data.msg) {
        throw new Error(error.response.data.msg);
      } else if (error.response && error.response.data) {
        throw new Error(error.response);
      } else if (error.request) {
        throw new Error(error.msg);
      } else {
        throw new Error(error.msg);
      }
    });
};
export const ReferTheatreAdmissionApi = (patientId, payload) => {
  console.log("ReferTheatreAdmissionApi", patientId, payload);
  let data = JSON.stringify(payload);

  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: `${baseUrl}/theatreadmission/refertheatreadmission/${patientId}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    data: data,
  };

  return axios
    .request(config)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      console.log("error", error.response);
      if (error.response && error.response.data.msg) {
        throw new Error(error.response.data.msg);
      } else if (error.response && error.response.data) {
        throw new Error(error.response);
      } else if (error.request) {
        throw new Error(error.msg);
      } else {
        throw new Error(error.msg);
      }
    });
};

export const GetAllTheatreAdmissionByPatientApi = (patientId) => {
  console.log("GetAllTheatreAdmissionByPatientApi", patientId);
  let config = {
    method: "get",
    url: `${baseUrl}/theatreadmission/getalltheatreadmissionbypatient/${patientId}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  return axios
    .request(config)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      console.log("error", error.response);
      if (error.response && error.response.data.msg) {
        throw new Error(error.response.data.msg);
      } else if (error.response && error.response.data) {
        throw new Error(error.response);
      } else if (error.request) {
        throw new Error(error.msg);
      } else {
        throw new Error(error.msg);
      }
    });
};
export const GetAllReferredForTheatreAdmissionApi = (theatreId) => {
  console.log("GetAllReferredForTheatreAdmissionApi", theatreId);
  let config = {
    method: "get",
    url: `${baseUrl}/theatreadmission/getallreferedfortheatreadmission/${theatreId}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  return axios
    .request(config)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      console.log("error", error.response);
      if (error.response && error.response.data.msg) {
        throw new Error(error.response.data.msg);
      } else if (error.response && error.response.data) {
        throw new Error(error.response);
      } else if (error.request) {
        throw new Error(error.msg);
      } else {
        throw new Error(error.msg);
      }
    });
};
export const UpdateTheatreAdmissionStatusApi = (id, payload) => {
  console.log("UpdateTheatreAdmissionStatusApi", id, payload);
  const config = {
    method: "put",
    url: `${baseUrl}/theatreadmission/updatetheatreadmissionstatus/${id}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    data: payload,
  };

  return axios
    .request(config)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      console.log("error", error.response);
      if (error.response && error.response.data.msg) {
        throw new Error(error.response.data.msg);
      } else if (error.response && error.response.data) {
        throw new Error(error.response);
      } else if (error.request) {
        throw new Error(error.msg);
      } else {
        throw new Error(error.msg);
      }
    });
};
export const ConfirmRadiologyOrderApi = (radiologyId, payload) => {
  console.log("ConfirmRadiologyOrderApi", radiologyId, payload);
  let config = {
    method: "put",
    url: `${baseUrl}/radiology/confirmradiologyorder/${radiologyId}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    data: payload,
  };

  return axios
    .request(config)
    .then((response) => response)
    .catch((error) => {
      console.log("error", error.response);
      if (error.response && error.response.data.msg) {
        throw new Error(error.response.data.msg);
      } else if (error.response && error.response.data) {
        throw new Error(error.response);
      } else if (error.request) {
        throw new Error(error.msg);
      } else {
        throw new Error(error.msg);
      }
    });
};
export const ConfirmLabOrderApi = (labOrderId, payload) => {
  console.log("ConfirmLabOrderApi", labOrderId, payload);
  let config = {
    method: "put",
    url: `${baseUrl}/lab/confirmlaborder/${labOrderId}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    data: payload,
  };

  return axios
    .request(config)
    .then((response) => response)
    .catch((error) => {
      console.log("error", error.response);
      if (error.response && error.response.data.msg) {
        throw new Error(error.response.data.msg);
      } else if (error.response && error.response.data) {
        throw new Error(error.response);
      } else if (error.request) {
        throw new Error(error.msg);
      } else {
        throw new Error(error.msg);
      }
    });
};
export const ConfirmPharmacyOrderApi = (pharmacyOrderId, payload) => {
  console.log("ConfirmPharmacyOrderApi", pharmacyOrderId, payload);
  let config = {
    method: "put",
    url: `${baseUrl}/pharmacy/confirmpharmacyorder/${pharmacyOrderId}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    data: payload,
  };

  return axios
    .request(config)
    .then((response) => response)
    .catch((error) => {
      console.log("error", error.response);
      if (error.response && error.response.data.msg) {
        throw new Error(error.response.data.msg);
      } else if (error.response && error.response.data) {
        throw new Error(error.response);
      } else if (error.request) {
        throw new Error(error.msg);
      } else {
        throw new Error(error.msg);
      }
    });
};
export const GetPharmarcystockbyname = (pharmacyName) => {
  // Configure the GET request using the selected pharmacy name
  let config = {
    method: "get",
    url: `${baseUrl}/pharmacy/getallpharmacystockbyphamarcy/${encodeURIComponent(
      pharmacyName
    )}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  return axios
    .request(config)
    .then((response) => {
      return response.data; // Return the data part of the response
    })
    .catch((error) => {
      console.log("Error fetching pharmacy stock:", error.response);
      if (error.response && error.response.data.msg) {
        throw new Error(error.response.data.msg);
      } else if (error.response && error.response.data) {
        throw new Error(error.response);
      } else if (error.request) {
        throw new Error(error.msg);
      } else {
        throw new Error(error.msg);
      }
    });
};
export const GetCashierSettingsApi = () => {
  // Configure the GET request
  let config = {
    method: "get",
    url: `${baseUrl}/reports/cashiersettings`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  return axios
    .request(config)
    .then((response) => {
      return response.data; // Return the data part of the response
    })
    .catch((error) => {
      console.log("Error fetching cashier settings:", error.response);
      if (error.response && error.response.data.msg) {
        throw new Error(error.response.data.msg);
      } else if (error.response && error.response.data) {
        throw new Error(error.response);
      } else if (error.request) {
        throw new Error(error.msg);
      } else {
        throw new Error(error.msg);
      }
    });
};
export const GetCashierReportApi = (email, start, end) => {
  // Configure the GET request for the cashier report
  let config = {
    method: "get",
    url: `${baseUrl}/reports/cashierreport/${email}/${start}/${end}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  return axios
    .request(config)
    .then((response) => {
      return response.data; // Return the data part of the response
    })
    .catch((error) => {
      console.log("Error fetching cashier report:", error.response);
      if (error.response && error.response.data.msg) {
        throw new Error(error.response.data.msg);
      } else if (error.response && error.response.data) {
        throw new Error(error.response);
      } else if (error.request) {
        throw new Error(error.msg);
      } else {
        throw new Error(error.msg);
      }
    });
};
export const RequestPasswordResetApi = (id) => {
  let config = {
    method: "POST",
    maxBodyLength: Infinity,
    url: `${baseUrl}/users/passwordreset/${id}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  return axios
    .request(config)
    .then((response) => {
      console.log(JSON.stringify(response.data));
      return response;
    })
    .catch((error) => {
      console.log("error", error.response);
      if (error.response && error.response.data && error.response.data.msg) {
        throw new Error(error.response.data.msg);
      } else if (error.response && error.response.data) {
        throw new Error(error.response.data);
      } else if (error.request) {
        throw new Error(error.msg);
      } else {
        throw new Error(error.msg);
      }
    });
};

export const BulkUploadHMOPatientsApi = (formData) => {
  console.log("BulkUploadHMOPatientsApi formData:", formData);

  const config = {
    method: "post",
    maxBodyLength: Infinity,
    url: `${baseUrl}/patientsmanagement/bulkuploadhmopatients`,
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
    data: formData,
  };

  return axios
    .request(config)
    .then((response) => {
      console.log(
        "Bulk Upload HMO Patients Success:",
        JSON.stringify(response.data)
      );
      return response.data;
    })
    .catch((error) => {
      console.log("Error in Bulk Upload HMO Patients:", error.response);
      if (error.response && error.response.data && error.response.data.msg) {
        throw new Error(error.response.data.msg);
      } else if (error.response && error.response.data) {
        throw new Error(error.response.data);
      } else if (error.request) {
        throw new Error(error.message);
      } else {
        throw new Error(error.message);
      }
    });
};

export const CreateInsuranceApi = (payload) => {
  console.log("CreateInsuranceApi", payload);

  let data = JSON.stringify(payload);
  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: `${baseUrl}/settings/createinsurance`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    data: data,
  };

  return axios
    .request(config)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      console.log("Error in Create Insurance:", error.response);
      if (error.response && error.response.data.msg) {
        throw new Error(error.response.data.msg);
      } else if (error.response && error.response.data) {
        throw new Error(error.response);
      } else if (error.request) {
        throw new Error(error.msg);
      } else {
        throw new Error(error.msg);
      }
    });
};

export const UpdateInsuranceAPI = (payload, id) => {
  console.log("UpdateInsuranceAPI", payload, id);

  let data = JSON.stringify(payload);
  let config = {
    method: "PUT",
    maxBodyLength: Infinity,
    url: `${baseUrl}/settings/updateinsurance/${id}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    data: data,
  };

  return axios
    .request(config)
    .then((response) => {
      console.log(JSON.stringify(response.data));
      return response;
    })
    .catch((error) => {
      console.log("Error in Update Insurance:", error.response);
      if (error.response && error.response.data.msg) {
        throw new Error(error.response.data.msg);
      } else if (error.response && error.response.data) {
        throw new Error(error.response);
      } else if (error.request) {
        throw new Error(error.msg);
      } else {
        throw new Error(error.msg);
      }
    });
};

export const GetAllInsuranceApi = () => {
  // Configure the GET request
  let config = {
    method: "get",
    url: `${baseUrl}/settings/getallinsurance`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  return axios
    .request(config)
    .then((response) => {
      return response.data; // Return the data part of the response
    })
    .catch((error) => {
      console.log("Error fetching insurance:", error.response);
      if (error.response && error.response.data.msg) {
        throw new Error(error.response.data.msg);
      } else if (error.response && error.response.data) {
        throw new Error(error.response);
      } else if (error.request) {
        throw new Error(error.msg);
      } else {
        throw new Error(error.msg);
      }
    });
};
export const GetAllHMOPatientsApi = () => {
  let config = {
    method: "get",
    url: `${baseUrl}/patientsmanagement/getallhmopatients`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  return axios
    .request(config)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.log("Error fetching HMO Patients:", error.response);
      if (error.response && error.response.data && error.response.data.msg) {
        throw new Error(error.response.data.msg);
      } else if (error.response && error.response.data) {
        throw new Error(error.response.data);
      } else if (error.request) {
        throw new Error(error.message);
      } else {
        throw new Error(error.message);
      }
    });
};
export const DownloadHmoSampleFileApi = () => {
  let config = {
    method: "get",
    url: `${baseUrl}/downloads/downloadtemplate/hmobulkdownloadtemplate/`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    responseType: "blob",
  };

  return axios
    .request(config)
    .then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "HmoBulkUploadTemplate.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
      return response;
    })
    .catch((error) => {
      console.error(
        "Error downloading the HMO sample file:",
        error.response || error.message
      );
      throw new Error(
        error.response?.data?.msg || "Failed to download the HMO file."
      );
    });
};
export const GetPriceOfDrugApi = (id) => {
  const config = {
    method: "get",
    url: `${baseUrl}/pharmacy/getpriceofdrug/${id}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  return axios
    .request(config)
    .then((response) => response.data)
    .catch((error) => {
      console.log("Error fetching drug price:", error.response);
      if (error.response && error.response.data && error.response.data.msg) {
        throw new Error(error.response.data.msg);
      } else if (error.response && error.response.data) {
        throw new Error(error.response.data);
      } else if (error.request) {
        throw new Error(error.message);
      } else {
        throw new Error(error.message);
      }
    });
};
export const SearchPatientApi = (searchParam) => {
  const config = {
    method: "get",
    url: `${baseUrl}/patientsmanagement/searchpartient/${searchParam}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  return axios
    .request(config)
    .then((response) => response.data)
    .catch((error) => {
      console.error(
        "Error searching patient:",
        error.response || error.message
      );
      if (error.response && error.response.data && error.response.data.msg) {
        throw new Error(error.response.data.msg);
      } else if (error.response && error.response.data) {
        throw new Error(error.response.data);
      } else if (error.request) {
        throw new Error(error.message);
      } else {
        throw new Error(error.message);
      }
    });
};
export const AddTestComponentApi = (payload) => {
  console.log("AddTestComponentApi", payload);
  let data = JSON.stringify(payload);
  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: `${baseUrl}/settings/createtestcomponents`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    data: data,
  };

  return axios
    .request(config)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      console.log("error", error.response);
      if (error.response.data.msg) {
        throw new Error(error.response.data.msg);
      } else if (error.response.data) {
        throw new Error(error.response);
      } else if (error.request) {
        throw new Error(error.msg);
      } else {
        throw new Error(error.msg);
      }
    });
};

export const GetAllTestComponentApi = () => {
  let config = {
    method: "get",
    url: `${baseUrl}/settings/getalltestcomponent`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  return axios
    .request(config)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.log("Error fetching test components:", error.response);
      if (error.response && error.response.data.msg) {
        throw new Error(error.response.data.msg);
      } else if (error.response && error.response.data) {
        throw new Error(error.response);
      } else if (error.request) {
        throw new Error(error.msg);
      } else {
        throw new Error(error.msg);
      }
    });
};

export const UpdateTestComponentApi = (payload, id) => {
  let data = JSON.stringify(payload);
  let config = {
    method: "PUT",
    maxBodyLength: Infinity,
    url: `${baseUrl}/settings/updatetestcomponents/${id}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    data: data,
  };

  return axios
    .request(config)
    .then((response) => {
      console.log(JSON.stringify(response.data));
      return response;
    })
    .catch((error) => {
      console.log("error", error.response);
      if (error.response.data.msg) {
        throw new Error(error.response.data.msg);
      } else if (error.response.data) {
        throw new Error(error.response);
      } else if (error.request) {
        throw new Error(error.msg);
      } else {
        throw new Error(error.msg);
      }
    });
};
export const GetTestComponentByTestNameApi = (testName) => {
  let config = {
    method: "get",
    url: `${baseUrl}/settings/gettestcomponentbytestname/${testName}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  return axios
    .request(config)
    .then((response) => response.data)
    .catch((error) => {
      console.log(
        "Error fetching test component by test name:",
        error.response
      );
      if (error.response && error.response.data.msg) {
        throw new Error(error.response.data.msg);
      } else if (error.response && error.response.data) {
        throw new Error(error.response);
      } else if (error.request) {
        throw new Error(error.msg);
      } else {
        throw new Error(error.msg);
      }
    });
};
export const GroupReadAllPharmacyApi = () => {
  let config = {
    method: "get",
    maxBodyLength: Infinity,
    url: `${baseUrl}/pharmacy/groupreadallpharmacytransaction`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  return axios
    .request(config)
    .then((response) => {
      console.log(
        "Get All Group Transaction Success:",
        JSON.stringify(response.data)
      );
      return response.data;
    })
    .catch((error) => {
      console.log("Error in Get All Group Transaction:", error.response);
      if (error.response && error.response.data.msg) {
        throw new Error(error.response.data.msg);
      } else if (error.response && error.response.data) {
        throw new Error(error.response);
      } else if (error.request) {
        throw new Error(error.msg);
      } else {
        throw new Error(error.msg);
      }
    });
};
export const GroupReadAllPharmacyOptApi = (
  status,
  currentPage,
  postPerPage
) => {
  console.log("status change", status);
  let config = {
    method: "get",
    maxBodyLength: Infinity,
    url: `${baseUrl}/pharmacy/groupreadallpharmacytransactionoptimized?status=${status}&page=${currentPage}&size=${postPerPage}`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  return axios
    .request(config)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.log("Error in Get All Group Transaction:", error.response);
      if (error.response && error.response.data.msg) {
        throw new Error(error.response.data.msg);
      } else if (error.response && error.response.data) {
        throw new Error(error.response);
      } else if (error.request) {
        throw new Error(error.msg);
      } else {
        throw new Error(error.msg);
      }
    });
};
export const GroupReadAllFilteredPharmacyOptApi = (
  status,
  currentPage,
  postPerPage,
  key,
  value
) => {
  console.log("status change", status);
  let config = {
    method: "get",
    maxBodyLength: Infinity,
    url: `${baseUrl}/pharmacy/groupreadallpharmacytransactionoptimized?status=${status}&page=${currentPage}&size=${postPerPage}&${key}=${value}`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  return axios
    .request(config)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.log("Error in Get All Group Transaction:", error.response);
      if (error.response && error.response.data.msg) {
        throw new Error(error.response.data.msg);
      } else if (error.response && error.response.data) {
        throw new Error(error.response);
      } else if (error.request) {
        throw new Error(error.msg);
      } else {
        throw new Error(error.msg);
      }
    });
};
export const ReadPharmacyByOrderId = (orderId) => {
  let config = {
    method: "get",
    maxBodyLength: Infinity,
    url: `${baseUrl}/pharmacy/readpharmacybyorderid/${orderId}`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  return axios
    .request(config)
    .then((response) => {
      console.log(
        "Read Pharmacy by Order ID Success:",
        JSON.stringify(response.data)
      );
      return response.data;
    })
    .catch((error) => {
      console.log("Error in Read Pharmacy by Order ID:", error.response);
      if (error.response && error.response.data && error.response.data.msg) {
        throw new Error(error.response.data.msg);
      } else if (error.response && error.response.data) {
        throw new Error(error.response.data);
      } else if (error.request) {
        throw new Error(error.message);
      } else {
        throw new Error(error.message);
      }
    });
};
export const ConfirmPharmacyGroupOrder = (payload) => {
  let config = {
    method: "put",
    maxBodyLength: Infinity,
    url: `${baseUrl}/pharmacy/confirmpharmacygrouporder`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    data: payload,
  };

  return axios
    .request(config)
    .then((response) => {
      console.log(
        "Confirm Pharmacy Group Order Success:",
        JSON.stringify(response.data)
      );
      return response.data;
    })
    .catch((error) => {
      console.log("Error confirming pharmacy group order:", error.response);
      if (error.response && error.response.data.msg) {
        throw new Error(error.response.data.msg);
      } else if (error.response && error.response.data) {
        throw new Error(error.response.data);
      } else if (error.request) {
        throw new Error(error.message);
      } else {
        throw new Error(error.message);
      }
    });
};
export const SearchTestApi = (searchParam) => {
  const config = {
    method: "get",
    url: `${baseUrl}/settings/searchtest/${searchParam}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  return axios
    .request(config)
    .then((response) => response.data)
    .catch((error) => {
      console.error("Error searching test:", error.response || error.message);
      if (error.response && error.response.data && error.response.data.msg) {
        throw new Error(error.response.data.msg);
      } else if (error.response && error.response.data) {
        throw new Error(error.response.data);
      } else if (error.request) {
        throw new Error(error.message);
      } else {
        throw new Error(error.message);
      }
    });
};
export const ReadAllAuditApi = () => {
  let config = {
    method: "get",
    maxBodyLength: Infinity,
    url: `${baseUrl}/settings/readallaudit`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  return axios
    .request(config)
    .then((response) => {
      console.log("Read All Audit Success:", JSON.stringify(response.data));
      return response.data;
    })
    .catch((error) => {
      console.log("Error in Read All Audit:", error.response);
      if (error.response && error.response.data.msg) {
        throw new Error(error.response.data.msg);
      } else if (error.response && error.response.data) {
        throw new Error(error.response);
      } else if (error.request) {
        throw new Error(error.msg);
      } else {
        throw new Error(error.msg);
      }
    });
};

export const SearchProcedureApi = (searchParam) => {
  const config = {
    method: "get",
    url: `${baseUrl}/settings/searchprocedure/${searchParam}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  return axios
    .request(config)
    .then((response) => response.data)
    .catch((error) => {
      console.error(
        "Error searching procedure:",
        error.response || error.message
      );
      if (error.response && error.response.data && error.response.data.msg) {
        throw new Error(error.response.data.msg);
      } else if (error.response && error.response.data) {
        throw new Error(error.response.data);
      } else if (error.request) {
        throw new Error(error.message);
      } else {
        throw new Error(error.message);
      }
    });
};

export const SearchRadiologyApi = (searchParam) => {
  const config = {
    method: "get",
    url: `${baseUrl}/settings/searchradiology/${searchParam}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  return axios
    .request(config)
    .then((response) => response.data)
    .catch((error) => {
      console.error(
        "Error searching radiology:",
        error.response || error.message
      );
      if (error.response && error.response.data && error.response.data.msg) {
        throw new Error(error.response.data.msg);
      } else if (error.response && error.response.data) {
        throw new Error(error.response.data);
      } else if (error.request) {
        throw new Error(error.message);
      } else {
        throw new Error(error.message);
      }
    });
};
// In your Utils/ApiCalls.js

export const CreateDailyWardReportApi = (payload) => {
  console.log("CreateDailyWardReportApi", payload);

  const data = JSON.stringify(payload);
  const config = {
    method: "post",
    maxBodyLength: Infinity,
    // remove the duplicated /api/v1
    url: `${baseUrl}/nursingcare/createdailywardreport`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    data,
  };

  return axios
    .request(config)
    .then((response) => response)
    .catch((error) => {
      console.log("Error in Create Daily Ward Report:", error.response);
      if (error.response?.data?.msg) {
        throw new Error(error.response.data.msg);
      } else if (error.response?.data) {
        throw new Error(error.response);
      } else if (error.request) {
        throw new Error(error.message);
      } else {
        throw new Error(error.message);
      }
    });
};

export const UpdateDailyWardReportApi = (payload, id) => {
  console.log("UpdateDailyWardReportApi", payload, id);

  const data = JSON.stringify(payload);
  const config = {
    method: "put",
    maxBodyLength: Infinity,
    url: `${baseUrl}/nursingcare/updatedailywardreport/${id}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    data,
  };

  return axios
    .request(config)
    .then((response) => {
      console.log("Updated Daily Ward Report:", response.data);
      return response;
    })
    .catch((error) => {
      console.log("Error in Update Daily Ward Report:", error.response);
      if (error.response && error.response.data.msg) {
        throw new Error(error.response.data.msg);
      } else if (error.response && error.response.data) {
        throw new Error(error.response);
      } else if (error.request) {
        throw new Error(error.msg);
      } else {
        throw new Error(error.msg);
      }
    });
};
export const GetAllDailyWardReportsByWardApi = (wardId) => {
  const config = {
    method: "get",
    maxBodyLength: Infinity,
    url: `${baseUrl}/nursingcare/readalldailywardreportsByward/${wardId}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  return axios
    .request(config)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.log("Error fetching daily ward reports:", error.response);
      if (error.response && error.response.data.msg) {
        throw new Error(error.response.data.msg);
      } else if (error.response && error.response.data) {
        throw new Error(error.response);
      } else if (error.request) {
        throw new Error(error.msg);
      } else {
        throw new Error(error.msg);
      }
    });
};
export const EnterRadiologyResultApi = (payload, recordId) => {
  console.log("EnterRadiologyResultApi", payload, recordId);

  const data = JSON.stringify(payload);
  console.log("EnterRadiologyResultApi payload, id:", payload, recordId);
  const config = {
    method: "post",
    maxBodyLength: Infinity,
    url: `${baseUrl}/radiology/enterradiologyresult/${recordId}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    data,
  };

  return axios
    .request(config)
    .then((response) => {
      console.log("EnterRadiologyResultApi response:", response);
      return response;
    })
    .catch((error) => {
      console.log("Error in EnterRadiologyResultApi:", error.response);
      if (error.response && error.response.data?.msg) {
        throw new Error(error.response.data.msg);
      } else if (error.response && error.response.data) {
        throw new Error(error.response);
      } else if (error.request) {
        throw new Error(error.message);
      } else {
        throw new Error(error.message);
      }
    });
};
export const PlaceOrderWithoutConfirmationApi = async (payload, patientId) => {
  const data = JSON.stringify(payload);
  console.log("PlaceOrderWithoutConfirmationApi", patientId, payload);

  const config = {
    method: "post",
    maxBodyLength: Infinity,
    url: `${baseUrl}/pharmacy/pharmacyorderwithoutconfirmation/${patientId}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    data,
  };

  return axios
    .request(config)
    .then((response) => {
      console.log("Response data:", JSON.stringify(response.data));
      return response.data;
    })
    .catch((error) => {
      console.error(
        "Error placing order without confirmation:",
        error.response
      );

      if (error.response?.data?.msg) {
        throw new Error(error.response.data.msg);
      } else if (error.response?.data) {
        throw new Error(JSON.stringify(error.response.data));
      } else if (error.request) {
        throw new Error("No response received from the server.");
      } else {
        throw new Error(error.message);
      }
    });
};
export const ReadDrugPriceApi = async (payload, patientId) => {
  const data = JSON.stringify(payload);
  console.log("ReadDrugPriceApi", patientId, payload);

  const config = {
    method: "post",
    maxBodyLength: Infinity,
    url: `${baseUrl}/pharmacy/readdrugprice/${patientId}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    data,
  };

  return axios
    .request(config)
    .then((response) => {
      console.log("Drug price response:", JSON.stringify(response.data));
      return response.data;
    })
    .catch((error) => {
      console.error("Error reading drug price:", error.response);

      if (error.response?.data?.msg) {
        throw new Error(error.response.data.msg);
      } else if (error.response?.data) {
        throw new Error(JSON.stringify(error.response.data));
      } else if (error.request) {
        throw new Error("No response received from the server.");
      } else {
        throw new Error(error.message);
      }
    });
};
export const CreateNutritionApi = (payload, patientId) => {
  console.log("CreateNutritionApi payload:", payload);

  const data = JSON.stringify(payload);
  const config = {
    method: "post",
    maxBodyLength: Infinity,
    url: `${baseUrl}/nutrition/createnutritions/${patientId}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    data: data,
  };

  return axios
    .request(config)
    .then((response) => {
      console.log(
        "CreateNutritionApi response:",
        JSON.stringify(response.data)
      );
      return response;
    })
    .catch((error) => {
      console.error("CreateNutritionApi error:", error.response);
      if (error.response?.data?.msg) {
        throw new Error(error.response.data.msg);
      } else if (error.response?.data) {
        throw new Error(JSON.stringify(error.response.data));
      } else if (error.request) {
        throw new Error(error.message);
      } else {
        throw new Error(error.message);
      }
    });
};

export const UpdateNutritionApi = (payload, nutritionId) => {
  console.log("UpdateNutritionApi payload:", payload);

  const data = JSON.stringify(payload);
  const config = {
    method: "put",
    maxBodyLength: Infinity,
    url: `${baseUrl}/nutrition/updatenutritions/${nutritionId}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    data: data,
  };

  return axios
    .request(config)
    .then((response) => {
      console.log(
        "UpdateNutritionApi response:",
        JSON.stringify(response.data)
      );
      return response;
    })
    .catch((error) => {
      console.error("UpdateNutritionApi error:", error.response);
      if (error.response?.data?.msg) {
        throw new Error(error.response.data.msg);
      } else if (error.response?.data) {
        throw new Error(JSON.stringify(error.response.data));
      } else if (error.request) {
        throw new Error(error.message);
      } else {
        throw new Error(error.message);
      }
    });
};

export const ReadAllNutritionByPatientApi = (patientId) => {
  const config = {
    method: "get",
    maxBodyLength: Infinity,
    url: `${baseUrl}/nutrition/readallnutritionbypatient/${patientId}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  return axios
    .request(config)
    .then((response) => {
      console.log("ReadAllNutritionByPatientApi response:", response.data);
      return response.data;
    })
    .catch((error) => {
      console.error("ReadAllNutritionByPatientApi error:", error.response);
      if (error.response?.data?.msg) {
        throw new Error(error.response.data.msg);
      } else if (error.response?.data) {
        throw new Error(JSON.stringify(error.response.data));
      } else if (error.request) {
        throw new Error(error.message);
      } else {
        throw new Error(error.message);
      }
    });
};
export const AddPreoperativePrevisitFormAPI = (payload, id) => {
  const data = JSON.stringify(payload);

  const config = {
    method: "POST",
    maxBodyLength: Infinity,
    url: `${baseUrl}/theatreadmission/fillpreoperativeprevisitform/${id}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    data,
  };

  return axios
    .request(config)
    .then((response) => {
      console.log(JSON.stringify(response.data));
      return response;
    })
    .catch((error) => {
      console.log("error", error.response);
      if (error.response?.data?.msg) {
        throw new Error(error.response.data.msg);
      } else if (error.response?.data) {
        throw new Error(error.response);
      } else if (error.request) {
        throw new Error(error.msg);
      } else {
        throw new Error(error.msg);
      }
    });
};

export const EditPreoperativePrevisitFormAPI = (payload, id) => {
  const data = JSON.stringify(payload);

  const config = {
    method: "PUT",
    maxBodyLength: Infinity,
    url: `${baseUrl}/theatreadmission/updatepreoperativeprevisitform/${id}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    data,
  };

  return axios
    .request(config)
    .then((response) => {
      console.log(JSON.stringify(response.data));
      return response;
    })
    .catch((error) => {
      console.log("error", error.response);
      if (error.response?.data?.msg) {
        throw new Error(error.response.data.msg);
      } else if (error.response?.data) {
        throw new Error(error.response);
      } else if (error.request) {
        throw new Error(error.msg);
      } else {
        throw new Error(error.msg);
      }
    });
};
export const GetPreviousPreoperativePrevisitFormApi = (id) => {
  const config = {
    method: "get",
    url: `${baseUrl}/theatreadmission/readpreoperativeprevisitformbytheatreadmission/${id}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  return axios
    .request(config)
    .then((response) => {
      return response.data; // return the form data
    })
    .catch((error) => {
      console.log("Error fetching pre-visit form:", error.response);
      if (error.response?.data?.msg) {
        throw new Error(error.response.data.msg);
      } else if (error.response?.data) {
        throw new Error(error.response);
      } else if (error.request) {
        throw new Error(error.msg);
      } else {
        throw new Error(error.msg);
      }
    });
};
export const AddAnaesthesiaFormAPI = (payload, id) => {
  const data = JSON.stringify(payload);
  const config = {
    method: "POST",
    maxBodyLength: Infinity,
    url: `${baseUrl}/theatreadmission/fillanaethesiaform/${id}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    data,
  };

  return axios
    .request(config)
    .then((response) => {
      console.log("AddAnaesthesiaFormAPI response:", response.data);
      return response;
    })
    .catch((error) => {
      console.error("AddAnaesthesiaFormAPI error:", error.response);
      if (error.response?.data?.msg) {
        throw new Error(error.response.data.msg);
      } else if (error.response?.data) {
        throw new Error(error.response);
      } else if (error.request) {
        throw new Error(error.msg);
      } else {
        throw new Error(error.msg);
      }
    });
};

export const EditAnaesthesiaFormAPI = (payload, id) => {
  const data = JSON.stringify(payload);
  const config = {
    method: "PUT",
    maxBodyLength: Infinity,
    url: `${baseUrl}/theatreadmission/updateanaethesiaform/${id}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    data,
  };

  return axios
    .request(config)
    .then((response) => {
      console.log("EditAnaesthesiaFormAPI response:", response.data);
      return response;
    })
    .catch((error) => {
      console.error("EditAnaesthesiaFormAPI error:", error.response);
      if (error.response?.data?.msg) {
        throw new Error(error.response.data.msg);
      } else if (error.response?.data) {
        throw new Error(error.response);
      } else if (error.request) {
        throw new Error(error.msg);
      } else {
        throw new Error(error.msg);
      }
    });
};

export const GetPreviousAnaesthesiaFormApi = (id) => {
  const config = {
    method: "GET",
    url: `${baseUrl}/theatreadmission/readreadanaethesiaformbytheatreadmission/${id}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  return axios
    .request(config)
    .then((response) => response.data)
    .catch((error) => {
      console.error("GetPreviousAnaesthesiaFormApi error:", error.response);
      if (error.response?.data?.msg) {
        throw new Error(error.response.data.msg);
      } else if (error.response?.data) {
        throw new Error(error.response);
      } else if (error.request) {
        throw new Error(error.msg);
      } else {
        throw new Error(error.msg);
      }
    });
};
// --- Food Givens APIs ---

export const CreateFoodGivensAPI = (payload, anaesthesiaId) => {
  const data = JSON.stringify(payload);
  const config = {
    method: "POST",
    maxBodyLength: Infinity,
    url: `${baseUrl}/theatreadmission/createfoodgivens/${anaesthesiaId}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    data,
  };

  return axios
    .request(config)
    .then((response) => {
      console.log("CreateFoodGivensAPI response:", response.data);
      return response;
    })
    .catch((error) => {
      console.error("CreateFoodGivensAPI error:", error.response);
      if (error.response?.data?.msg) {
        throw new Error(error.response.data.msg);
      } else if (error.response?.data) {
        throw new Error(error.response);
      } else if (error.request) {
        throw new Error(error.msg);
      } else {
        throw new Error(error.msg);
      }
    });
};

export const UpdateFoodGivensAPI = (payload, foodGivenId) => {
  const data = JSON.stringify(payload);
  const config = {
    method: "PUT",
    maxBodyLength: Infinity,
    url: `${baseUrl}/theatreadmission/updatefoodgivens/${foodGivenId}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    data,
  };

  return axios
    .request(config)
    .then((response) => {
      console.log("UpdateFoodGivensAPI response:", response.data);
      return response;
    })
    .catch((error) => {
      console.error("UpdateFoodGivensAPI error:", error.response);
      if (error.response?.data?.msg) {
        throw new Error(error.response.data.msg);
      } else if (error.response?.data) {
        throw new Error(error.response);
      } else if (error.request) {
        throw new Error(error.msg);
      } else {
        throw new Error(error.msg);
      }
    });
};

export const GetAllFoodGivenByTheatreAdmissionApi = (anaesthesiaId) => {
  const config = {
    method: "GET",
    url: `${baseUrl}/theatreadmission/readallfoodgivenByTheatreAdmission/${anaesthesiaId}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  return axios
    .request(config)
    .then((response) => response.data)
    .catch((error) => {
      console.error(
        "GetAllFoodGivenByTheatreAdmissionApi error:",
        error.response
      );
      if (error.response?.data?.msg) {
        throw new Error(error.response.data.msg);
      } else if (error.response?.data) {
        throw new Error(error.response);
      } else if (error.request) {
        throw new Error(error.msg);
      } else {
        throw new Error(error.msg);
      }
    });
};
export const CreateDrugGivensAPI = (payload, anaesthesiaId) => {
  const data = JSON.stringify(payload);
  const config = {
    method: "POST",
    maxBodyLength: Infinity,
    url: `${baseUrl}/theatreadmission/createdruggivens/${anaesthesiaId}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    data,
  };

  return axios
    .request(config)
    .then((response) => {
      console.log("CreateDrugGivensAPI response:", response.data);
      return response;
    })
    .catch((error) => {
      console.error("CreateDrugGivensAPI error:", error.response);
      if (error.response?.data?.msg) {
        throw new Error(error.response.data.msg);
      } else if (error.response?.data) {
        throw new Error(error.response);
      } else if (error.request) {
        throw new Error(error.msg);
      } else {
        throw new Error(error.msg);
      }
    });
};

export const GetAllDrugGivenByTheatreAdmissionApi = (anaesthesiaId) => {
  const config = {
    method: "GET",
    url: `${baseUrl}/theatreadmission/readalldruggivenByTheatreAdmission/${anaesthesiaId}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  return axios
    .request(config)
    .then((response) => response.data)
    .catch((error) => {
      console.error(
        "GetAllDrugGivenByTheatreAdmissionApi error:",
        error.response
      );
      if (error.response?.data?.msg) {
        throw new Error(error.response.data.msg);
      } else if (error.response?.data) {
        throw new Error(error.response);
      } else if (error.request) {
        throw new Error(error.msg);
      } else {
        throw new Error(error.msg);
      }
    });
};

export const UpdateDrugGivensAPI = (payload, drugGivenId) => {
  const data = JSON.stringify(payload);
  const config = {
    method: "PUT",
    maxBodyLength: Infinity,
    url: `${baseUrl}/theatreadmission/updatedruggivens/${drugGivenId}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    data,
  };

  return axios
    .request(config)
    .then((response) => {
      console.log("UpdateDrugGivensAPI response:", response.data);
      return response;
    })
    .catch((error) => {
      console.error("UpdateDrugGivensAPI error:", error.response);
      if (error.response?.data?.msg) {
        throw new Error(error.response.data.msg);
      } else if (error.response?.data) {
        throw new Error(error.response);
      } else if (error.request) {
        throw new Error(error.msg);
      } else {
        throw new Error(error.msg);
      }
    });
};

export const FillOperationNoteAPI = (payload, theatreAdmissionId) => {
  const data = JSON.stringify(payload);
  const config = {
    method: "POST",
    maxBodyLength: Infinity,
    url: `${baseUrl}/theatreadmission/filloperationnote/${theatreAdmissionId}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    data,
  };

  return axios
    .request(config)
    .then((response) => {
      console.log("FillOperationNoteAPI response:", response.data);
      return response;
    })
    .catch((error) => {
      console.error("FillOperationNoteAPI error:", error.response);
      if (error.response?.data?.msg) {
        throw new Error(error.response.data.msg);
      } else if (error.response?.data) {
        throw new Error(error.response);
      } else if (error.request) {
        throw new Error(error.msg);
      } else {
        throw new Error(error.msg);
      }
    });
};

export const UpdateFillOperationNoteAPI = (payload, preOperationNoteId) => {
  const data = JSON.stringify(payload);
  const config = {
    method: "PUT",
    maxBodyLength: Infinity,
    url: `${baseUrl}/theatreadmission/updatefilloperationnote/${preOperationNoteId}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    data,
  };

  return axios
    .request(config)
    .then((response) => {
      console.log("UpdateFillOperationNoteAPI response:", response.data);
      return response;
    })
    .catch((error) => {
      console.error("UpdateFillOperationNoteAPI error:", error.response);
      if (error.response?.data?.msg) {
        throw new Error(error.response.data.msg);
      } else if (error.response?.data) {
        throw new Error(error.response);
      } else if (error.request) {
        throw new Error(error.msg);
      } else {
        throw new Error(error.msg);
      }
    });
};

export const GetOperationNoteByTheatreAdmissionApi = (theatreAdmissionId) => {
  const config = {
    method: "GET",
    url: `${baseUrl}/theatreadmission/readoperationnotebytheatreadmission/${theatreAdmissionId}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  return axios
    .request(config)
    .then((response) => response.data)
    .catch((error) => {
      console.error(
        "GetOperationNoteByTheatreAdmissionApi error:",
        error.response
      );
      if (error.response?.data?.msg) {
        throw new Error(error.response.data.msg);
      } else if (error.response?.data) {
        throw new Error(error.response);
      } else if (error.request) {
        throw new Error(error.msg);
      } else {
        throw new Error(error.msg);
      }
    });
};
export const AddPostAnaestheticRecoveryChartFormAPI = (payload, id) => {
  const data = JSON.stringify(payload);

  const config = {
    method: "POST",
    maxBodyLength: Infinity,
    url: `${baseUrl}/theatreadmission/fillpostanaetheticrecoverychartform/${id}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    data,
  };

  return axios
    .request(config)
    .then((response) => {
      console.log(JSON.stringify(response.data));
      return response;
    })
    .catch((error) => {
      console.log("error", error.response);
      if (error.response?.data?.msg) {
        throw new Error(error.response.data.msg);
      } else if (error.response?.data) {
        throw new Error(error.response);
      } else if (error.request) {
        throw new Error(error.msg);
      } else {
        throw new Error(error.msg);
      }
    });
};

export const EditPostAnaestheticRecoveryChartFormAPI = (payload, id) => {
  const data = JSON.stringify(payload);

  const config = {
    method: "PUT",
    maxBodyLength: Infinity,
    url: `${baseUrl}/theatreadmission/updatepostanaetheticrecoverychartform/${id}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    data,
  };

  return axios
    .request(config)
    .then((response) => {
      console.log(JSON.stringify(response.data));
      return response;
    })
    .catch((error) => {
      console.log("error", error.response);
      if (error.response?.data?.msg) {
        throw new Error(error.response.data.msg);
      } else if (error.response?.data) {
        throw new Error(error.response);
      } else if (error.request) {
        throw new Error(error.msg);
      } else {
        throw new Error(error.msg);
      }
    });
};

export const GetPostAnaestheticRecoveryChartFormAPI = (id) => {
  const config = {
    method: "GET",
    url: `${baseUrl}/theatreadmission/readonepostanaetheticrecoverychartformbytheatreadmission/${id}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  return axios
    .request(config)
    .then((response) => {
      return response.data; // return the form data
    })
    .catch((error) => {
      console.log(
        "Error fetching post-anaesthetic recovery chart form:",
        error.response
      );
      if (error.response?.data?.msg) {
        throw new Error(error.response.data.msg);
      } else if (error.response?.data) {
        throw new Error(error.response);
      } else if (error.request) {
        throw new Error(error.msg);
      } else {
        throw new Error(error.msg);
      }
    });
};
export const CreateVitalSignScoresAPI = (payload, recoveryChartId) => {
  const data = JSON.stringify(payload);
  const config = {
    method: "POST",
    maxBodyLength: Infinity,
    url: `${baseUrl}/theatreadmission/createvitalsignscores/${recoveryChartId}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    data,
  };

  return axios
    .request(config)
    .then((response) => {
      console.log("CreateVitalSignScoresAPI response:", response.data);
      return response;
    })
    .catch((error) => {
      console.error("CreateVitalSignScoresAPI error:", error.response);
      if (error.response?.data?.msg) {
        throw new Error(error.response.data.msg);
      } else if (error.response?.data) {
        throw new Error(error.response);
      } else if (error.request) {
        throw new Error(error.msg);
      } else {
        throw new Error(error.msg);
      }
    });
};

export const GetAllVitalSignScoresByTheatreAdmissionApi = (recoveryChartId) => {
  const config = {
    method: "GET",
    url: `${baseUrl}/theatreadmission/readallvitalsignscoreByTheatreAdmission/${recoveryChartId}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  return axios
    .request(config)
    .then((response) => response.data)
    .catch((error) => {
      console.error(
        "GetAllVitalSignScoresByTheatreAdmissionApi error:",
        error.response
      );
      if (error.response?.data?.msg) {
        throw new Error(error.response.data.msg);
      } else if (error.response?.data) {
        throw new Error(error.response);
      } else if (error.request) {
        throw new Error(error.msg);
      } else {
        throw new Error(error.msg);
      }
    });
};

export const UpdateVitalSignScoresAPI = (payload, vitalScoreId) => {
  const data = JSON.stringify(payload);
  const config = {
    method: "PUT",
    maxBodyLength: Infinity,
    url: `${baseUrl}/theatreadmission/updatevitalsignscores/${vitalScoreId}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    data,
  };

  return axios
    .request(config)
    .then((response) => {
      console.log("UpdateVitalSignScoresAPI response:", response.data);
      return response;
    })
    .catch((error) => {
      console.error("UpdateVitalSignScoresAPI error:", error.response);
      if (error.response?.data?.msg) {
        throw new Error(error.response.data.msg);
      } else if (error.response?.data) {
        throw new Error(error.response);
      } else if (error.request) {
        throw new Error(error.msg);
      } else {
        throw new Error(error.msg);
      }
    });
};
export const AddHistologyRequestFormAPI = (payload, admissionId) => {
  const data = JSON.stringify(payload);
  const config = {
    method: "POST",
    maxBodyLength: Infinity,
    url: `${baseUrl}/theatreadmission/fillhistologyrequestform/${admissionId}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    data,
  };

  return axios
    .request(config)
    .then((response) => {
      console.log("AddHistologyRequestFormAPI response:", response.data);
      return response;
    })
    .catch((error) => {
      console.error("AddHistologyRequestFormAPI error:", error.response);
      if (error.response?.data?.msg) {
        throw new Error(error.response.data.msg);
      } else if (error.response?.data) {
        throw new Error(error.response);
      } else if (error.request) {
        throw new Error(error.message);
      } else {
        throw new Error(error.message);
      }
    });
};

export const EditHistologyRequestFormAPI = (payload, formId) => {
  const data = JSON.stringify(payload);
  const config = {
    method: "PUT",
    maxBodyLength: Infinity,
    url: `${baseUrl}/theatreadmission/updatehistologyrequestform/${formId}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    data,
  };

  return axios
    .request(config)
    .then((response) => {
      console.log("EditHistologyRequestFormAPI response:", response.data);
      return response;
    })
    .catch((error) => {
      console.error("EditHistologyRequestFormAPI error:", error.response);
      if (error.response?.data?.msg) {
        throw new Error(error.response.data.msg);
      } else if (error.response?.data) {
        throw new Error(error.response);
      } else if (error.request) {
        throw new Error(error.message);
      } else {
        throw new Error(error.message);
      }
    });
};

export const GetHistologyRequestFormAPI = (admissionId) => {
  const config = {
    method: "GET",
    url: `${baseUrl}/theatreadmission/readhistologyrequestformytheatreadmission/${admissionId}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  return axios
    .request(config)
    .then((response) => response.data)
    .catch((error) => {
      console.error("GetHistologyRequestFormAPI error:", error.response);
      if (error.response?.data?.msg) {
        throw new Error(error.response.data.msg);
      } else if (error.response?.data) {
        throw new Error(error.response);
      } else if (error.request) {
        throw new Error(error.message);
      } else {
        throw new Error(error.message);
      }
    });
};

export const AddPricingModelApi = (payload) => {
  const data = JSON.stringify(payload);

  const config = {
    method: "post",
    maxBodyLength: Infinity,
    url: `${baseUrl}/settings/createpricingmodel`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    data,
  };

  return axios
    .request(config)
    .then((response) => {
      console.log("Pricing‑model created:", JSON.stringify(response.data));
      return response;
    })
    .catch((error) => {
      console.log("error", error.response);
      if (error.response?.data?.msg) {
        throw new Error(error.response.data.msg);
      } else if (error.response?.data) {
        throw new Error(error.response);
      } else if (error.request) {
        throw new Error(error.message);
      } else {
        throw new Error(error.message);
      }
    });
};

export const UpdatePricingModelApi = (payload, id) => {
  const data = JSON.stringify(payload);

  const config = {
    method: "put",
    maxBodyLength: Infinity,
    url: `${baseUrl}/settings/updatepricingmodel/${id}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    data,
  };

  return axios
    .request(config)
    .then((response) => {
      console.log("Pricing‑model updated:", JSON.stringify(response.data));
      return response;
    })
    .catch((error) => {
      console.log("error", error.response);
      if (error.response?.data?.msg) {
        throw new Error(error.response.data.msg);
      } else if (error.response?.data) {
        throw new Error(error.response);
      } else if (error.request) {
        throw new Error(error.message);
      } else {
        throw new Error(error.message);
      }
    });
};

export const GetPricingModelApi = () => {
  const config = {
    method: "get",
    url: `${baseUrl}/settings/getpricingmodel`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  return axios
    .request(config)
    .then((response) => response.data) // return only data payload
    .catch((error) => {
      console.log("error", error.response);
      if (error.response?.data?.msg) {
        throw new Error(error.response.data.msg);
      } else if (error.response?.data) {
        throw new Error(error.response);
      } else if (error.request) {
        throw new Error(error.message);
      } else {
        throw new Error(error.message);
      }
    });
};
export const AddOutreachMedicationApi = (payload) => {
  const data = JSON.stringify(payload);

  const config = {
    method: "post",
    maxBodyLength: Infinity,
    url: `${baseUrl}/settings/createoutreachmedication`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    data,
  };

  return axios
    .request(config)
    .then((response) => {
      console.log(
        "Outreach medication created:",
        JSON.stringify(response.data)
      );
      return response;
    })
    .catch((error) => {
      console.log("error", error.response);
      if (error.response?.data?.msg) {
        throw new Error(error.response.data.msg);
      } else if (error.response?.data) {
        throw new Error(error.response);
      } else if (error.request) {
        throw new Error(error.message);
      } else {
        throw new Error(error.message);
      }
    });
};

export const UpdateOutreachMedicationApi = (payload, id) => {
  const data = JSON.stringify(payload);

  const config = {
    method: "put",
    maxBodyLength: Infinity,
    url: `${baseUrl}/settings/updateoutreachmedication/${id}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    data,
  };

  return axios
    .request(config)
    .then((response) => {
      console.log(
        "Outreach medication updated:",
        JSON.stringify(response.data)
      );
      return response;
    })
    .catch((error) => {
      console.log("error", error.response);
      if (error.response?.data?.msg) {
        throw new Error(error.response.data.msg);
      } else if (error.response?.data) {
        throw new Error(error.response);
      } else if (error.request) {
        throw new Error(error.message);
      } else {
        throw new Error(error.message);
      }
    });
};

export const GetAllOutreachMedicationApi = () => {
  const config = {
    method: "get",
    url: `${baseUrl}/settings/getalloutreachmedication`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  return axios
    .request(config)
    .then((response) => response.data)
    .catch((error) => {
      console.log("error", error.response);
      if (error.response?.data?.msg) {
        throw new Error(error.response.data.msg);
      } else if (error.response?.data) {
        throw new Error(error.response);
      } else if (error.request) {
        throw new Error(error.message);
      } else {
        throw new Error(error.message);
      }
    });
};
