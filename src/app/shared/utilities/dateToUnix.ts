export const toUnixTime = (date: Date) => {
    return Math.floor(date.getTime() / 1000);
}