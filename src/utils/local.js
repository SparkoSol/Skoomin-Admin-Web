export function getUser() {
    const token = localStorage.getItem('auth_token');
    return token ? JSON.parse(localStorage.getItem('auth_user')) : null;
}

export function getDays(item) {
    switch (item) {
        case 0:
            return 'Sunday'
        case 1:
            return 'Monday'
        case 2:
            return 'Tuesday'
        case 3:
            return 'Wednesday'
        case 4:
            return 'Thursday'
        case 5:
            return 'Friday'
        case 6:
            return 'Saturday'
        default:
            return 'Invalid Day'
    }
}

export function resolveInitial(item) {
    if (item) {
        const names = item.split(" ");
        let initials = "";
        for (let i = 0; i < names.length; i++) {
            if (i < 2 && names[i] !== "") {
                initials += names[i][0];
            }
        }
        return initials.toUpperCase();
    } else {
        return "--";
    }
}
