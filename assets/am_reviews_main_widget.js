"use strict";
(async function () {
    const domain = '' || window.location.hostname;
    const carouselContainer = document.getElementById('automizely_reviews_carousel_v2_production');
    const params = {
        sid: window.Shopify.shop,
        sk: window.Shopify.shop.split('.')[0],
        sp: window.Shopify ? 'shopify' : '',
        pid: carouselContainer.dataset.pid,
        sprw: carouselContainer.dataset.sprw || '0',
        _s_rspb: carouselContainer.dataset.s_rspb || '1',
        oid: carouselContainer.dataset.oid,
        v: '4',
    };
    if (params.sprw !== '1')
        return;
    const frame = document.createElement('iframe');
    frame.src = `https://${domain}/apps/automizely-reviews/gallery/?_s_rspb=${params._s_rspb}&pid=${params.pid}&sid=${params.sid}&sk=${params.sk}&sp=${params.sp}&sprw=${params.sprw}&v=${params.v}`;
    frame.style = 'border:none;margin-top:32px;display:block;';
    frame.width = '100%';
    frame.height = window.screen.width < 768 ? '938px' : '858px';
    frame.scrolling = 'no';
    frame.id = 'product_page_reviews_carousel';
    carouselContainer.appendChild(frame);
    frame.onload = function () {
        postData();
        const script = document.createElement('script');
        script.src = `https://widgets.automizely.com/reviews/v1/sdk.js?_s_rspb=${params._s_rspb}&sprw=${params.sprw}&oid=${params.oid}&v=${4}&shop=${params.sid}`;
        document.body.appendChild(script);
    };
    window.addEventListener('resize', () => {
        frame.height = window.screen.width < 768 ? '938px' : '858px';
    });
    window.addEventListener('message', (e) => {
        // message that was passed from iframe page
        const message = e.data;
        if (!message)
            return;
        if (!message.height && !message.no_reviews_height)
            return;
        if (message.source === 'main_widget_review_list') {
            frame.style.height = `${message.height}px`;
            return;
        }
        if (message.type === 'handleNoReviews') {
            frame.style.height = `${message.no_reviews_height}`;
            return;
        }
    });
    function postData() {
        const getShopifyData = () => {
            try {
                const shopify = {
                    Shopify: JSON.parse(JSON.stringify(window.Shopify)) || null,
                    ShopifyAnalyticsMeta: window.ShopifyAnalytics
                        ? JSON.parse(JSON.stringify(window.ShopifyAnalytics.meta))
                        : null,
                };
                return shopify;
            }
            catch (err) {
                return {
                    Shopify: null,
                    ShopifyAnalyticsMeta: null,
                };
            }
        };
        frame.contentWindow.postMessage({
            type: 'data',
            value: {
                orgId: params.oid,
                Shopify: getShopifyData().Shopify,
                ShopifyAnalyticsMeta: getShopifyData().ShopifyAnalyticsMeta,
            },
        }, '*');
    }
})();
