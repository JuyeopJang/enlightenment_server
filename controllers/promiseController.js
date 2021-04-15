const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();
const convert = require('xml-js');
const request = require('request');

module.exports = {
    getCandidates: async (req, res) => {
        // console.log(req.headers)
        let { sgId, sgTypecode, sdName, sggName } = req.body
        if (sgId && sgTypecode) {   
            
            let url = 'http://apis.data.go.kr/9760000/PofelcddInfoInqireService/getPofelcddRegistSttusInfoInqire';
            // let url = 'http://apis.data.go.kr/9760000/WinnerInfoInqireService2/getWinnerInfoInqire'
            let queryParams = '?' + encodeURIComponent('ServiceKey') + '=' + process.env.SERVICEKEY; /* Service Key*/
            queryParams += '&' + encodeURIComponent('pageNo') + '=' + encodeURIComponent('1'); /* */
            queryParams += '&' + encodeURIComponent('numOfRows') + '=' + encodeURIComponent('2000'); /* */
            queryParams += '&' + encodeURIComponent('sgId') + '=' + encodeURIComponent(sgId); /* */
            queryParams += '&' + encodeURIComponent('sgTypecode') + '=' + encodeURIComponent(sgTypecode); /* */
            queryParams += '&' + encodeURIComponent('sdName') + '=' + encodeURIComponent(sdName); /* */
            queryParams += '&' + encodeURIComponent('sggName') + '=' + encodeURIComponent(sggName); /* */
            console.log(url+queryParams)
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
                            huboid: item.huboid['_text'],
                            name: item.name['_text'],
                            sggName: item.sggName['_text'],
                            sdName: item.sdName['_text'],
                            wiwName: item.wiwName['_text'],
                            jdName: item.jdName['_text'],
                            age: item.age['_text'],
                            edu: item.edu['_text'],
                            career1: item.career1['_text'],
                            career2: item.career2['_text']
                        }
                    }))
                }
            });
        } else {
            res.status(400).json({
                message: 'post correct info'
            })
        }
    },
    getPromises: async (req, res) => {
        let { sgId, sgTypecode, cnddtId } = req.body;
        if (sgId && sgTypecode && cnddtId) {
            let url = 'http://apis.data.go.kr/9760000/ElecPrmsInfoInqireService/getCnddtElecPrmsInfoInqire';
            let queryParams = '?' + encodeURIComponent('ServiceKey') + '=' + process.env.SERVICEKEY;
            queryParams += '&' + encodeURIComponent('pageNo') + '=' + encodeURIComponent('1'); /* */
            queryParams += '&' + encodeURIComponent('numOfRows') + '=' + encodeURIComponent('1000'); /* */
            queryParams += '&' + encodeURIComponent('sgId') + '=' + encodeURIComponent(sgId); /* */
            queryParams += '&' + encodeURIComponent('sgTypecode') + '=' + encodeURIComponent(sgTypecode); /* */
            queryParams += '&' + encodeURIComponent('cnddtId') + '=' + encodeURIComponent(cnddtId); /* */
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
                res.send('후보자 공약 조회!')
                // if (placesJson.response.body === undefined) {
                //     res.status(500).json({
                //         message: 'Internal server error'
                //     })
                // } else {
                //     res.status(200).json(placesJson.response.body.items.item)
                // }
            });
        } else {
            res.status(400).json({
                message: 'post correct info'
            })
        }
    },
    getElectionPlaces: async (req, res) => {
        let { sgId, sgTypecode } = req.body;
        if (sgId && sgTypecode) {
            let url = 'http://apis.data.go.kr/9760000/CommonCodeService/getCommonSggCodeList';
            let queryParams = '?' + encodeURIComponent('ServiceKey') + '=' + process.env.SERVICEKEY; /* Service Key*/
            queryParams += '&' + encodeURIComponent('pageNo') + '=' + encodeURIComponent('1'); /* */
            queryParams += '&' + encodeURIComponent('numOfRows') + '=' + encodeURIComponent('1000'); /* */
            queryParams += '&' + encodeURIComponent('sgId') + '=' + encodeURIComponent(sgId); /* */
            queryParams += '&' + encodeURIComponent('sgTypecode') + '=' + encodeURIComponent(sgTypecode); /* */
    
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
                    if (Array.isArray(placesJson.response.body.items.item)) {
                        res.status(200).json(placesJson.response.body.items.item.map(item => {
                            return {
                                id: item.num['_text'],
                                sggName: item.sggName['_text'],
                                sdName: item.sdName['_text'],
                                wiwName: item.wiwName['_text']
                            }
                        }))
                    } else {
                        res.status(200).json([
                            {
                                id: placesJson.response.body.items.item.num['_text'],
                                sggName: placesJson.response.body.items.item.sggName['_text'],
                                sdName: placesJson.response.body.items.item.sdName['_text'],
                                wiwName: ''
                            }
                        ])
                    }
                }
            });
        } else {
            res.status(400).json({
                message: 'post correct info'
            })
        }
    }
}