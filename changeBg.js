function validateRow(row){
    const regex = /^\dW\d{6}/;
    return regex.test(row.textContent)
}

class CargoReleaseRow{
    constructor(
        DOMRefer
    ){
        this.DOMRefer = DOMRefer;
        this.pieces = this.getPieces(this.DOMRefer);
        this.warehouse = this.getWarehouse(this.DOMRefer);
        this.dimensionsContent = this.getDimensionsContent(this.DOMRefer);
        [this.large, this.width, this.height] = this.parseDimensions(this.dimensionsContent);
        this.weightContent = this.getWeightContent(this.DOMRefer)
        this.weightUnit = this.getWeightUnits(this.weightContent)
        this.weight = this.parseWeight(this.weightContent)
        this.isNonRack = this.checkNonRack()
        this.isExtradimension = this.checkExtraDim()
    }

    getPieces(DOMRefer){
        return Number(DOMRefer.childNodes[0].childNodes[0].childNodes[1].textContent)
    }

    getWarehouse(DOMRefer){
        return String(DOMRefer.childNodes[0].childNodes[0].childNodes[2].textContent)
    }

    getDimensionsContent(DOMRefer){
        return String(DOMRefer.childNodes[0].childNodes[0].childNodes[3].textContent)
    }

    getWeightContent(DOMRefer){
        return DOMRefer.childNodes[0].childNodes[0].childNodes[6].textContent
    }

    getWeightUnits(weightContent) {
        if (weightContent.includes("kg")) {
            return "kg";
        } 
        else if (weightContent.includes("lb")) {
            return "lb";
        }
        return null;
    }

    parseWeight(weightContent){
        return Number(weightContent.split(this.weightUnit)[0])
    }

    parseDimensions(dimensionsContent){
        const dimensionsContentCleaned = dimensionsContent.replace("in", "");
        const dimensions = dimensionsContentCleaned.split("x").map(Number);

        return [dimensions[0], dimensions[1], dimensions[2]]
    }

    checkNonRack(){
        if (this.large >= 92 || this.width >= 92 || this.height >= 84){
            return true
        }
        else {
            return false
        }
    }

    checkExtraDim(){
        if (this.large >= 144 || this.width >= 144 || this.height >= 144){
            return true
        } else {
            return false
        }
    }
}

class CargoRelease{
    constructor(){
        this.rows = this.getCargoReleaseRows()
        this.cargoReleaseDate = this.getCargoReleaseDate()
        this.setNonRackMarks()
        this.setExtradimension()
    }

    getCargoReleaseRows(){
        let all = Array.from(document.getElementsByTagName("table"))
        let validRows = all.filter(validateRow)
        let crRows = validRows.map(x => new CargoReleaseRow(x))
        return crRows
    }

    getCargoReleaseDate(){
        let dateContent = document.querySelector('body > table > tbody > tr:nth-child(1) > td > table > tbody > tr > td > div > table:nth-child(1) > tbody > tr:nth-child(3) > td:nth-child(2) > div').textContent
        return new Date(dateContent);
    }

    setNonRackMarks(){
        for(let i = 0; i < this.rows.length; i++){
            let row = this.rows[i]
            if (row.isNonRack){
                row.DOMRefer.childNodes[0].childNodes[0].childNodes[0].innerHTML += '<span style="font-weight: bold; color: green;">Non Rack</span> \n'
                row.DOMRefer.style.backgroundColor = "#e6f9e6";
            }
        }
    }

    setExtradimension(){
        for(let i = 0; i < this.rows.length; i++){
            let row = this.rows[i]
            if (row.isExtradimension){
                row.DOMRefer.childNodes[0].childNodes[0].childNodes[0].innerHTML += '<span style="font-weight: bold; color: red;">Extradim</span> \n'
                row.DOMRefer.style.backgroundColor = "#e6f9e6";
            }
        }
    }
}

let results = new CargoRelease
console.log(results)
let crr;

/*function addMarks(cargoReleaseRow){

    if (cargoReleaseRow.isNonRack){
        cargoReleaseRow.DOMRefer.childNodes[0].childNodes[0].childNodes[0].innerHTML += '<span style="font-weight: bold; color: green;">Non Rack</span> \n'
        cargoReleaseRow.DOMRefer.style.backgroundColor = "#e6f9e6";
    }
    if (cargoReleaseRow.isExtradimension){
        cargoReleaseRow.DOMRefer.childNodes[0].childNodes[0].childNodes[0].innerHTML += '<span style="font-weight: bold; color: red;">Extradim</span> \n'
    }
}

for(i=0; i < results.length; i++){
    crr = new CargoReleaseRow(results[i])
    addMarks(crr)
    console.log(crr)
};*/




