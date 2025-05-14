// Set max attribute to today's date
const today = new Date().toISOString().split('T')[0];
document.getElementById('birthdate').setAttribute('max', today);

document.getElementById('calculateButton').addEventListener('click', function() {
    const birthdate = document.getElementById('birthdate').value;
    if (!birthdate) {
        document.getElementById('result').innerText = "Please select a valid date.";
        return;
    }
    const birthDate = new Date(birthdate);
    const today = new Date();
    let ageYears = today.getFullYear() - birthDate.getFullYear();
    let ageMonths = today.getMonth() - birthDate.getMonth();
    let ageDays = today.getDate() - birthDate.getDate();

    if (ageDays < 0) {
        ageDays += new Date(today.getFullYear(), today.getMonth(), 0).getDate();
        ageMonths--;
    }
    if (ageMonths < 0) {
        ageMonths += 12;
        ageYears--;
    }

    document.getElementById('result').innerText = `You are ${ageYears} years, ${ageMonths} months, and ${ageDays} days old.`;

    const nextBirthday = new Date(birthDate);
    nextBirthday.setFullYear(today.getFullYear());
    if (today > nextBirthday) {
        nextBirthday.setFullYear(today.getFullYear() + 1);
    }
    const countdownDays = Math.ceil((nextBirthday - today) / (1000 * 60 * 60 * 24));
    document.getElementById('countdown').innerText = `Your next birthday is in ${countdownDays} days.`;
});
