import { AttributeStats } from "attribute_stats";

function sayHi(person: string) {
    //SpreadsheetApp.getUi().alert(`Hi ${person}`);
    let character:AttributeStats = new AttributeStats(person);
}

// @ts-ignore
global.calculateDamage = () => {
    //const attrStats = new AttributeStats();

    sayHi('Elmo');
};
