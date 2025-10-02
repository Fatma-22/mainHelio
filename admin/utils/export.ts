export function exportToCSV<T extends Record<string, any>>(data: T[], filename: string) {
    if (data.length === 0) {
        alert('لا توجد بيانات لتصديرها.');
        return;
    }

    const headers = Object.keys(data[0]);
    
    // Helper to format a value for CSV
    const formatValue = (value: any): string => {
        if (value === null || value === undefined) {
            return '';
        }
        let strValue = String(value);
        // If the value contains a comma, double quote, or newline, enclose it in double quotes
        if (/[",\n]/.test(strValue)) {
            // Escape existing double quotes by doubling them
            strValue = strValue.replace(/"/g, '""');
            return `"${strValue}"`;
        }
        return strValue;
    };

    // CSV content starts with the headers
    let csvContent = headers.join(',') + '\n';

    // Add each row of data
    data.forEach(item => {
        const row = headers.map(header => formatValue(item[header]));
        csvContent += row.join(',') + '\n';
    });

    // Create a Blob and trigger the download
    const blob = new Blob([`\uFEFF${csvContent}`], { type: 'text/csv;charset=utf-8;' }); // \uFEFF for BOM to handle Arabic in Excel
    const link = document.createElement('a');
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}
