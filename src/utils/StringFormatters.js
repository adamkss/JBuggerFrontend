const ToUpperInitials = function (inputString) {
    let newString = "";
    const parts = inputString.split(" ");
    parts.forEach(part => {
        newString += part.charAt(0).toUpperCase() + part.toLowerCase().substr(1) + " "
    })
    return newString;
}

const ToNiceBugStatus = function (inputString) {
    return ToUpperInitials(inputString.replace("_", " "));
}

export default {
    ToNiceBugStatus,
    ToUpperInitials
};