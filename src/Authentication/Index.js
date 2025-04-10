import { jwtDecode } from "jwt-decode"

let token = localStorage.getItem("token") 

const onlineUser = JSON.parse(localStorage.getItem("onlineUser"))

let role = onlineUser?.roleId


export const isAuthenticated = () => {
    if (localStorage.getItem("token")) {
        return true;
    } else {
        return false;
    }
};

export const isActive = (history, path) => {
    let activeScreen = history.pathname === path ? true :  false
    return activeScreen;
}



export const isAdmin = () => {
   
    if (role === "Admin") {
        return true
    } else {
        return false
    }

};

export const isOutPatientParent = () => {
    let roles = ["1","20", "6", "4", "7", "8","9","10","15","16","17","18","13","14"]

    let result = roles.includes(role)

    if (result) {
        return true
    } else {
        return false
    }

};
export const isOutPatient = () => {
    let roles = ["1","20", "6", "4", "7", "8","9","10","15","16","17","18"]

    let result = roles.includes(role)

    if (result) {
        return true
    } else {
        return false
    }

};
export const isInPatient = () => {
    let roles = ["1","20", "6", "4", "7", "8","9","10","15","16","17","18"]

    let result = roles.includes(role)

    if (result) {
        return true
    } else {
        return false
    }

};
export const isLabStaff = () => {
    let roles = ["1","20", "6", "4","5","3", "7", "8","9","10","19"]

    let result = roles.includes(role)

    if (result) {
        return true
    } else {
        return false
    }

};
export const isRadiologyStaff = () => {
    let roles = ["1","20", "6", "4","5","3", "7", "8","9","10","19"]

    let result = roles.includes(role)

    if (result) {
        return true
    } else {
        return false
    }

};
export const isScheduleAppointmentStaff = () => {
    let roles = ["1","20", "6", "4", "7","13","14", "8","9","10","19"]

    let result = roles.includes(role)

    if (result) {
        return true
    } else {
        return false
    }

};
export const isScheduleProcedureStaff = () => {
    let roles = ["1","20", "6", "4","5","3", "7", "8","9","10","19"]

    let result = roles.includes(role)

    if (result) {
        return true
    } else {
        return false
    }

};
export const isPharmacyStaff = () => {
    let roles = ["1","20", "2","5","3", "6", "11"]

    let result = roles.includes(role)

    if (result) {
        return true
    } else {
        return false
    }

};
export const isInventoryStaff = () => {
    let roles = ["1","20", "2", "11"]

    let result = roles.includes(role)

    if (result) {
        return true
    } else {
        return false
    }

};
export const isBillingStaff = () => {
    let roles = ["1","20", "3", "5","12"]

    let result = roles.includes(role)

    if (result) {
        return true
    } else {
        return false
    }

};
export const isBillingStaffHOD = () => {
    let roles = ["1", "3",]

    let result = roles.includes(role)

    if (result) {
        return true
    } else {
        return false
    }

};
export const isRecordStaff = () => {
    let roles = ["1"]

    let result = roles.includes(role)

    if (result) {
        return true
    } else {
        return false
    }

};
export const isClinicalReport = () => {
    let roles = ["1"]

    // "6", "4","7","20","8","9","14","3","5","12"

    let result = roles.includes(role)

    if (result) {
        return true
    } else {
        return false
    }

};
export const isUserManagerStaff = () => {
    let roles = ["1","20","19"]

    let result = roles.includes(role)

    if (result) {
        return true
    } else {
        return false
    }

};


export const isTheatreStaff = () => {
    let roles = ["1","20", "6", "4", "7", "8","9","10","15","16","17","18"]

    let result = roles.includes(role)

    if (result) {
        return true
    } else {
        return false
    }

};

