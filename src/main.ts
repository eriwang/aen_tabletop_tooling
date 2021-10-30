function sayHi(person: string) {
    SpreadsheetApp.getUi().alert(`Hi ${person}`);
}

function calculateDamage() {
    sayHi('Elmo');
}
