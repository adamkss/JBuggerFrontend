export const getRolesFromInitialRole = (role) => {
    switch (role) {
        case "ROLE_ADM":
            return {
                isAdmin: true,
                isPM: true,
                isTM: true,
                isDev: true,
                isTester: true
            }
        case "ROLE_PM": {
            return {
                isAdmin: false,
                isPM: true,
                isTM: true,
                isDev: true,
                isTester: true
            }
        }
        case "ROLE_TM": {
            return {
                isAdmin: false,
                isPM: false,
                isTM: true,
                isDev: true,
                isTester: true
            }
        }
        case "ROLE_DEV": {
            return {
                isAdmin: false,
                isPM: false,
                isTM: false,
                isDev: true,
                isTester: true
            }
        }
        case "ROLE_TEST": {
            return {
                isAdmin: false,
                isPM: false,
                isTM: false,
                isDev: false,
                isTester: true
            }
        }
    }
}