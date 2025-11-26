const exportToJson = (object)=>{
    let filename = "export.json";
    let contentType = "application/json;charset=utf-8;";
    object = object.map(card =>{ return {front:card.front, back:card.back}});
    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
        let blob = new Blob([decodeURIComponent(encodeURI(JSON.stringify(object)))], { type: contentType });
        navigator.msSaveOrOpenBlob(blob, filename);
    } else {
        let a = document.createElement('a');
        a.download = filename;
        a.href = 'data:' + contentType + ',' + encodeURIComponent(JSON.stringify(object));
        a.target = '_blank';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }
};

export {exportToJson,}