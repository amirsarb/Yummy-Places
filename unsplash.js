const { createApi } = require('unsplash-js');
const nodeFetch = require('node-fetch');



const unsplash = createApi({
    accessKey: 'R9SIiaDttMXTvnVGstzQDQ4glEZRRbM0Bzk1uwrkKoM',
    // `fetch` options to be sent with every request
    headers: { 'X-Custom-Header': 'foo' },
});



const photo = unsplash.photos.get(
    { photoId: '123' },
    // `fetch` options to be sent only with _this_ request
    { headers: { 'X-Custom-Header-2': 'bar' } },
);
console.log(photo)