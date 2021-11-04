import { AttributeStats } from "attribute_stats";

function sayHi(person: string) {
    //SpreadsheetApp.getUi().alert(`Hi ${person}`);
    let character:AttributeStats = new AttributeStats(person);
}

function calculateDamage() {
    sayHi('Elmo Elless');
}
