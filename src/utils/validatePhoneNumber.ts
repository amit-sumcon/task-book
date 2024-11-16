import { parsePhoneNumber, CountryCode } from "libphonenumber-js";

export const isMobileNumberValid = (phone: string, country: CountryCode): boolean => {
    try {
        const phoneNumber = parsePhoneNumber(phone, country);
        return phoneNumber.isValid();
    } catch {
        return false;
    }
};
