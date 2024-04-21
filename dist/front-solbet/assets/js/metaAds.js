function convertirMetaAd( data, callBack) {
    console.log("convertirMetaAd")
    console.log(data);
    try {
        window.uetq=window.uetq||[];
        window.uetq.push('set', { 'pid': {
        'em': data.em,
        'ph': data.ph
        }});
    } catch (error) {
        console.log(error)
    }

}
