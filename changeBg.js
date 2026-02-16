function captureRows(){
    const regex = /^\dW\d{6}/;
    let all = document.getElementsByTagName("table")
    
    let validRows = []
    for(i=0; i < all.length; i++){
        let elem = all[i]
        if (
            regex.test(elem.textContent)
        ){
            validRows.push(elem)
        }
    }
    return validRows
}

let results = captureRows()

/*for(i=0; i < results.length; i++){
    results[i].style.backgroundColor = "red";
};*/

console.log(results[0])

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
        //etc...
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
            this.DOMRefer.childNodes[0].childNodes[0].childNodes[0].textContent += "NON RACK \n"
        }
    }

    checkExtraDim(){
        if (this.large >= 144 || this.width >= 144 || this.height >= 144){
            this.DOMRefer.childNodes[0].childNodes[0].childNodes[0].textContent += "EXTRADIM \n"
        }
    }
}

let crr;

for(i=0; i < results.length; i++){
    crr = new CargoReleaseRow(results[i])
    crr.checkNonRack()
    crr.checkExtraDim()
    console.log(crr)
};




