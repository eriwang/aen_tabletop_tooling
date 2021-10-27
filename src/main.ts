const sayHi = (person: string) => {
    SpreadsheetApp.getUi().alert(`Hi ${person}`);
};

const calculateDamage = () => {
    sayHi('Elmo');
};
