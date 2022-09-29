const fs = require('fs'); 
const { parse } = require('csv-parse');

const { filename} = require('../config')


class Statistics {
    constructor() {
        this.csvData = []; 
        this.formattedData = []; 
        this.averageList = {},
        this.mostPopularBrand = {}
    }

     readCsvFile(filePath, delimiter) {

       return new Promise((resolve) => {
        fs.createReadStream(filePath) 
        .pipe(parse({delimiter , trim : true , }))
        .on('data', (csvrow) => {
            this.csvData.push(csvrow);
        })
            .on('end', () => {
              
                this.formatCSVData(delimiter)
                resolve()
        })
        .on('error', (err) => {
                console.log(err)
        });

         
     })
    }

    writeCSVFile(data, type) {
       
        const fileData = Object.keys(data).map(row => {
            return `${row},${data[row]}`; 
        })

        fs.writeFile(type == 'first'? `./0_${filename}.csv` :`./1_${filename}.csv` , fileData.join("\r\n"), (err) => {
    console.log(err || "file created successfully");
});
    }

    formatCSVData(delimiter) {
       
        this.formattedData = this.csvData.map(record => {
            const row = record[0];
            const cols = row.split(delimiter);
            return {
                id: cols[0],
                area: cols[1],
                name: cols[2],
                quantity: +cols[3], // casting
                brand: cols[4]
            }
        }); 
        
    }

    calculateAverage() {
       
        const countList = {}; 
       
        // count each order
        this.formattedData.forEach(order => {
            if (!countList[order.name])
                countList[order.name] = 0; 
             countList[order.name]+= order.quantity; 
        })

        // calculate average for each order 
        Object.keys(countList).forEach(orderName => {
            const avg = countList[orderName] / this.formattedData.length; 
            this.averageList[orderName] = avg; 
        })
    } 

    calculatePopularBrands() {
        const allProducts = {}; 
         
        this.formattedData.forEach(order => {
            if (!allProducts[order.name])
                allProducts[order.name] = []; 
            allProducts[order.name].push(order.brand)
            
        })
        Object.keys(allProducts).forEach(product => {
            const countBrands = {}; 
            allProducts[product].forEach(eachBrand => {
                if (!countBrands[eachBrand])
                    countBrands[eachBrand] = 0; 
                countBrands[eachBrand]++; 
            })
            const freqBrands = this.highFreqBrands(countBrands); 
            this.mostPopularBrand[product] = freqBrands.name; 
        })
      
    }

    highFreqBrands(countBrands) {
        const brand = {
            count: 0,
            name: ''
        }; 
        Object.keys(countBrands).forEach(eachBrand => {
            if (brand.count < countBrands[eachBrand])
            {
                brand.count = countBrands[eachBrand]; 
                brand.name = eachBrand; 
            }
        })
        return brand; 
    }



}

module.exports = new Statistics(); 