import { getNonNull } from 'utils';

export function loadItem(sheetName: string, itemName: string, isRowIndexed: boolean) : Map<string, string> {
    const sheet = getNonNull(SpreadsheetApp.getActive().getSheetByName(sheetName));

    let data = sheet.getDataRange().getValues();

    // as of writing, the armor sheet is the only column indexed sheet
    if (!isRowIndexed) {
        const numRows = data.length;
        const numCols = data[0].length;

        let dataTransposed: any[][] = new Array(numCols);
        for (let i = 0; i < numCols; i++) {
            dataTransposed[i] = new Array(numRows);
        }

        for (let i = 0; i < numRows; i++) {
            for (let j = 0; j < numCols; j++) {
                dataTransposed[j][i] = data[i][j];
            }
        }

        data = dataTransposed;
    }

    let itemRowIndex: number = -1;
    for (let rowNumber = 1; rowNumber < data.length; rowNumber++) {
        if (data[rowNumber][0] === itemName) {
            itemRowIndex = rowNumber;
            break;
        }
    }

    if (itemRowIndex === -1) {
        throw 'Name not found';
    }

    const headerRow = data[0];
    const itemRow = data[itemRowIndex];
    const itemMap = new Map<string, string>();

    for (let col = 0; col < headerRow.length; col++) {
        itemMap.set(headerRow[col], itemRow[col]);
    }

    return itemMap;
}