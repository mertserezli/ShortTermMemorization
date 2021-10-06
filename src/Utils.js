import firebase from 'firebase/app';

function initFirebase(){
    if (!firebase.apps.length) {
        firebase.initializeApp({
            apiKey: "AIzaSyDCyFHMeMgLltZbqS37Whh5vMlLM2UCllI",
            authDomain: "shorttermmemorization.firebaseapp.com",
            databaseURL: "https://shorttermmemorization.firebaseio.com",
            projectId: "shorttermmemorization",
            storageBucket: "shorttermmemorization.appspot.com",
            messagingSenderId: "440994357739",
            appId: "1:440994357739:web:db860414b9b1b007e479ae",
            measurementId: "G-0KFM767G9X"
        });
    }
}

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

const FirebaseDateToDate = (d)=>{
    try {
        return d.toDate()
    }catch (e) {
        return d
    }
};

export {exportToJson, FirebaseDateToDate, initFirebase}