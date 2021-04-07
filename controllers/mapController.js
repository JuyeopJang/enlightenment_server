const axios = require('axios')
const dotenv = require('dotenv');
dotenv.config()
const convert = require('xml-js');
const request = require('request');

module.exports = {
    getElections: async (req, res) => {
        const electionCodeUrl = `http://apis.data.go.kr/9760000/CommonCodeService/getCommonSgCodeList?ServiceKey=${process.env.SERVICEKEY}&numOfRows=100`
        axios.get(electionCodeUrl)
        .then(elections => {
            const electionsJson = JSON.parse(
                    convert.xml2json(elections.data, {
                    compact: true,
                    spaces: 4
                })
            )
            res.json({
                elections: electionsJson.response.body.items.item
            })
        })
    },
    getPlaces: async (req, res) => {
        // let encodedServiceKey = encodeURIComponent('ServiceKey');
        // let encodedSgId = encodeURIComponent('sgId');
        // let encodedSdName = encodeURIComponent('sdName');
        // let encodedWiwName = encodeURIComponent('wiwName');
        let { sgId, sdName, wiwName } = req.body
        // if (sgId && sdName && wiwName) {
        //     sgId = encodeURIComponent(sgId)
        //     sdName = encodeURIComponent(sdName);
        //     wiwName = encodeURIComponent(wiwName);
        // }
        // const electionPlacesUrl = `
        // http://apis.data.go.kr/9760000/PolplcInfoInqireService2/getPrePolplcOtlnmapTrnsportInfoInqire
        // ?${encodedServiceKey}=${process.env.SERVICEKEY}&${encodedSgId}=${sgId}&${encodedSdName}=${sdName}&${encodedWiwName}=${wiwName}
        // `
        // axios.get(electionPlacesUrl)
        // .then(places => {
        //     res.setHeader('Access-Control-Allow-Origin', '*')
        //     res.send(places.data)
        // })
        // .catch(err => {
        //     if (err) console.log(err)
        // })
        
        let url = 'http://apis.data.go.kr/9760000/PolplcInfoInqireService2/getPrePolplcOtlnmapTrnsportInfoInqire';
        let queryParams = '?' + encodeURIComponent('ServiceKey') + '=' + process.env.SERVICEKEY; /* Service Key*/
        // queryParams += '&' + encodeURIComponent('pageNo') + '=' + encodeURIComponent('1'); /* */
        // queryParams += '&' + encodeURIComponent('numOfRows') + '=' + encodeURIComponent('10'); /* */
        queryParams += '&' + encodeURIComponent('sgId') + '=' + encodeURIComponent(sgId); /* */
        queryParams += '&' + encodeURIComponent('sdName') + '=' + encodeURIComponent(sdName); /* */
        queryParams += '&' + encodeURIComponent('wiwName') + '=' + encodeURIComponent(wiwName); /* */

        request({
            url: url + queryParams,
            method: 'GET'
        }, function (error, response, body) {
            const placesJson = JSON.parse(
                    convert.xml2json(body, {
                    compact: true,
                    spaces: 4
                })
            )
            console.log(placesJson)
            res.json(placesJson.response.body.items)
        });
    }
}