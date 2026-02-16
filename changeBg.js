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
// What we look for is this attribute results[1].childNodes[0].childNodes[0]
console.log(results[1].childNodes[0].childNodes[0])

/*for(i=0; i < results.length; i++){
    results[i].style.backgroundColor = "red";
};*/

/*class CargoReleaseRow{
    constructor(
        DOMRefer
    ){
        this.DOMRefer = DOMRefer
        this.pieces = this.get_pieces()
        //etc...
    }

    calculate_individual_weight(this) {
        return this.weight / this.pieces
    }

    check_nonrackeable(this){
        // do stuff
    }
}*/



