import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CsvParserService {
  parse(csvText: string): any[] {
    const lines = csvText.split('\n');
    const headers = lines[0].split(',').map(header => header.trim());

    return lines
      .slice(1)
      .filter(line => line.trim() !== '')
      .map(line => {
        const values = this.splitCsvLine(line);
        const obj: any = {};
        headers.forEach((header, index) => {
          let value = values[index] ? values[index].trim() : '';
          // Convert boolean values to strings 'TRUE' or 'FALSE'
          if (value.toUpperCase() === 'TRUE') value = 'TRUE';
          if (value.toUpperCase() === 'FALSE') value = 'FALSE';
          obj[header] = value;
        });
        return obj;
      });
  }

  private splitCsvLine(line: string): string[] {
    const values: string[] = [];
    let currentValue = '';
    let insideQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];

      if (char === '"') {
        insideQuotes = !insideQuotes;
      } else if (char === ',' && !insideQuotes) {
        values.push(currentValue);
        currentValue = '';
      } else {
        currentValue += char;
      }
    }
    values.push(currentValue);
    return values;
  }
}
