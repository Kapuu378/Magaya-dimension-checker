function validateRow(row){
    const regex = /^\dW\d{6}/;
    return regex.test(row.textContent)
}

class CargoReleaseRow{
    constructor(
        DOMRefer
    ){
        this.DOMRefer = DOMRefer;
        this.fatherCR = null
        this.pieces = this.getPieces(this.DOMRefer);
        this.warehouse = this.getWarehouse(this.DOMRefer);
        this.dimensionsContent = this.getDimensionsContent(this.DOMRefer);
        [this.large, this.width, this.height] = this.parseDimensions(this.dimensionsContent);
        this.weightContent = this.getWeightContent(this.DOMRefer)
        this.weightUnit = this.getWeightUnits(this.weightContent)
        this.weight = this.parseWeight(this.weightContent)
        this.isNonRack = this.checkNonRack()
        this.isExtradimension = this.checkExtraDim()
        this.daysDiff = null
    }

    __setFather__(father){
        this.fatherCR = father
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

    caculateDaysDiff(){
        this.daysDiff = Math.ceil((this.fatherCR.cargoReleaseDate - this.arrivalDate) / (1000 * 60 * 60 * 24))
    }
}

class CargoRelease{
    constructor(){
        this.rows = this.getCargoReleaseRows()
        this.cargoReleaseDate = this.getCargoReleaseDate()
        this.warehouseArrivals = this.getWarehouseArrivals()
        this.setArrivalToWarehouse = this.setArrivalToWarehouse()
        this.markNonRack()
        this.markExtradimension()

        // Sets a reference to this object onto every CR Row.
        this.setReferenceToRows()

        // Calculate days diff
        this.calculateAllDaysDiff()
    }

    setReferenceToRows(){
        this.rows.map(r => r.__setFather__(this))
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

    getWarehouseArrivals(){
        let all = document.querySelectorAll("tr")
        console.log(all)
        return Array.from(all).filter(e => e.textContent.includes("Cargo Arrived at Warehouse") && e.childNodes.length == 5)
    }

    markNonRack(){
        for(let i = 0; i < this.rows.length; i++){
            let row = this.rows[i]
            if (row.isNonRack){
                row.DOMRefer.childNodes[0].childNodes[0].childNodes[0].innerHTML += '<span style="font-weight: bold; color: green;">Non Rack</span> \n'
                row.DOMRefer.style.backgroundColor = "#e6f9e6";
            }
        }
    }

    markExtradimension(){
        for(let i = 0; i < this.rows.length; i++){
            let row = this.rows[i]
            if (row.isExtradimension){
                row.DOMRefer.childNodes[0].childNodes[0].childNodes[0].innerHTML += '<span style="font-weight: bold; color: red;">Extradim</span> \n'
                row.DOMRefer.style.backgroundColor = "#e6f9e6";
            }
        }
    }

    markDaysDiff(){
        for(let i = 0; i < this.rows.length; i++){
            let row = this.rows[i]
            if (row.daysDiff){
                row.DOMRefer.childNodes[0].childNodes[0].childNodes[4].innerHTML += `<span style="font-weight: bold; color: black;">${row.daysDiff}</span> \n`
            }
        }
    }

    setArrivalToWarehouse(){
        for(let i = 0; i < this.rows.length; i++){
            let row = this.rows[i]
            let warehouseNum = row.warehouse
            let match = this.warehouseArrivals.find(e => e.textContent.includes(warehouseNum))
            if (match){
                row.arrivalDate = new Date(match.childNodes[0].textContent)
            }
        }
    }

    calculateAllDaysDiff(){
        this.rows.map(r => r.caculateDaysDiff())
    }
}

let CR = new CargoRelease
console.log(CR)
CR.markDaysDiff()




