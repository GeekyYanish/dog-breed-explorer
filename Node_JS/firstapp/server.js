const http = require('node:http');
const { getDataFromDB } = require('./database/db.js');
const { sendJSONResponse } = require('./utils/sendJSONResponse.js');
const { getDataByPathParams } = require('./utils/getDataByPathParams.js');
const getDataByQueryParams = require('./utils/getDataByQueryParams');

const PORT=8000
const server= http.createServer(async(req,res)=>{
const destinations = await getDataFromDB()

const urlObj = new URL(req.url, `http://${req.headers.host}`)
  const queryObj = Object.fromEntries(urlObj.searchParams)
  

    if (urlObj.pathname === '/api' && req.method === 'GET') {
      let filteredData=getDataByQueryParams(destinations,queryObj)
      console.log(queryObj)
        sendJSONResponse(res,200,filteredData)
  }
  else if(req.url.startsWith('/api/continent') && req.method === 'GET' ){
    const continent=req.url.split('/').pop()
    const filteredData=getDataByPathParams(destinations,'continent',continent)
    sendJSONResponse(res,200,filteredData)
  }
  else if(req.url.startsWith('/api/country') && req.method === 'GET' ){
    const country=req.url.split('/').pop()
    const filteredData=getDataByPathParams(destinations,'country',country)
    sendJSONResponse(res,200,filteredData)
  }
  else{
    sendJSONResponse(res,404,({error:'not found',message:'Requested route is not exist'}))

  }
  
})

server.listen(PORT, () => console.log(`Server is running on : ${PORT}`))