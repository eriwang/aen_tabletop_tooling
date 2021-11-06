import { AttributeStats } from 'attribute_stats';

function sayHi(person: string) {
    // SpreadsheetApp.getUi().alert(`Hi ${person}`);
    let character = AttributeStats.buildAttributesUnit(person);
}

// @ts-ignore
global.calculateDamage = () => {
    // const attrStats = new AttributeStats();

    sayHi('Elmo Elless');
};
