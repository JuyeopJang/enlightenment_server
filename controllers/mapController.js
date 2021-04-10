const axios = require('axios')
const dotenv = require('dotenv');
dotenv.config()
const convert = require('xml-js');
const request = require('request');

module.exports = {
    getElections: async (req, res) => {
        //오늘 날짜랑 비교해서 이후의 선거목록만 전달하기!
        const electionCodeUrl = `http://apis.data.go.kr/9760000/CommonCodeService/getCommonSgCodeList?ServiceKey=${process.env.SERVICEKEY}&numOfRows=100`
        axios.get(electionCodeUrl)
        .then(elections => {
            let currDate = new Date()
            let mm = currDate.getMonth() + 1; // getMonth() is zero-based
            let dd = currDate.getDate();

            let yyyymmdd = [currDate.getFullYear(),
                (mm > 9 ? '' : '0') + mm,
                (dd > 9 ? '' : '0') + dd
            ].join('');
            const electionsJson = JSON.parse(
                    convert.xml2json(elections.data, {
                    compact: true,
                    spaces: 4
                })
            )
            if (electionsJson.result) {
                res.status(404).json({
                    message: 'Not found'
                })
            } else {
                // let result = electionsJson.response.body.items.item.filter(election => {
                //     const gijun = yyyymmdd - election.sgId['_text']
                //     return gijun >= 300 && gijun <= 9100 
                // })
                res.status(200).json(electionsJson.response.body.items.item.map(item => {
                    return {
                        id: item.num['_text'],
                        sgId: item.sgId['_text'],
                        sgName: item.sgName['_text'],
                        sgTypecode: item.sgTypecode['_text']
                    }
                }))
            }
        })
    },
    getPlaces: async (req, res) => {
        let { sgId, sdName, wiwName } = req.body
        if (sgId && sdName && wiwName) {
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
                if (placesJson.result) {
                    res.status(404).json({
                        message: 'Not found'
                    })
                } else {
                    res.status(200).json(placesJson.response.body.items.item.map(item => {
                        return {
                            id: item.num['_text'],
                            placeName: item.placeName['_text'],
                            sdName: item.sdName['_text'],
                            wiwName: item.wiwName['_text'],
                            emdName: item.emdName['_text'],
                            addr: item.addr['_text']
                        }
                    }))
                }

            });
        } else {
            res.status(400).json({
                message: 'post correct info'
            })
        }
    }
}