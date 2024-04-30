export const utilService = {
    makeId,
    saveToSessionStorage,
    getTimeSinceCreation,
    timePassed,
    getDay,
    getMonth
}

function makeId(length: number = 5): string {
    let txt: string = '';
    const possible: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i: number = 0; i < length; i++) {
        txt += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return txt;
}

function saveToSessionStorage(key: string, val: any): void {
    sessionStorage[key] = JSON.stringify(val)
}

function getTimeSinceCreation(timestamp: number): string {
    const now = new Date().getTime();
    const difference = now - timestamp;

    const seconds = Math.floor(difference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 2) {
        const date = new Date(timestamp);
        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        };
        return date.toLocaleDateString(undefined, options);
    } else if (days > 0) {
        return `${days} day${days > 1 ? 's' : ''} ago`;
    } else if (hours > 0) {
        return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else if (minutes > 0) {
        return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else {
        return `${seconds} second${seconds > 1 ? 's' : ''} ago`;
    }
}

function timePassed(timestamp: number): string {
    const currentTimestamp: Date = new Date();
    const timeDifference: number = currentTimestamp.getTime() - timestamp;

    const minutes: number = timeDifference / (1000 * 60);
    if (minutes < 60) {
        return `${Math.round(minutes)}m`;
    }

    const hours: number = minutes / 60;
    if (hours < 24) {
        return `${Math.round(hours)}h`;
    }

    const days: number = hours / 24;
    if (days < 7) {
        return `${Math.round(days)}d`;
    }

    const weeks: number = days / 7;
    return `${Math.round(weeks)}w`;
}

function getDay(timestamp: number): string {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', { day: '2-digit' });
}

function getMonth(timestamp: number): string {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', { month: 'short' });
}


