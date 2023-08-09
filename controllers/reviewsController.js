const axios = require('axios');

exports.aggregate = (async (req, res, next) => {
    if (!req.query.url || !req.query.source_name) {
        return res.status(406).json({
            "response_code": 406,
            "error": {
                messsage: "Pass mandatory fields url and source_name"
            }
        });
    }

    let valid_sources = ["yelp", "facebook", "glassdoor"];

    if (valid_sources.indexOf(req.query.source_name) == -1) {
        return res.status(406).json({
            "response_code": 406,
            "error": {
                messsage: "Invalid source name"
            }
        });

    };


    let output = [];
    let result_count = 0;
    let sendResponse = {
        review_count: 0,
        aggregated_reviews: [],
        review_aggregated_count: 0,
        response_code: 200
    };
    let getData = async function(start=0){
        let sort_by = "recency";
        let limit = 10;
        let token = "b0245046a570d1357995008f7d30f253c155f77a";
        let source = req.query.source_name;
        let id;
        if(source == "yelp"){
            let split_urls = req.query.url.split('/biz/');
            id = split_urls[1];
        } else if (source == "glassdoor"){
            let split_urls = req.query.url.split('/Reviews/');
            split_urls = split_urls[1].split("-");
            id = split_urls[split_urls.length -1].replace(".htm","");
            id = id.replace(/[a-zA-Z]+/g,'');
        }else if (source == "facebook"){
            let split_urls = req.query.url.split('.com/');
            split_urls = split_urls[1].split("/reviews");
            id = split_urls[0];
        }
        // let url = `https://api.yelp.com/v3/businesses/${split_urls[1]}/reviews?sort_by=${sort_by}&offset=${start}&limit=50`
        let url = `https://wextractor.com/api/v1/reviews/${source}?id=${id}&auth_token=${token}&offset=${start}&sort=${sort_by}`
        if(source == "facebook"){
            url = `https://wextractor.com/api/v1/reviews/${source}?id=${id}&auth_token=${token}`
            if(start){
                url += "cursor=" + start;
            }
        }
        let options = {
            url: url,
            method: "GET"
        };
        let response = await axios(options).catch((e)=>{
            console.log("Error: ", e.response);
            if(!output.length){
                sendResponse = {
                    response_code: (e.response && e.response.status) || 400,
                    error: {
                        message: (e.response && e.response.data && e.response.data.error) || "Bad request"
                    }
                }
            }
        })

        if(source == "facebook"){
            if (response && response.data && response.data.reviews && response.data.reviews.length == 5) {
                output = output.concat(response.data.reviews);
                result_count += response.data.reviews.length;
            }
            if(response && response.data && response.data.private_reviews && !output.length){
                sendResponse = {
                    response_code: 400,
                    error: {
                        message: "Reviews are mark as private"
                    }
                }
            }
            if(response && response.data && response.data.next_page_cursor){
                getData(response.data.next_page_cursor);
            }
        } else {
            if (response && response.data && response.data.reviews && response.data.reviews.length == 10) {
                output = output.concat(response.data.reviews);
                result_count += response.data.reviews.length;
                // getData(start+limit);  // uncomment this line if you want to fetch all the reviews
            }
        }
    };
    await getData();
    let rating_count = 0;
    if(output.length){
        for(let record of output){
            rating_count += parseFloat(record.rating);
            let obj = {
                "rating": parseFloat(record.rating),
                "review_date": (record.datetime && record.datetime.split(' ')[0]) || "",
                "comment": record.text,
                "reviewer_name": record.reviewer
            };
            sendResponse.aggregated_reviews.push(obj);
        }
        sendResponse.review_count = result_count;
        sendResponse.review_aggregated_count = rating_count / (5 * result_count);
    }

    if(req.query.filter_date && sendResponse.aggregated_reviews && sendResponse.aggregated_reviews.length){
        let result = sendResponse.aggregated_reviews.filter(d => {
            var time = new Date(req.query.filter_date).getTime();
            return ( new Date(d.review_date).getTime() >= time);
        });
        sendResponse.aggregated_reviews = result;
    }
    res.status(200).json(sendResponse);
});

