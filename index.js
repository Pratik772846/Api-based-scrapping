const axios = require('axios');
const {JSDOM} = require('jsdom');


const getProductUrl = (product_id)=> `https://www.amazon.in/gp/product/ajax/?asin=${product_id}&m=&qid=1663303481&smid=&sourcecustomerorglistid=&sourcecustomerorglistitemid=&sr=8-1-spons&pc=dp&experienceId=aodAjaxMain`

 async function getPrices(product_id){
    const productUrl = getProductUrl(product_id);
    const {data : html}= await axios.get(productUrl,{
        headers: {
            accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
            host :'www.amazon.in',
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36',
            pragma: 'no-cache',
            TE: 'Trailers',
            'upgrade-insecure-requests': '1',
        },
    });
    const dom = new JSDOM(html);
    const getElement =(selector)=> dom.window.document.querySelector(selector);
    const title=getElement('#aod-asin-title-text').textContent.trim();
    // console.log(dom.window.document.querySelector('.a-price .a-offscreen').textContent);
    // console.log(data);

    const getOffer = (element)=>{
   
    const price =element.querySelector('.a-price .a-offscreen').textContent;
    // const pinnedOfferID= pinnedElement.querySelector('input[name="offeringID.1"]').getAttribute('value');
    const ships_from = element.querySelector('#aod-offer-shipsFrom .a-col-right .a-size-small').textContent;
    const sold_by = element.querySelector('#aod-offer-soldBy .a-col-right .a-size-small').textContent;
    return {
         price,
        // offer_id : pinnedOfferID,
         ships_from,
        sold_by,
    };
};

const pinnedElement = getElement('#pinned-de-id');

// const pinnedprice =pinnedElement.querySelector('.a-price .a-offscreen').textContent;
// // const pinnedOfferID= pinnedElement.querySelector('input[name="offeringID.1"]').getAttribute('value');
// const pinnedShippedfrom = pinnedElement.querySelector('#aod-offer-shipsFrom .a-col-right .a-size-small').textContent;
// const pinnedsoldby = pinnedElement.querySelector('#aod-offer-soldBy .a-col-right .a-size-small').textContent;
// const pinned={
//     price : pinnedprice,
//     // offer_id : pinnedOfferID,
//     shipsfrom : pinnedShippedfrom,
//     soldby : pinnedsoldby,
// };


    const offerListElements = getElement('#aod-offer-list');
    const offerElements = offerListElements.querySelectorAll('.aod-information-block');
    const offers=[];
    // offerElements.array.forEach(element => {
        
    // });
    offerElements.forEach((offerElement)=>{
        const price =offerElement.querySelector('.a-price .a-offscreen').textContent;
        offers.push(getOffer(offerElement));
    });
    const result = {
        title,
        pinned: getOffer(pinnedElement),
        offers,
    };
    console.log(result);
}

getPrices('B0002E4Z8M'); 