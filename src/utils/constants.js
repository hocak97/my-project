console.log('🚀 ~ process.env:', process.env);

let apiRoot = '';
if (process.env.BUILD_MODE === 'dev') {

  apiRoot = 'http://localhost:8017';
}
if (process.env.BUILD_MODE === 'production') {
  apiRoot = 'https://my-api-coem.onrender.com';

}
export const API_ROOT = apiRoot;
