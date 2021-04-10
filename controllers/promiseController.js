const axios = require('axios')
const dotenv = require('dotenv');
dotenv.config()
const convert = require('xml-js');
const request = require('request');

module.exports = {
    getCandidates: async (req, res) => {
        // console.log(req.headers)
        let { sgId, sgTypecode } = req.body
        if (sgId && sgTypecode) {   
            let url = 'http://apis.data.go.kr/9760000/PofelcddInfoInqireService/getPofelcddRegistSttusInfoInqire';
            let queryParams = '?' + encodeURIComponent('ServiceKey') + '=' + process.env.SERVICEKEY; /* Service Key*/
            queryParams += '&' + encodeURIComponent('pageNo') + '=' + encodeURIComponent('1'); /* */
            queryParams += '&' + encodeURIComponent('numOfRows') + '=' + encodeURIComponent('100'); /* */
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
                if (placesJson.response.body === undefined) {
                    res.status(500).json({
                        message: 'Internal server error'
                    })
                } else {
                    res.status(200).json(placesJson.response.body.items.item)
                }
            });
        } else {
            res.status(404).json({
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
            queryParams += '&' + encodeURIComponent('numOfRows') + '=' + encodeURIComponent('10'); /* */
            queryParams += '&' + encodeURIComponent('sgId') + '=' + encodeURIComponent(sgId); /* */
            queryParams += '&' + encodeURIComponent('sgTypecode') + '=' + encodeURIComponent(sgTypecode); /* */
            queryParams += '&' + encodeURIComponent('cnddtId') + '=' + encodeURIComponent(cnddtId); /* */
            request({
                url: url + queryParams,
                method: 'GET'
            }, function (error, response, body) {
                console.log(body)
                
                // const placesJson = JSON.parse(
                //         convert.xml2json(body, {
                //         compact: true,
                //         spaces: 4
                //     })
                // )
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
            res.status(404).json({
                message: 'post correct info'
            })
        }
    }
}